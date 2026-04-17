import { redis, KEYS } from '../../lib/redis';
import { COUNTRIES, THEMES, MACRO_THEMES } from '../../data/policies';

// static이 항상 이김 — Redis는 AI가 업데이트한 summary/updated만 유지
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
      // static 필드가 항상 우선 (??가 아니라 직접 덮어씀)
      return {
        ...policy,
        name:          sp.name,
        budget:        sp.budget,
        date:          sp.date,
        status:        sp.status,
        themes:        sp.themes,
        background:    sp.background,
        timeline:      sp.timeline,
        beneficiaries: sp.beneficiaries,
        risks:         sp.risks,
        budgetData:    sp.budgetData,
      };
    }),
  }));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    const stored = await redis.get(KEYS.POLICIES);
    const lastRun = await redis.get(KEYS.LAST_RUN);

    if (stored) {
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

  return res.status(200).json({
    countries: COUNTRIES,
    themes: THEMES,
    macroThemes: MACRO_THEMES,
    lastUpdated: null,
    source: 'static',
  });
}
