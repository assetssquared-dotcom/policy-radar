import { redis, KEYS } from '../../../lib/redis';
import { COUNTRIES } from '../../../data/policies';

const CRON_SECRET = process.env.CRON_SECRET;

function todayLabel() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월`;
}

// ── 국가별 전 부처 정책 탐지 쿼리 ────────────────
const NEW_POLICY_QUERIES = {
  us: [
    // 국방부·DARPA·군사
    'Pentagon DoD defense policy program contract latest',
    'DARPA new program technology defense latest',
    'US military AI autonomous weapons procurement',
    'US defense semiconductor chip supply chain national security',
    // 상무부·무역
    'Commerce Department export controls chips technology latest',
    'Trump tariff trade policy latest',
    'US reshoring manufacturing incentive latest',
    // 재무부·연준·유동성
    'Federal Reserve interest rate decision latest',
    'US Treasury TGA liquidity debt latest',
    'GENIUS Act stablecoin crypto policy latest',
    // 에너지부·인프라
    'Department of Energy nuclear quantum AI infrastructure',
    'US LNG energy export power grid latest',
    'Stargate AI data center infrastructure latest',
    // 국토안보·사이버
    'CISA cybersecurity critical infrastructure policy latest',
    'US quantum computing DARPA NQIA latest',
    // 농업부·식량
    'USDA food supply chain fertilizer policy latest',
  ],
  kr: [
    // 한국은행·기재부
    '한국은행 기준금리 통화정책 최신',
    '기획재정부 예산 경제정책 최신',
    // 산업부·과기부
    '산업통상자원부 반도체 배터리 방산 수출 최신',
    '과학기술정보통신부 AI 양자 정책 최신',
    // 방산·국방
    '방위사업청 방산 수출 계약 최신',
    '한국 방산 K2 K9 FA50 수출 계약',
    // 에너지·원전
    '한국 원전 SMR 수출 에너지 정책 최신',
    '한국 전력망 변압기 전선 수출',
    // 반도체·AI
    'SK하이닉스 삼성전자 HBM 패키징 최신',
    '한국 AI 반도체 밸류업 코스피',
  ],
  cn: [
    // 인민은행·재정부
    'PBOC China LPR RRR monetary policy latest',
    'China fiscal stimulus spending policy latest',
    // 국방·군사
    'China PLA military AI defense technology latest',
    'China defense spending budget program latest',
    // 기술·산업
    'China semiconductor chip AI DeepSeek latest',
    'China rare earth critical minerals export control latest',
    'China EV battery BYD CATL policy latest',
    // 외교·무역
    'China US trade war tariff retaliation latest',
    'China yuan internationalization mBridge BRICS latest',
  ],
  eu: [
    // ECB·재정
    'ECB European Central Bank interest rate latest',
    'EU fiscal spending deficit rules latest',
    // 국방·안보
    'EU ReArm Europe defense procurement spending latest',
    'NATO defense budget spending latest',
    // 산업·기술
    'EU AI Act implementation enforcement latest',
    'EU CBAM carbon border tax latest',
    'EU critical minerals supply chain policy latest',
    // 에너지
    'EU energy independence LNG nuclear policy latest',
    'EU semiconductor chips act factory latest',
  ],
  jp: [
    // 일본은행·재무성
    'Bank of Japan BOJ interest rate policy latest',
    'Japan fiscal stimulus spending budget latest',
    // 국방·안보
    'Japan defense spending military budget latest',
    'Japan US security alliance chip semiconductor latest',
    // 산업·기술
    'Japan Rapidus semiconductor chip policy latest',
    'Japan corporate governance shareholder return latest',
    'Japan rare earth critical minerals supply latest',
  ],
};

// ── 기존 정책 업데이트 쿼리 ───────────────────────
const UPDATE_QUERIES = {
  us: 'Latest US government policy news across all departments: DoD DARPA defense, Commerce trade exports, Treasury Fed rates, Energy nuclear quantum, DHS cyber, USDA food',
  kr: '한국 전 부처 최신 정책: 한국은행 금리, 기재부 예산, 산업부 반도체방산에너지, 과기부 AI양자, 방사청 방산수출, 원전수출',
  cn: 'Latest China government policy: PBOC monetary, PLA defense, MIIT technology, NDRC industrial, rare earth minerals, EV semiconductor AI',
  eu: 'Latest EU policy: ECB rates, ReArm defense, AI Act, CBAM carbon, energy independence, chips act, critical minerals',
  jp: 'Latest Japan policy: BOJ rates, defense budget, Rapidus semiconductor, corporate governance, US security alliance, rare earth',
};

// ── Claude API 호출 ───────────────────────────────
async function callClaude(system, user, useSearch) {
  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    system,
    messages: [{ role: 'user', content: user }],
  };
  if (useSearch) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('API error: ' + res.status);
  const data = await res.json();
  return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
}

function safeParseArray(text) {
  try { const m = text.match(/\[[\s\S]*\]/); if (m) return JSON.parse(m[0]); } catch {}
  return [];
}
function safeParseObject(text) {
  try { const m = text.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); } catch {}
  return null;
}

// ── 1) 신규 정책 탐지 ─────────────────────────────
async function detectNew(countryId, existingIds) {
  const queries = NEW_POLICY_QUERIES[countryId];
  const country = COUNTRIES.find(c => c.id === countryId);
  const today = todayLabel();

  const system = `글로벌 정책 분석. ${today} 기준.
