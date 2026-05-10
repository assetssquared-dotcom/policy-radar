import { redis, KEYS } from '../../../lib/redis';

const TODAY = new Date().toISOString().slice(0, 10);

const NEWS_QUERIES = [
  '미-이란 전쟁 호르무즈 봉쇄 협상 2026년 5월 최신',
  '연준 FOMC 금리 파월 후임 2026년 5월 최신',
  '미중 관세 협상 타결 2026년 5월 최신',
  'BOJ 일본은행 금리 엔화 2026년 5월 최신',
  'K-방산 수출 계약 한국 2026년 5월 최신',
  'GENIUS Act 스테이블코인 2026년 5월 최신',
  '한국 부동산 아파트 전세 2026년 5월 최신',
  'SK하이닉스 HBM 엔비디아 루빈 2026년 최신',
  '코스피 증시 외국인 2026년 5월 최신',
  'EU AI Act CBAM 탄소 2026년 최신',
];

async function callClaude(query) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing');

  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    messages: [{ role: 'user', content:
      `오늘은 ${TODAY}입니다. 2026년 기준 최신 뉴스를 찾아주세요.
반드시 2026년 날짜의 뉴스여야 합니다. 2025년 이전 뉴스는 사용하지 마세요.
아래 JSON 형식으로만 답하세요. 백틱, 마크다운 없이 순수 JSON만.

{"title":"제목(한국어,30자이내)","summary":"핵심내용(한국어,80자이내)","date":"2026-MM-DD","impact":"투자영향(30자이내)","url":"출처URL"}

검색 주제: ${query}` }],
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
    const item = JSON.parse(clean.slice(start, end + 1));
    // 2025년 이전 날짜면 오늘 날짜로 교정
    if (item.date && !item.date.startsWith('2026')) {
      item.date = TODAY;
    }
    return item;
  }
  throw new Error(`JSON 파싱 실패: ${clean.slice(0,100)}`);
}

export default async function handler(req, res) {
  const results = [];
  const errors = [];

  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return res.status(500).json({ error: 'Redis env missing' });
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
      return res.status(500).json({ error: `Redis save failed: ${e.message}` });
    }
  }

  return res.status(200).json({ ok: true, count: results.length, errors });
}
