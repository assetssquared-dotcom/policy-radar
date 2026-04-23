import { redis, KEYS } from '../../lib/redis';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const stored = await redis.get(KEYS.NEWS);
    if (stored) {
      const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
      return res.status(200).json(parsed);
    }
  } catch (e) {}
  return res.status(200).json({ items: [], updatedAt: null });
}
