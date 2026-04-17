import { redis, KEYS } from '../../lib/redis';
import { COUNTRIES, THEMES, MACRO_THEMES } from '../../data/policies';

// Redis 데이터의 AI 업데이트 내용은 유지하되,
// data/policies.js의 핵심 필드(name/budget/date/background/timeline/beneficiaries)는 항상 최신으로 덮어씀
function mergeWithStatic(redisCountries, staticCountries) {
  // static을 기준으로 맵 생성
  const staticMap = {};
  for (const country of staticCountries) {
    staticMap[country.id] = country;
    if (country.policies) {
      for (const policy of country.policies) {
        staticMap[`policy_${policy.id}`] = policy;
      }
    }
  }

  return redisCountries.map(country => {
    const staticCountry = staticMap[country.id];
    if (!staticCountry) return country;

    return {
      ...country,
      // 국가 레벨: summary, updated는 Redis(AI 업데이트) 유지
      policies: (country.policies || []).map(policy => {
        const staticPolicy = staticMap[`policy_${policy.id}`];
        if (!staticPolicy) return policy;

        // 핵심 편집 필드는 static으로 덮어씀
        return {
          ...policy,
          name: staticPolicy.name ?? policy.name,
          budget: staticPolicy.budget ?? policy.budget,
          date: staticPolicy.date ?? policy.date,
          status: staticPolicy.status ?? policy.status,
          themes: staticPolicy.themes ?? policy.themes,
          background: staticPolicy.background ?? policy.background,
          timeline: staticPolicy.timeline ?? policy.timeline,
          beneficiaries: staticPolicy.beneficiaries ?? policy.beneficiaries,
          risks: staticPolicy.risks ?? policy.risks,
          budgetData: staticPolicy.budgetData ?? policy.budgetData,
        };
      }),
    };
  });
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
        // Redis 데이터에 static 핵심 필드 덮어쓰기
        const merged = mergeWithStatic(stored, COUNTRIES);
        return res.status(200).json({
          countries: merged,
          themes: THEMES,
          macroThemes: MACRO_THEMES,
          lastUpdated: lastRun?.timestamp || null,
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
