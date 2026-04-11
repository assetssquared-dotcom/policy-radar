import { redis, KEYS } from '../../../lib/redis';
import { COUNTRIES } from '../../../data/policies';

const CRON_SECRET = process.env.CRON_SECRET;

// 2026 기준 검색 쿼리 — 유동성·정책 모두 커버
const QUERIES = {
  us: [
    'Federal Reserve interest rate QT policy 2026',
    'US Treasury TGA liquidity debt ceiling 2026',
    'Trump policy tariff trade legislation April 2026',
    'US Congress bill passed AI semiconductor energy 2026',
    'GENIUS Act stablecoin Circle USDC implementation 2026',
  ],
  kr: [
    '한국은행 기준금리 통화정책 2026',
    '한국 이재명 정부 경제정책 반도체 방산 2026',
    'Korea BOK monetary policy HBM defense nuclear 2026',
    '코스피 외국인 밸류업 원화 2026',
  ],
  cn: [
    'PBOC China monetary policy LPR RRR easing 2026',
    'China economic stimulus policy technology AI 2026',
    '중국 인민은행 금리 부양책 AI 반도체 2026',
    'China rare earth export control minerals 2026',
  ],
  eu: [
    'ECB European Central Bank interest rate 2026',
    'EU ReArm Europe defense spending policy 2026',
    'European Union AI Act CBAM MiCA implementation 2026',
    'EU energy policy industrial strategy 2026',
  ],
  jp: [
    'Bank of Japan BOJ interest rate hike yen carry 2026',
    'Japan fiscal policy defense semiconductor Rapidus 2026',
    '日本銀行 金利 政策 2026',
    'Japan corporate governance shareholder return 2026',
  ],
};

async function updatePolicies(countryId) {
  const queries = QUERIES[countryId];
  const country = COUNTRIES.find(c => c.id === countryId);
  const existingIds = (country?.policies || []).map(p => p.id);

  const systemPrompt = `당신은 글로벌 투자 정책 분석 AI입니다. 2026년 4월 기준 최신 정보로 분석하세요.

임무:
1. 유지 중인 정책의 상태 변화 감지 (active → paused 등)
2. 새로운 정책 발견 시 추가
3. 종료·만료된 정책은 제외
4. 유동성 정책(금리·QT·부양책)도 반드시 포함

기존 정책 ID (이미 분석됨, 새로운 것만 추가): ${existingIds.join(', ')}

JSON 스키마 (배열로 반환, 없으면 []):
{
  "id": "snake_case_unique_id",
  "name": "정책명 — 부제목",
  "budget": "예산/규모 한 줄 요약",
  "date": "YYYY-MM~",
  "themes": ["theme_id_from_list"],
  "status": "active | upcoming | paused",
  "background": "투자자 관점 배경 설명 (2~3문단, 한글)",
  "beneficiaries": [
    {
      "sector": "섹터명",
      "impact": 1~5 정수,
      "pos": true/false,
      "stocks": ["한글명(티커)"],
      "etfs": ["ETF티커"]
    }
  ],
  "risks": "리스크 설명 한 문장",
  "budgetData": [{"name":"항목","value":숫자,"max":숫자}],
  "timeline": [{"date":"날짜","event":"이벤트"}]
}

테마 ID 목록: semiconductor, ai_policy, defense, energy_transition, nuclear, dollar_hegemony, stablecoin, reshoring, yuan_intl, critical_minerals, supply_chain, debt_fiscal, real_estate

규칙: 순수 JSON 배열만 반환. 마크다운 없음.`;

  const userPrompt = `다음 검색어로 최신 정책을 조사하고 분석하세요:
${queries.map((q, i) => `${i+1}. ${q}`).join('\n')}

국가: ${country?.name || countryId}
오늘 날짜: 2026년 4월 기준으로 분석`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const data = await response.json();
    // Extract text blocks (after web search tool use)
    const textBlocks = (data.content || []).filter(b => b.type === 'text');
    const text = textBlocks.map(b => b.text).join('');

    // Parse JSON
    const jsonMatch = text.match(/\[.*\]/s);
    if (!jsonMatch) return [];
    const clean = jsonMatch[0].replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    console.error(`Error for ${countryId}:`, e.message);
    return [];
  }
}

export default async function handler(req, res) {
  // Auth check
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results = {};
  let totalNew = 0;

  for (const countryId of ['us', 'kr', 'cn', 'eu', 'jp']) {
    try {
      const newPolicies = await updatePolicies(countryId);
      results[countryId] = newPolicies.length;
      totalNew += newPolicies.length;

      if (newPolicies.length > 0) {
        // Load existing data from Redis or static
        let existing = [];
        try {
          const stored = await redis.get(KEYS.POLICIES);
          if (stored) {
            const parsed = JSON.parse(stored);
            existing = parsed.countries || [];
          }
        } catch {}

        if (existing.length === 0) {
          existing = COUNTRIES;
        }

        // Merge new policies
        const countryData = existing.find(c => c.id === countryId);
        if (countryData) {
          const existingIds = new Set(countryData.policies.map(p => p.id));
          const toAdd = newPolicies.filter(p => !existingIds.has(p.id));
          countryData.policies = [...countryData.policies, ...toAdd];
          countryData.updated = new Date().toISOString().split('T')[0];

          await redis.set(KEYS.POLICIES, JSON.stringify({
            countries: existing,
            lastUpdated: new Date().toISOString(),
          }));

          // Log to changelog
          for (const p of toAdd) {
            const changelog = JSON.parse(await redis.get(KEYS.CHANGELOG) || '[]');
            changelog.unshift({
              date: new Date().toISOString(),
              countryId,
              policyId: p.id,
              policyName: p.name,
              status: p.status,
            });
            await redis.set(KEYS.CHANGELOG, JSON.stringify(changelog.slice(0, 50)));
          }
        }
      }
    } catch (e) {
      console.error(`Failed ${countryId}:`, e.message);
      results[countryId] = -1;
    }
  }

  return res.status(200).json({
    success: true,
    totalNew,
    results,
    timestamp: new Date().toISOString(),
  });
}
