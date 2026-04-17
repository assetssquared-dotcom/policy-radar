import { redis, KEYS } from '../../lib/redis';
import { COUNTRIES, THEMES, MACRO_THEMES } from '../../data/policies';

// Redis 데이터의 AI 업데이트 내용은 유지하되,
// data/policies.js의 핵심 필드는 항상 최신으로 덮어씀
function mergeWithStatic(redisCountries, staticCountries) {
  const staticPolicyMap = {};
  for (const country of staticCountries) {
    for (const policy of (country.policies || [])) {
      staticPolicyMap[policy.id] = policy;
    }
  }

  return redisCountries.map(country => ({
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
  }));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const forceStatic = req.query.refresh === 'true'
    && req.headers['x-admin-secret'] === process.env.ADMIN_SECRET;

  if (!forceStatic) {
    try {
      const stored = await redis.get(KEYS.POLICIES);
      const lastRun = await redis.get(KEYS.LAST_RUN);

      if (stored) {
        // stored = { countries: [...], lastUpdated: '...' } 구조
        const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
        const redisCountries = parsed?.countries ?? parsed;

        if (Array.isArray(redisCountries) && redisCountries.length > 0) {
          const merged = mergeWithStatic(redisCountries, COUNTRIES);
          return res.status(200).json({
            countries: merged,
            themes: THEMES,
            macroThemes: MACRO_THEMES,
            lastUpdated: parsed?.lastUpdated || lastRun?.timestamp || null,
            source: 'redis+static',
          });
        }
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
