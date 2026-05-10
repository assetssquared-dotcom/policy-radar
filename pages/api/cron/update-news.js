import { redis, KEYS } from '../../../lib/redis';

const NEWS_QUERIES = [
  '미-이란 전쟁 호르무즈 2026년 5월 최신',
  '연준 FOMC 금리 2026년 5월',
  '미중 관세 2026년 5월',
  'BOJ 금리 2026년 5월',
  'K-방산 수출 2026년 5월',
];

async function callClaude(query) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing');

  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content:
      `다음 주제의 최신 뉴스 1건을 찾아서 JSON으로만 답해줘. 백틱 없이 순수 JSON만.
{"title":"제목(한국어,30자이내)","summary":"핵심내용(한국어,80자이내)","date":"YYYY-MM-DD","impact":"투자영향(30자이내)","url":"출처URL"}
주제: ${query}` }],
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API ${res.status}: ${err.slice(0,200)}`);
  }

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
  throw new Error(`JSON 파싱 실패: ${clean.slice(0,100)}`);
}

export default async function handler(req, res) {
  const results = [];
  const errors = [];

  // Redis 연결 확인
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!redisUrl || !redisToken) {
    return res.status(500).json({ error: 'Redis env missing', redisUrl: !!redisUrl, redisToken: !!redisToken });
  }

  for (const query of NEWS_QUERIES) {
    try {
      const item = await callClaude(query);
      if (item && item.title) results.push({ ...item, query });
    } catch (e) {
      errors.push({ query, error: e.message });
    }
  }

  if (results.length > 0) {
    try {
      const payload = { items: results, updatedAt: new Date().toISOString() };
      await redis.set(KEYS.NEWS, JSON.stringify(payload));
    } catch(e) {
      return res.status(500).json({ error: `Redis save failed: ${e.message}`, results });
    }
  }

  return res.status(200).json({ ok: true, count: results.length, errors });
}
