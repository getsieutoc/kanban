import Redis, { Result, Callback } from 'ioredis';
export const redis = new Redis(
  process.env.REDIS_URL ?? 'redis://Kanban-redis:6379'
);
