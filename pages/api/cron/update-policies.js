import { redis, KEYS } from '../../../lib/redis';
import { COUNTRIES } from '../../../data/policies';

// Vercel Cron 인증
const CRON_SECRET = process.env.CRON_SECRET;

// 검색할 국가별 쿼리
const SEARCH_QUERIES = {
  us: [
    'US economic policy tariff stablecoin AI semiconductor 2025',
    'Trump administration new policy legislation 2025',
    'Federal Reserve Fed policy rate decision 2025',
    'US Congress new bill passed technology energy 2025',
  ],
  kr: [
    '한국 정책 반도체 방산 에너지 2025',
    'Korea government policy semiconductor defense nuclear 2025',
    '한국 정부 경제 정책 발표 2025',
    'Korea Bank of Korea monetary policy 2025',
  ],
  cn: [
    'China economic policy stimulus AI technology 2025',
    '중국 경제 정책 AI 반도체 2025',
    'China PBOC yuan policy technology export control 2025',
    'China BYD CATL EV battery policy 2025',
  ],
  eu: [
    'European Union policy defense energy AI regulation 2025',
    'EU ReArm Europe CBAM AI Act MiCA 2025',
    'ECB European Central Bank policy 2025',
    'EU industrial policy energy transition 2025',
  ],
  jp: [
    'Japan BOJ monetary policy semiconductor defense 2025',
    '日本 経済政策 半導体 防衛 2025',
    'Japan Rapidus chip policy corporate reform 2025',
    'Bank of Japan interest rate policy 2025',
  ],
};

// Claude API로 정책 분석 요청 (web search 포함)
async function analyzeNewPolicies(countryId, existingPolicyIds) {
  const queries = SEARCH_QUERIES[countryId];
  const country = COUNTRIES.find(c => c.id === countryId);

  const systemPrompt = `당신은 글로벌 투자 정책 분석가입니다. 
주어진 최신 뉴스를 분석하여 투자자에게 중요한 새로운 정책을 찾아내세요.

기존 분석된 정책 ID 목록: ${existingPolicyIds.join(', ')}
이미 분석된 정책은 제외하고 새로운 정책만 찾으세요.

응답 규칙:
1. 반드시 JSON 배열만 반환하세요. 설명이나 마크다운 없이 순수 JSON만.
2. 새로운 정책이 없으면 빈 배열 [] 반환
3. 각 정책은 아래 스키마를 정확히 따르세요
4. 배경 설명은 한글로, 투자자 관점에서 작성
5. 수혜주는 반드시 한글명(티커) 형식으로 작성
6. impact는 -5(최대 리스크) ~ 5(최대 수혜) 정수

JSON 스키마:
{
  "id": "snake_case_id",
  "name": "정책명 (한글)",
  "budget": "예산/규모 설명",
  "date": "YYYY-MM~",
  "themes": ["theme_id"],
  "status": "active|upcoming|paused",
  "background": "배경 설명 (한글, 2~3단락)",
  "beneficiaries": [
    { "sector": "섹터명", "impact": 5, "pos": true, "stocks": ["종목명(티커)"], "etfs": ["ETF"] }
  ],
  "risks": "리스크 (한글)",
  "budgetData": [{ "name": "항목", "value": 100 }],
  "timeline": [{ "date": "YYYY.MM", "event": "이벤트" }]
}

사용 가능한 theme ID:
dollar_hegemony, petrodollar, stablecoin, reshoring, energy_transition,
semiconductor, yuan_intl, defense, ai_policy, critical_minerals, nuclear,
debt_fiscal, supply_chain, real_estate`;

  const userPrompt = `${country.name}의 최신 정책 동향을 분석하세요.
웹 검색 결과를 바탕으로 투자자에게 중요한 새로운 정책을 찾아주세요.
검색 키워드: ${queries.join(' | ')}
오늘 날짜 기준 최근 7일 이내 발표된 정책을 우선 탐색하세요.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 4,
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error: ${response.status} ${err}`);
  }

  const data = await response.json();

  // 텍스트 블록에서 JSON 추출
  const textBlocks = data.content.filter(b => b.type === 'text');
  const fullText = textBlocks.map(b => b.text).join('');

  // JSON 파싱
  const jsonMatch = fullText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error('JSON parse error for', countryId, fullText.slice(0, 200));
    return [];
  }
}

// 기존 데이터 로드 (Redis or fallback to static)
async function loadCurrentPolicies() {
  try {
    const stored = await redis.get(KEYS.POLICIES);
    if (stored) return stored;
  } catch (e) {
    console.log('Redis not available, using static data');
  }
  return COUNTRIES;
}

// 변경사항 저장
async function saveChangelog(entries) {
  try {
    const existing = await redis.get(KEYS.CHANGELOG) || [];
    const updated = [...entries, ...existing].slice(0, 100); // 최근 100개 유지
    await redis.set(KEYS.CHANGELOG, updated);
  } catch (e) {
    console.error('Changelog save error:', e);
  }
}

export default async function handler(req, res) {
  // GET 요청만 허용 (Vercel Cron은 GET 사용)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cron 인증 확인
  const authHeader = req.headers.authorization;
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startTime = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    countries: {},
    newPoliciesTotal: 0,
    errors: [],
  };

  console.log('[CRON] Policy update started at', results.timestamp);

  // 현재 데이터 로드
  let currentData;
  try {
    currentData = await loadCurrentPolicies();
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load current data', detail: e.message });
  }

  const changelog = [];

  // 국가별 순차 업데이트 (API rate limit 방지)
  for (const country of currentData) {
    try {
      const existingIds = country.policies.map(p => p.id);
      console.log(`[CRON] Analyzing ${country.name}...`);

      const newPolicies = await analyzeNewPolicies(country.id, existingIds);

      if (newPolicies.length > 0) {
        // 기존 ID와 중복 제거
        const trulyNew = newPolicies.filter(p =>
          p.id && !existingIds.includes(p.id) && p.name && p.background
        );

        if (trulyNew.length > 0) {
          // 데이터에 추가
          country.policies = [...trulyNew, ...country.policies];
          country.updated = new Date().toISOString().slice(0, 10);

          results.countries[country.id] = trulyNew.length;
          results.newPoliciesTotal += trulyNew.length;

          // 변경 로그
          trulyNew.forEach(p => {
            changelog.push({
              date: new Date().toISOString(),
              countryId: country.id,
              countryName: country.name,
              policyId: p.id,
              policyName: p.name,
              status: p.status,
            });
          });

          console.log(`[CRON] ${country.name}: ${trulyNew.length} new policies`);
        }
      } else {
        results.countries[country.id] = 0;
      }

      // API 요청 간격 (rate limit 방지)
      await new Promise(r => setTimeout(r, 2000));

    } catch (e) {
      console.error(`[CRON] Error for ${country.id}:`, e.message);
      results.errors.push({ country: country.id, error: e.message });
    }
  }

  // Redis에 업데이트된 데이터 저장
  try {
    await redis.set(KEYS.POLICIES, currentData);
    await redis.set(KEYS.LAST_RUN, results);

    if (changelog.length > 0) {
      await saveChangelog(changelog);
    }

    console.log(`[CRON] Saved to Redis. Total new: ${results.newPoliciesTotal}`);
  } catch (e) {
    console.error('[CRON] Redis save error:', e);
    results.errors.push({ redis: e.message });
  }

  const elapsed = Date.now() - startTime;
  console.log(`[CRON] Done in ${elapsed}ms`);

  return res.status(200).json({
    ...results,
    elapsed: `${elapsed}ms`,
  });
}
