import { redis, KEYS } from '../../lib/redis';
import { COUNTRIES, THEMES, MACRO_THEMES } from '../../data/policies';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  // ?refresh=true 또는 x-admin-secret 헤더로 Redis 캐시 무시
  const forceStatic = req.query.refresh === 'true'
    && req.headers['x-admin-secret'] === process.env.ADMIN_SECRET;

  if (!forceStatic) {
    try {
      const stored = await redis.get(KEYS.POLICIES);
      const lastRun = await redis.get(KEYS.LAST_RUN);

      if (stored) {
        return res.status(200).json({
          countries: stored,
          themes: THEMES,
          macroThemes: MACRO_THEMES,
          lastUpdated: lastRun?.timestamp || null,
          source: 'redis',
        });
      }
    } catch (e) {
      console.log('Redis fallback:', e.message);
    }
  }

  return res.status(200).json({
    countries: COUNTRIES,
    themes: THEMES,
    macroThemes: MACRO_THEMES,
    lastUpdated: null,
    source: 'static',
  });
}
