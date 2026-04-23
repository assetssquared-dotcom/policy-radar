import { redis, KEYS } from '../../../lib/redis';

// 토큰 최소화: 뉴스 10개 항목, 각 150자 이내
// 전체 1회 호출로 처리 (정책별 개별 호출 없음)
const NEWS_QUERIES = [
  'GENIUS Act stablecoin 2026 latest',
  '미-이란 전쟁 호르무즈 협상 최신',
  'Fed interest rate 2026 decision',
  '미중 관세 협상 2026 최신',
  'BOJ interest rate hike 2026',
  'K-방산 수출 계약 최신',
  'EU AI Act enforcement 2026',
  '한국 부동산 양도세 2026 최신',
  'Nvidia Rubin GPU HBM4 2026',
  'CBAM carbon tariff 2026',
];

async function callClaude(query) {
  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content:
      `다음 주제의 최신 뉴스 1건을 찾아서 JSON으로만 답해줘. HTML 태그 없이.
{"title":"제목(한국어,30자이내)","summary":"핵심내용(한국어,80자이내)","date":"YYYY-MM-DD","impact":"투자영향(30자이내)","url":"출처URL또는빈문자열"}
주제: ${query}` }],
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  // 텍스트 블록에서 JSON 추출
  const text = (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text).join('');

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(clean.slice(start, end + 1));
    }
  } catch {}
  return null;
}

export default async function handler(req, res) {
  const auth = req.headers['authorization'];
  const isVercelCron = auth === `Bearer ${process.env.CRON_SECRET}`;
  const isAdmin = req.headers['x-admin-secret'] === process.env.ADMIN_SECRET;
  if (!isVercelCron && !isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results = [];
  const errors = [];

  for (const query of NEWS_QUERIES) {
    try {
      const item = await callClaude(query);
      if (item && item.title) {
        results.push({ ...item, query });
      }
    } catch (e) {
      errors.push({ query, error: e.message });
    }
  }

  const payload = {
    items: results,
    updatedAt: new Date().toISOString(),
    errors: errors.length,
  };

  await redis.set(KEYS.NEWS, JSON.stringify(payload));

  return res.status(200).json({ ok: true, count: results.length, errors });
}
