import { redis, KEYS } from '../../lib/redis';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60');
  try {
    const changelog = await redis.get(KEYS.CHANGELOG) || [];
    const lastRun = await redis.get(KEYS.LAST_RUN) || null;
    return res.status(200).json({ changelog, lastRun });
  } catch (e) {
    return res.status(200).json({ changelog: [], lastRun: null, error: e.message });
  }
}
