import { redis, KEYS } from '../../lib/redis';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const stored = await redis.get(KEYS.NEWS);
    if (stored) {
      const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
      if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
        return res.status(200).json(parsed);
      }
    }
  } catch (e) {}
  // Redis에 데이터 없으면 null 반환 → 프론트에서 기본값 유지
  return res.status(200).json({ items: null, updatedAt: null });
}
