import { createClient, RedisClientType } from "redis";
import { isProduction, authConfig } from "../../../../config";
import log from "../../../../shared/utils/logger";

// VERIFY Redis is installed: redis-server

// START Redis Server -> run command: /etc/init.d/redis-server start
// STOP Redis Server -> run command: /etc/init.d/redis-server stop
// RESTART Redis Server -> run command: /etc/init.d/redis-server restart

/* If Redis Server is not installed on your 
   machine, run this command to install it: 
   --> sudo apt install redis-server */

const port = authConfig.redisServerPort;
const host = authConfig.redisLocalURL;

const redisConnection: RedisClientType = isProduction
  ? createClient({ url: authConfig.redisConnectionString })
  : createClient();

redisConnection.on("connect", () => {
  log.info(`[Redis]: Connected to redis server at ${host}:${port}`);
});

redisConnection.on("error", (err) => log.error("Redis Client Error", err));

redisConnection.connect();

export { redisConnection };
