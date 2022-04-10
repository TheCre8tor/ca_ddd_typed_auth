import redis from "redis";
import { RedisClientType } from "redis";
import { isProduction, authConfig } from "../../../../config";

const port = authConfig.redisServerPort;
const host = authConfig.redisLocalURL;

const redisConnection: RedisClientType = isProduction
  ? redis.createClient({ url: authConfig.redisConnectionString })
  : redis.createClient();

redisConnection.on("connect", () => {
  console.log(`[Redis]: Connected to redis server at ${host}:${port}`);
});

export { redisConnection };
