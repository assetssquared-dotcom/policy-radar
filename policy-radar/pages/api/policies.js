import { redis, KEYS } from '../../lib/redis';
import { COUNTRIES, THEMES, MACRO_THEMES } from '../../data/policies';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  try {
    // Redis에서 최신 데이터 시도
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
    // Redis 없으면 static fallback
    console.log('Redis fallback:', e.message);
  }

  // Static fallback
  return res.status(200).json({
    countries: COUNTRIES,
    themes: THEMES,
    macroThemes: MACRO_THEMES,
    lastUpdated: null,
    source: 'static',
  });
}
