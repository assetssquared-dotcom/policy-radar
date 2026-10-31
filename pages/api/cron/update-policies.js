import * as R from '../../../lib/redis';
import * as D from '../../../data/policies';

export const config = { maxDuration: 300 };

const redis = R.redis || R.default;
const KEYS = R.KEYS || { POLICIES: 'policies', LAST_RUN: 'last-run' };
const MODEL = 'claude-haiku-4-5-20251001';

async function callClaude(system, user) {
  const key = (process.env.ANTHROPIC_API_KEY || '').trim();
  if (!key) throw new Error('ANTHROPIC_API_KEY 환경변수가 비어있음');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      system,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 3 }],
      messages: [{ role: 'user', content: user }],
    }),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`Claude ${r.status}: ${txt.slice(0, 200)}`);
  const j = JSON.parse(txt);
  return (j.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
}

function asList(c) {
  return Array.isArray(c) ? c : Object.values(c || {});
}

export default async function handler(req, res) {
  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  const errors = [];
  let saved = null;
  try {
    const stored = await redis.get(KEYS.POLICIES);
    saved = typeof stored === 'string' ? JSON.parse(stored) : stored;
  } catch (e) {
    errors.push('redis read: ' + e.message);
  }
  let countries = saved && saved.countries && Object.keys(saved.countries).length ? saved.countries : (D.COUNTRIES || D.default);
  countries = JSON.parse(JSON.stringify(countries));

  const sys = `오늘은 ${today}. 반드시 웹검색으로 최근 2주 이내 뉴스만 근거로 한국어로 답한다. 2025년 이전 정보는 쓰지 않는다. 서론 없이 결과만 출력.`;
  let ok = 0;

  for (const c of asList(countries)) {
    const name = c.name || c.id || c.country || '국가';
    try {
      const t = await callClaude(
        sys,
        `${name}의 최신 경제·금융 정책 동향(금리, 규제, 관세, 유동성, 산업정책 포함)을 3문장, 280자 이내로 요약해줘.`
      );
      if (t.length > 20) {
        c.summary = t.slice(0, 300);
        c.updated = today;
        ok++;
      }
    } catch (e) {
      errors.push(`${name}: ${e.message}`);
    }
  }

  // 정책 카드: 하루 8개 순환 점검
  const all = [];
  asList(countries).forEach((c) => (c.policies || []).forEach((p) => all.push({ c, p })));
  const start = (Math.floor(Date.now() / 86400000) * 8) % Math.max(all.length, 1);
  let checked = 0;
  for (let i = 0; i < Math.min(8, all.length); i++) {
    const { c, p } = all[(start + i) % all.length];
    const title = p.title || p.name || p.id;
    try {
      const t = await callClaude(
        sys,
        `정책 "${title}"(${c.name || ''})의 최근 진행 상황을 1~2문장(150자 이내)으로 알려줘. 새 소식이 없으면 "변동 없음"만 출력.`
      );
      if (t && !t.includes('변동 없음')) {
        p.latest = t.slice(0, 200);
        p.updated = today;
      }
      p.checked = today;
      checked++;
    } catch (e) {
      errors.push(`${title}: ${e.message}`);
    }
  }

  if (ok > 0 || checked > 0) {
    try {
      await redis.set(KEYS.POLICIES, JSON.stringify({ countries, lastUpdated: today }));
      await redis.set(KEYS.LAST_RUN, new Date().toISOString());
    } catch (e) {
      errors.push('redis write: ' + e.message);
    }
  }
  res.status(200).json({ ok: errors.length === 0, countriesUpdated: ok, policiesChecked: checked, errors });
}
