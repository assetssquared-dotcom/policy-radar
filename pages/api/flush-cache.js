import { redis, KEYS } from '../../lib/redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const secret = req.headers['x-admin-secret'];
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await redis.del(KEYS.POLICIES);
    await redis.del(KEYS.LAST_RUN);
    await redis.del(KEYS.UPDATES);
    return res.status(200).json({ ok: true, message: 'Redis cache cleared. Next request will use static data.' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
