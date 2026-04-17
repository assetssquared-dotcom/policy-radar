import { redis, KEYS } from '../../lib/redis';
import { COUNTRIES, THEMES, MACRO_THEMES } from '../../data/policies';

// data/policies.js의 핵심 편집 필드를 항상 Redis 데이터에 덮어씀
function mergeWithStatic(redisCountries, staticCountries) {
  if (!Array.isArray(redisCountries)) return staticCountries;

  const staticPolicyMap = {};
  for (const country of staticCountries) {
    for (const policy of (country.policies || [])) {
      staticPolicyMap[policy.id] = policy;
    }
  }

  return redisCountries.map(country => {
    return {
      ...country,
      policies: (country.policies || []).map(policy => {
        const sp = staticPolicyMap[policy.id];
        if (!sp) return policy;
        return {
          ...policy,
          name:          sp.name          ?? policy.name,
          budget:        sp.budget        ?? policy.budget,
          date:          sp.date          ?? policy.date,
          status:        sp.status        ?? policy.status,
          themes:        sp.themes        ?? policy.themes,
          background:    sp.background    ?? policy.background,
          timeline:      sp.timeline      ?? policy.timeline,
          beneficiaries: sp.beneficiaries ?? policy.beneficiaries,
          risks:         sp.risks         ?? policy.risks,
          budgetData:    sp.budgetData    ?? policy.budgetData,
        };
      }),
    };
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  const forceStatic = req.query.refresh === 'true'
    && req.headers['x-admin-secret'] === process.env.ADMIN_SECRET;

  if (!forceStatic) {
    try {
      const stored = await redis.get(KEYS.POLICIES);
      const lastRun = await redis.get(KEYS.LAST_RUN);

      if (stored) {
        // stored = { countries: [...], lastUpdated: '...' }
        const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
        const redisCountries = parsed?.countries ?? parsed;

        const merged = mergeWithStatic(redisCountries, COUNTRIES);
        return res.status(200).json({
          countries: merged,
          themes: THEMES,
          macroThemes: MACRO_THEMES,
          lastUpdated: lastRun?.timestamp || parsed?.lastUpdated || null,
          source: 'redis+static',
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
