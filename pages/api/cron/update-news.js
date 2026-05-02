import { redis, KEYS } from '../../../lib/redis';

const NEWS_QUERIES = [
  '미-이란 전쟁 협상 결렬 호르무즈 2026년 5월',
  '연준 FOMC 금리 결정 2026년 5월',
  '미중 관세 협상 2026년 5월 최신',
  'BOJ 일본은행 금리 결정 2026년 5월',
  'K-방산 수출 계약 2026년 최신',
  'GENIUS Act 스테이블코인 법안 2026 최신',
  'EU AI Act 시행 2026 최신',
  '한국 부동산 아파트 시장 2026년 5월',
  'Nvidia Rubin GPU HBM4 2026 latest',
  '코스피 주식시장 2026년 5월 최신',
];

async function callClaude(query) {
  try {
    const body = {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content:
        `다음 주제의 최신 뉴스 1건을 찾아서 JSON으로만 답해줘. 마크다운, HTML 태그, 백틱 없이 순수 JSON만.
{"title":"제목(한국어,30자이내)","summary":"핵심내용(한국어,80자이내)","date":"YYYY-MM-DD","impact":"투자영향(30자이내)","url":"출처URL"}
주제: ${query}` }],
    };

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    const text = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text).join('');

    const clean = text.replace(/```json|```/g, '').trim();
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(clean.slice(start, end + 1));
    }
  } catch(e) {}
  return null;
}

export default async function handler(req, res) {
  // Vercel Cron 또는 수동 호출 모두 허용
  const auth = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET;
  
  const isVercelCron = cronSecret && auth === `Bearer ${cronSecret}`;
  const isAdmin = adminSecret && req.headers['x-admin-secret'] === adminSecret;
  
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

  if (results.length > 0) {
    const payload = {
      items: results,
      updatedAt: new Date().toISOString(),
      errors: errors.length,
    };
    await redis.set(KEYS.NEWS, JSON.stringify(payload));
  }

  return res.status(200).json({ ok: true, count: results.length, errors });
}
