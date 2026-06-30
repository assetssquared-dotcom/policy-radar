import { redis, KEYS } from '../../../lib/redis';

const today = () => new Date().toISOString().slice(0,10);

async function callClaude(prompt, maxTokens=1200) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}`);
  const data = await res.json();
  const text = (data.content || []).filter(b=>b.type==='text').map(b=>b.text).join('');
  const clean = text.replace(/```json|```/g,'').trim();
  const start = clean.indexOf('[') >= 0 && (clean.indexOf('[') < clean.indexOf('{') || clean.indexOf('{') < 0)
    ? clean.indexOf('[') : clean.indexOf('{');
  const isArray = clean[start] === '[';
  const end = isArray ? clean.lastIndexOf(']') : clean.lastIndexOf('}');
  if (start < 0 || end < 0) throw new Error('JSON 파싱 실패');
  return JSON.parse(clean.slice(start, end+1));
}

// ── 1) 부동산 정책 카드 업데이트 ──────────────────
async function updateRealEstate() {
  const prompt = `오늘(${today()}) 기준 한국 부동산 시장 최신 동향을 검색해서 다음 5개 카드를 JSON 배열로 작성해줘.
각 카드는 {id, tag, color, title, status, impact, desc, effect, keyDate, keyDateLabel, watch} 형식.
id는 각각: policy_realestate, policy_jeonse, policy_pf, policy_reconstruction, policy_polarization
순수 JSON 배열만 반환. 마크다운 금지.
주제: ① 정부 규제(양도세·대출규제) ② 전세·월세 시장 ③ PF·건설사 리스크 ④ 재건축·재개발 ⑤ 지역별 양극화`;
  return await callClaude(prompt, 2500);
}

// ── 2) 정책 충돌 지도 업데이트 ────────────────────
async function updateConflict() {
  const prompt = `오늘(${today()}) 기준 최신 뉴스를 검색해서 글로벌 정책 충돌 구조 5개를 JSON 배열로 작성해줘.
각 항목은 {id, title, tension(1-5), a:{label,color,desc}, b:{label,color,desc}, result, winners:[], losers:[]} 형식.
주제: ① 트럼프 관세 vs 리쇼어링 ② 연준 통화정책 vs 재정지출 ③ AI 인프라 vs 에너지·탄소목표 ④ 미중 디커플링 vs 공급망 ⑤ 달러패권 vs 대안 결제망
순수 JSON 배열만 반환. 마크다운 금지. 한국어로 작성.`;
  return await callClaude(prompt, 2000);
}

// ── 3) 섹터 로테이션 타임라인 업데이트 ─────────────
async function updateRotation() {
  const prompt = `오늘(${today()}) 기준 향후 18개월 섹터 로테이션 시나리오를 JSON 배열로 작성해줘.
각 항목은 {period, theme, color, reason, sectors:[], avoid:[]} 형식.
period는 "지금", "3개월 후", "6개월 후", "1년 후", "18개월 후" 순서로.
최신 거시 이벤트(전쟁, 금리, AI 인프라, 반도체 사이클 등)를 반영해서 작성.
순수 JSON 배열만 반환. 마크다운 금지. 한국어로 작성.`;
  return await callClaude(prompt, 1800);
}

export default async function handler(req, res) {
  const results = {};
  const errors = {};

  try {
    results.realestate = await updateRealEstate();
  } catch(e) { errors.realestate = e.message; }

  try {
    results.conflict = await updateConflict();
  } catch(e) { errors.conflict = e.message; }

  try {
    results.rotation = await updateRotation();
  } catch(e) { errors.rotation = e.message; }

  const updatedAt = new Date().toISOString();

  try {
    if (results.realestate) await redis.set(KEYS.REALESTATE, JSON.stringify({ items: results.realestate, updatedAt }));
    if (results.conflict) await redis.set(KEYS.CONFLICT, JSON.stringify({ items: results.conflict, updatedAt }));
    if (results.rotation) await redis.set(KEYS.ROTATION, JSON.stringify({ items: results.rotation, updatedAt }));
  } catch(e) {
    return res.status(500).json({ error: `Redis save failed: ${e.message}` });
  }

  return res.status(200).json({
    ok: true,
    realestate: results.realestate?.length || 0,
    conflict: results.conflict?.length || 0,
    rotation: results.rotation?.length || 0,
    errors,
  });
}
