import { redis, KEYS } from '../../lib/redis';

async function getKey(key) {
  try {
    const stored = await redis.get(key);
    if (stored) {
      const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
      if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) return parsed;
    }
  } catch (e) {}
  return { items: null, updatedAt: null };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const [realestate, conflict, rotation] = await Promise.all([
    getKey(KEYS.REALESTATE),
    getKey(KEYS.CONFLICT),
    getKey(KEYS.ROTATION),
  ]);
  return res.status(200).json({ realestate, conflict, rotation });
}
