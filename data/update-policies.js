import { redis, KEYS } from '../../../lib/redis';
import { COUNTRIES } from '../../../data/policies';

const CRON_SECRET = process.env.CRON_SECRET;

// 날짜를 동적으로 생성 (하드코딩 제거)
function todayLabel() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월`;
}

// ── 국가별 신규 정책 탐지 쿼리 ───────────────────
const NEW_POLICY_QUERIES = {
  us: [
    'Federal Reserve interest rate decision latest',
    'US Treasury TGA debt ceiling liquidity',
    'Trump tariff trade China latest',
    'GENIUS Act stablecoin Circle USDC update',
    'Stargate AI data center semiconductor',
    'US LNG energy export latest',
  ],
  kr: [
    '한국은행 기준금리 결정 최신',
    '한국 정부 경제정책 반도체 방산',
    'SK하이닉스 삼성전자 HBM 수출',
    '한국 밸류업 코스피 외국인',
  ],
  cn: [
    'PBOC China LPR RRR monetary policy latest',
    'China economic stimulus fiscal latest',
    'China rare earth export control update',
    'DeepSeek China AI semiconductor latest',
  ],
  eu: [
    'ECB European Central Bank interest rate latest',
    'EU ReArm Europe defense spending',
    'EU AI Act CBAM implementation',
  ],
  jp: [
    'Bank of Japan BOJ interest rate latest',
    'Japan yen carry trade defense Rapidus',
  ],
};

// ── Claude API 호출 ───────────────────────────────
async function callClaude(system, user, useSearch) {
  const body = {
    model: 'claude-haiku-4-5-20251001', // Haiku로 비용 절감 (Sonnet의 1/5 비용)
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

// ── 1) 신규 정책 탐지 (국가당 1회 API 호출) ──────
async function detectNew(countryId, existingIds) {
  const queries = NEW_POLICY_QUERIES[countryId];
  const country = COUNTRIES.find(c => c.id === countryId);
  const today = todayLabel();

  const system = `정책 분석. ${today} 기준. 기존ID: ${existingIds.slice(-15).join(',')}
새 정책만 JSON배열. 없으면[]. 스키마:
[{"id":"id","name":"이름","budget":"규모","date":"YYYY-MM~","themes":["id"],"status":"active","background":"설명","beneficiaries":[{"sector":"섹터","impact":3,"pos":true,"stocks":["종목(티커)"],"etfs":["ETF"]}],"risks":"리스크","budgetData":[],"timeline":[]}]
규칙: 순수JSON만. 진짜 새로운 것만.`;

  const q = queries.map((q,i)=>(i+1)+'. '+q).join('\n');
  const text = await callClaude(system, (country?.name||countryId)+':\n'+q, true);
  return safeParseArray(text);
}

// ── 2) 기존 정책 상태 점검 (국가당 1회 API 호출) ─
async function checkUpdates(countryId, policies) {
  if (!policies?.length) return [];
  const today = todayLabel();
  const pList = policies.slice(0,8).map(p=>p.id+':'+p.name).join(', ');

  const system = `정책 상태 점검. ${today} 기준.
JSON 반환: {"updates":[{"id":"ID","statusChanged":false,"newStatus":"active","note":"변경사항(없으면null)"}]}
규칙: 실제 변경만. 순수JSON.`;

  const text = await callClaude(system,
    `다음 정책들의 현재 상태 확인:\n${pList}`, true);
  const parsed = safeParseObject(text);
  return parsed?.updates || [];
}

// ── 메인 핸들러 ───────────────────────────────────
export default async function handler(req, res) {
  // 인증
  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startTime = Date.now();
  const log = { new: {}, updated: {}, errors: {}, apiCalls: 0 };
  let totalNew = 0, totalUpdated = 0;

  // 현재 데이터 로드 (Redis 우선, 없으면 정적 데이터)
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

  // 5개국 순차 처리
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

  // Redis 저장
  try {
    await redis.set(KEYS.POLICIES, JSON.stringify({
      countries,
      lastUpdated: new Date().toISOString(),
    }));

    // Changelog
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
