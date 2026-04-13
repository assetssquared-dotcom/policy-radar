import { redis, KEYS } from '../../../lib/redis';
import { COUNTRIES } from '../../../data/policies';

const CRON_SECRET = process.env.CRON_SECRET;

// ── 국가별 검색 쿼리 (2026 기준) ──────────────────────
const QUERIES = {
  us: [
    'Federal Reserve interest rate QT policy decision April 2026',
    'US Treasury TGA debt ceiling liquidity April 2026',
    'Trump tariff trade China policy update April 2026',
    'US Congress bill stablecoin GENIUS Act Circle USDC 2026',
    'Trump Accounts baby investment IRS implementation 2026',
    'Stargate AI data center semiconductor export control 2026',
    'DOGE government cuts Elon Musk federal spending 2026',
    'US LNG energy export policy 2026',
  ],
  kr: [
    '한국은행 기준금리 통화정책 결정 2026',
    '이재명 정부 경제정책 반도체 방산 원전 2026',
    'SK하이닉스 삼성전자 HBM 수출 2026',
    '코스피 밸류업 외국인 수급 원화 2026',
    '한국 AI기본법 방위산업 원전수출 2026',
  ],
  cn: [
    'PBOC China interest rate LPR RRR monetary easing 2026',
    'China economic stimulus fiscal policy 2026',
    'China rare earth export control minerals ban 2026',
    'DeepSeek China AI semiconductor 2026',
    'China EV battery BYD CATL export 2026',
    '중국 위안화 국제화 mBridge BRICS 2026',
  ],
  eu: [
    'ECB European Central Bank interest rate decision 2026',
    'EU ReArm Europe defense spending procurement 2026',
    'EU AI Act implementation enforcement 2026',
    'CBAM carbon border tax implementation 2026',
    'MiCA crypto stablecoin regulation Europe 2026',
    'EU energy industrial policy 2026',
  ],
  jp: [
    'Bank of Japan BOJ interest rate hike yen carry 2026',
    'Japan fiscal defense spending Rapidus semiconductor 2026',
    'Japan corporate governance shareholder buyback dividend 2026',
    'yen dollar exchange rate Japan 2026',
  ],
};

// ── 기존 정책 검증 쿼리 ──────────────────────────────
function buildVerifyQuery(policy) {
  return `Is this policy still active in April 2026? Policy: "${policy.name}". Budget: "${policy.budget}". Current status: ${policy.status}. Check if: (1) still being implemented, (2) any major status changes, (3) any key data updates like stock listings or budget figures.`;
}

// ── Claude API 호출 헬퍼 ───────────────────────────────
async function callClaude(systemPrompt, userPrompt, useWebSearch = true) {
  const tools = useWebSearch ? [{ type: 'web_search_20250305', name: 'web_search' }] : [];
  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  };
  if (tools.length > 0) body.tools = tools;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const textBlocks = (data.content || []).filter(b => b.type === 'text');
  return textBlocks.map(b => b.text).join('');
}

function parseJSON(text) {
  try {
    const m = text.match(/\[[\s\S]*\]/);
    if (m) return JSON.parse(m[0]);
  } catch {}
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
  } catch {}
  return null;
}

// ── 1) 신규 정책 탐지 ─────────────────────────────────
async function detectNewPolicies(countryId, existingIds) {
  const country = COUNTRIES.find(c => c.id === countryId);
  const queries = QUERIES[countryId];

  const system = `당신은 글로벌 투자 정책 분석 AI입니다. 2026년 4월 기준으로 분석하세요.

기존 정책 ID (이미 추적 중): ${existingIds.join(', ')}

새로운 정책만 JSON 배열로 반환하세요. 없으면 [].
각 항목 스키마:
{
  "id": "snake_case_id",
  "name": "정책명 — 부제",
  "budget": "규모 한 줄",
  "date": "YYYY-MM~",
  "themes": ["theme_id"],
  "status": "active|upcoming|paused",
  "background": "투자자 관점 설명 2문단 (한글)",
  "beneficiaries": [{"sector":"섹터","impact":1~5,"pos":true,"stocks":["한글명(티커)"],"etfs":["ETF"]}],
  "risks": "리스크 한 문장",
  "budgetData": [{"name":"항목","value":숫자,"max":숫자}],
  "timeline": [{"date":"날짜","event":"이벤트"}]
}

테마 ID: semiconductor, ai_policy, defense, energy_transition, nuclear, dollar_hegemony, stablecoin, reshoring, yuan_intl, critical_minerals, supply_chain, debt_fiscal, real_estate

규칙: 순수 JSON만. 유동성 정책(금리·QT·부양책) 포함.`;

  const user = `${country?.name} 최신 정책 조사:
${queries.map((q,i) => (i+1)+'. '+q).join('\n')}`;

  const text = await callClaude(system, user, true);
  return parseJSON(text) || [];
}

