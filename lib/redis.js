import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const KEYS = {
  POLICIES: 'policy-radar:policies',
  UPDATES: 'policy-radar:updates',
  LAST_RUN: 'policy-radar:last-run',
  CHANGELOG: 'policy-radar:changelog',
};
