import { redis, KEYS } from '../../../lib/redis';
import { COUNTRIES } from '../../../data/policies';

const CRON_SECRET = process.env.CRON_SECRET;

// ── 국가별 신규 정책 탐지 쿼리 ────────────────────
const NEW_POLICY_QUERIES = {
  us: ['Federal Reserve interest rate QT 2026', 'US Treasury TGA debt ceiling 2026',
       'Trump tariff trade China 2026', 'GENIUS Act stablecoin USDC 2026',
       'Trump Accounts baby investment 2026', 'Stargate AI data center 2026',
       'US infrastructure copper grid bottleneck 2026', 'US LNG energy export 2026'],
  kr: ['한국은행 기준금리 2026', '이재명 정부 경제정책 2026',
       'SK하이닉스 삼성 HBM 수출 2026', '한국 방산 변압기 전선 수출 2026',
       '코스피 밸류업 외국인 2026'],
  cn: ['PBOC China LPR RRR monetary 2026', 'China stimulus fiscal 2026',
       'China rare earth export control 2026', 'DeepSeek China AI 2026',
       'China EV BYD CATL 2026'],
  eu: ['ECB interest rate 2026', 'EU ReArm defense 2026',
       'EU AI Act CBAM MiCA 2026', 'Europe energy grid 2026'],
  jp: ['BOJ interest rate yen 2026', 'Japan defense Rapidus 2026',
       'Japan corporate governance buyback 2026'],
};

// ── 기존 정책 업데이트 쿼리 ───────────────────────
const UPDATE_QUERIES = {
  us: 'Latest news on US economic and financial policies April 2026: Federal Reserve rates, Treasury TGA, tariffs, stablecoins, AI infrastructure, LNG exports',
  kr: '2026년 4월 한국 경제 정책 최신 뉴스: 한국은행 금리, HBM 반도체 수출, 방산 수출, 밸류업',
  cn: 'Latest China economic policy news April 2026: PBOC rates, stimulus, rare earth controls, AI technology',
  eu: 'Latest EU policy news April 2026: ECB rates, ReArm defense, AI Act, CBAM carbon tax, energy',
  jp: 'Latest Japan policy news April 2026: BOJ rates, yen carry, corporate governance, Rapidus semiconductor',
};

// ── API 호출 헬퍼 ─────────────────────────────────
async function callClaude(systemPrompt, userContent, useWebSearch) {
  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  };
  if (useWebSearch) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  return text;
}

function parseJSONArray(text) {
  try {
    const m = text.match(/\[[\s\S]*\]/);
    if (m) return JSON.parse(m[0]);
  } catch {}
  return [];
}

function parseJSONObject(text) {
  try {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
  } catch {}
  return null;
}

// ── 1) 신규 정책 탐지 ─────────────────────────────
async function detectNew(countryId, existingIds) {
  const queries = NEW_POLICY_QUERIES[countryId];
  const country = COUNTRIES.find(c => c.id === countryId);
  const queryText = queries.map((q, i) => (i + 1) + '. ' + q).join('\n');

  const system = `투자 정책 분석 AI. 2026년 4월 기준. 기존 정책 ID: ${existingIds.join(', ')}
새 정책만 JSON 배열로. 없으면 []. 스키마:
[{"id":"snake_id","name":"정책명","budget":"규모","date":"YYYY-MM~","themes":["id"],"status":"active|upcoming","background":"설명(한글 2문단)","beneficiaries":[{"sector":"섹터","impact":1~5,"pos":true,"stocks":["한글명(티커)"],"etfs":["ETF"]}],"risks":"리스크","budgetData":[{"name":"항목","value":숫자,"max":숫자}],"timeline":[{"date":"날짜","event":"이벤트"}]}]
테마: semiconductor,ai_policy,defense,energy_transition,nuclear,dollar_hegemony,stablecoin,reshoring,yuan_intl,critical_minerals,supply_chain,debt_fiscal,real_estate
규칙: 순수JSON만.`;

  const text = await callClaude(system, (country ? country.name : countryId) + ' 최신 정책:\n' + queryText, true);
  return parseJSONArray(text);
}