// ── 2) 기존 정책 상태 업데이트 ───────────────────────
async function verifyExistingPolicies(countryId, policies) {
  if (!policies || policies.length === 0) return [];

  const system = `당신은 글로벌 투자 정책 검증 AI입니다. 2026년 4월 기준으로 각 정책의 최신 상태를 확인하세요.

다음 정책들의 현재 상태를 JSON 배열로 반환하세요:
[
  {
    "id": "정책ID",
    "status": "active|upcoming|paused",  // 변경 없으면 기존 값
    "stockUpdates": {"기존티커": "새티커"},  // 상장 변경 시
    "statusChanged": true/false,
    "note": "변경사항 한 줄 요약 (없으면 null)"
  }
]

규칙: 순수 JSON만. 변경 없는 것도 포함.`;

  const policyList = policies.slice(0, 8).map(p =>
    '- ID: ' + p.id + ' | 이름: ' + p.name + ' | 현재상태: ' + p.status + ' | 예산: ' + p.budget
  ).join('\n');

  const user = '다음 정책들의 2026년 4월 현재 상태를 웹 검색으로 확인하세요:\n' + policyList;

  const text = await callClaude(system, user, true);
  return parseJSON(text) || [];
}

// ── 메인 핸들러 ───────────────────────────────────────
export default async function handler(req, res) {
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results = { new: {}, updated: {}, errors: {} };
  let totalNew = 0, totalUpdated = 0;

  // Redis에서 기존 데이터 로드
  let storedCountries = COUNTRIES;
  try {
    const stored = await redis.get(KEYS.POLICIES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.countries) storedCountries = parsed.countries;
    }
  } catch {}

  for (const countryId of ['us', 'kr', 'cn', 'eu', 'jp']) {
    try {
      const countryData = storedCountries.find(c => c.id === countryId);
      if (!countryData) continue;

      const existingIds = countryData.policies.map(p => p.id);

      // 1) 신규 정책 탐지
      const newPolicies = await detectNewPolicies(countryId, existingIds);
      const toAdd = newPolicies.filter(p => p.id && !existingIds.includes(p.id));

      if (toAdd.length > 0) {
        countryData.policies = [...countryData.policies, ...toAdd];
        results.new[countryId] = toAdd.length;
        totalNew += toAdd.length;
      }

      // 2) 기존 정책 상태 검증 (8개씩 배치)
      const verifications = await verifyExistingPolicies(countryId, countryData.policies);
      let updCount = 0;

      for (const v of (verifications || [])) {
        const policy = countryData.policies.find(p => p.id === v.id);
        if (!policy) continue;

        if (v.statusChanged && v.status && v.status !== policy.status) {
          policy.status = v.status;
          updCount++;
        }

        // 티커 업데이트
        if (v.stockUpdates) {
          for (const [oldTicker, newTicker] of Object.entries(v.stockUpdates)) {
            policy.beneficiaries = (policy.beneficiaries || []).map(b => ({
              ...b,
              stocks: (b.stocks || []).map(s => s === oldTicker ? newTicker : s),
            }));
          }
          if (Object.keys(v.stockUpdates).length > 0) updCount++;
        }
      }

      if (updCount > 0) {
        results.updated[countryId] = updCount;
        totalUpdated += updCount;
      }

      countryData.updated = new Date().toISOString().split('T')[0];

    } catch (e) {
      results.errors[countryId] = e.message;
      console.error(`Error ${countryId}:`, e);
    }
  }

  // Redis 저장
  try {
    await redis.set(KEYS.POLICIES, JSON.stringify({
      countries: storedCountries,
      lastUpdated: new Date().toISOString(),
    }));

    // Changelog 기록
    if (totalNew > 0) {
      const existing = JSON.parse(await redis.get(KEYS.CHANGELOG) || '[]');
      for (const [cId, count] of Object.entries(results.new)) {
        existing.unshift({
          date: new Date().toISOString(),
          countryId: cId,
          policyName: `신규 정책 ${count}개 추가`,
          status: 'active',
        });
      }
      await redis.set(KEYS.CHANGELOG, JSON.stringify(existing.slice(0, 50)));
    }
  } catch (e) {
    console.error('Redis save error:', e);
  }

  return res.status(200).json({
    success: true,
    totalNew,
    totalUpdated,
    results,
    timestamp: new Date().toISOString(),
  });
}