기존ID(제외): ${existingIds.slice(-15).join(',')}

경제·금융뿐 아니라 국방·기술·에너지·사이버·식량·무역 등 모든 부처 정책 포함.
새 정책만 JSON배열. 없으면[].
[{"id":"id","name":"이름","budget":"규모","date":"YYYY-MM~","themes":["id"],"status":"active|upcoming","background":"설명(한글 2문단)","beneficiaries":[{"sector":"섹터","impact":3,"pos":true,"stocks":["종목(티커)"],"etfs":["ETF"]}],"risks":"리스크","budgetData":[],"timeline":[]}]
테마: semiconductor,ai_policy,defense,energy_transition,nuclear,dollar_hegemony,stablecoin,reshoring,yuan_intl,critical_minerals,supply_chain,debt_fiscal,real_estate,quantum,cyber
규칙: 순수JSON만. HTML태그 절대 금지.`;

  const q = queries.map((q,i)=>(i+1)+'. '+q).join('\n');
  const text = await callClaude(system, (country?.name||countryId)+' 전 부처 최신 정책:\n'+q, true);
  return safeParseArray(text);
}

// ── 2) 기존 정책 상태 점검 ────────────────────────
async function checkUpdates(countryId, policies) {
  if (!policies?.length) return [];
  const today = todayLabel();
  const pList = policies.slice(0,8).map(p=>p.id+':'+p.name).join(', ');

  const system = `정책 상태 점검. ${today} 기준.
JSON: {"updates":[{"id":"ID","statusChanged":false,"newStatus":"active","note":"변경사항(없으면null)"}]}
순수JSON만. HTML태그 절대 금지.`;

  const text = await callClaude(system,
    `다음 정책들의 최신 상태 확인:\n${pList}`, true);
  const parsed = safeParseObject(text);
  return parsed?.updates || [];
}

// ── 메인 핸들러 ───────────────────────────────────
export default async function handler(req, res) {
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startTime = Date.now();
  const log = { new: {}, updated: {}, errors: {}, apiCalls: 0 };
  let totalNew = 0, totalUpdated = 0;

  let countries = COUNTRIES.map(c => ({ ...c, policies: [...(c.policies||[])] }));
  try {
    const stored = await redis.get(KEYS.POLICIES);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.countries?.length) countries = parsed.countries;
    }
  } catch (e) {
    log.errors.redis_load = e.message;
  }

  for (const countryId of ['us','kr','cn','eu','jp']) {
    const countryData = countries.find(c => c.id === countryId);
    if (!countryData) continue;

    try {
      const existingIds = (countryData.policies||[]).map(p=>p.id);

      // 1) 신규 탐지
      const newPolicies = await detectNew(countryId, existingIds);
      log.apiCalls++;
      const toAdd = (newPolicies||[]).filter(p => p?.id && !existingIds.includes(p.id));
      if (toAdd.length) {
        countryData.policies = [...(countryData.policies||[]), ...toAdd];
        log.new[countryId] = toAdd.length;
        totalNew += toAdd.length;
      }

      // 2) 상태 점검
      const updates = await checkUpdates(countryId, countryData.policies);
      log.apiCalls++;
      let updCount = 0;
      for (const u of (updates||[])) {
        const p = countryData.policies.find(x=>x.id===u.id);
        if (!p || !u.statusChanged) continue;
        if (u.newStatus && u.newStatus !== p.status) {
          p.status = u.newStatus;
          updCount++;
        }
        if (u.note && u.note !== 'null') {
          const today = new Date().toISOString().slice(0,10);
          p.background = (p.background||'') + '\n\n(' + today + ') ' + u.note;
          updCount++;
        }
      }
      if (updCount) { log.updated[countryId] = updCount; totalUpdated += updCount; }

      countryData.updated = new Date().toISOString().slice(0,10);

    } catch (e) {
      log.errors[countryId] = e.message;
    }
  }

  try {
    await redis.set(KEYS.POLICIES, JSON.stringify({
      countries,
      lastUpdated: new Date().toISOString(),
    }));
    if (totalNew > 0 || totalUpdated > 0) {
      let cl = [];
      try { cl = JSON.parse(await redis.get(KEYS.CHANGELOG)||'[]'); } catch {}
      cl.unshift({
        date: new Date().toISOString(),
        policyName: `업데이트 완료 — 신규 ${totalNew}개 · 변경 ${totalUpdated}개`,
        status: 'active',
      });
      await redis.set(KEYS.CHANGELOG, JSON.stringify(cl.slice(0,50)));
    }
  } catch (e) {
    log.errors.redis_save = e.message;
  }

  const elapsed = ((Date.now() - startTime)/1000).toFixed(1);
  return res.status(200).json({
    success: true, totalNew, totalUpdated,
    apiCalls: log.apiCalls,
    elapsed: elapsed + 's',
    log,
  });
}