// ── 2) 기존 정책 내용 업데이트 ───────────────────
async function updateExisting(countryId, policies) {
  if (!policies || policies.length === 0) return {};
  const query = UPDATE_QUERIES[countryId];
  const policyList = policies.slice(0, 10).map(p => p.id + ': ' + p.name).join(', ');

  const system = `투자 정책 업데이트 AI. 2026년 4월 기준.
다음 정책들의 최신 상태를 JSON으로 반환:
{"updates": [{"id":"정책ID","status":"active|upcoming|paused","backgroundAppend":"추가할 최신 내용 1~2문장(없으면 null)","stockUpdates":{"구티커":"새티커"},"statusNote":"변경이유(없으면 null)"}]}
규칙: 변경사항 없으면 statusNote=null. 순수JSON만.`;

  const userMsg = query + '\n\n점검 정책: ' + policyList;
  const text = await callClaude(system, userMsg, true);
  const parsed = parseJSONObject(text);
  return parsed && parsed.updates ? parsed.updates : [];
}

// ── 메인 ─────────────────────────────────────────
export default async function handler(req, res) {
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const log = { new: {}, updated: {}, errors: {}, timestamp: new Date().toISOString() };
  let totalNew = 0, totalUpdated = 0;

  // Redis에서 현재 데이터 로드
  let countries = COUNTRIES.map(c => ({ ...c, policies: [...c.policies] }));
  try {
    const stored = await redis.get(KEYS.POLICIES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.countries && parsed.countries.length > 0) {
        countries = parsed.countries;
      }
    }
  } catch (e) {
    console.error('Redis load error:', e.message);
  }

  for (const countryId of ['us', 'kr', 'cn', 'eu', 'jp']) {
    try {
      const countryData = countries.find(c => c.id === countryId);
      if (!countryData) continue;

      const existingIds = countryData.policies.map(p => p.id);

      // 1) 신규 정책 탐지
      const newPolicies = await detectNew(countryId, existingIds);
      const toAdd = (newPolicies || []).filter(p => p && p.id && !existingIds.includes(p.id));
      if (toAdd.length > 0) {
        countryData.policies = [...countryData.policies, ...toAdd];
        log.new[countryId] = toAdd.length;
        totalNew += toAdd.length;
      }

      // 2) 기존 정책 업데이트
      const updates = await updateExisting(countryId, countryData.policies);
      let updCount = 0;
      for (const u of (updates || [])) {
        const p = countryData.policies.find(x => x.id === u.id);
        if (!p) continue;

        // 상태 변경
        if (u.status && u.status !== p.status) {
          p.status = u.status;
          updCount++;
        }

        // 배경 내용 추가
        if (u.backgroundAppend && u.backgroundAppend !== 'null') {
          p.background = (p.background || '') + '\n\n[' + new Date().toISOString().slice(0,10) + ' 업데이트] ' + u.backgroundAppend;
          updCount++;
        }

        // 티커 업데이트
        if (u.stockUpdates && Object.keys(u.stockUpdates).length > 0) {
          for (const [oldT, newT] of Object.entries(u.stockUpdates)) {
            (p.beneficiaries || []).forEach(b => {
              b.stocks = (b.stocks || []).map(s => s === oldT ? newT : s);
            });
          }
          updCount++;
        }
      }

      if (updCount > 0) {
        log.updated[countryId] = updCount;
        totalUpdated += updCount;
      }

      countryData.updated = new Date().toISOString().split('T')[0];

    } catch (e) {
      log.errors[countryId] = e.message;
      console.error('Error for', countryId, e.message);
    }
  }

  // Redis 저장
  try {
    await redis.set(KEYS.POLICIES, JSON.stringify({
      countries,
      lastUpdated: new Date().toISOString(),
    }));

    // Changelog 기록
    if (totalNew > 0 || totalUpdated > 0) {
      let cl = [];
      try { cl = JSON.parse(await redis.get(KEYS.CHANGELOG) || '[]'); } catch {}
      cl.unshift({
        date: new Date().toISOString(),
        countryId: 'all',
        policyName: '일일 업데이트 — 신규 ' + totalNew + '개 · 갱신 ' + totalUpdated + '개',
        status: 'active',
      });
      await redis.set(KEYS.CHANGELOG, JSON.stringify(cl.slice(0, 50)));
    }
  } catch (e) {
    log.errors.redis = e.message;
  }

  return res.status(200).json({ success: true, totalNew, totalUpdated, log });
}
