import { keys } from "../../keys";

const authConfig = {
  secret_token: process.env.APP_SECRET_TOKEN,
  accessTokenPrivateKey: keys.ACCESS_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: keys.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPrivateKey: keys.REFRESH_TOKEN_PRIVATE_KEY,
  refreshTokenPublicKey: keys.REFRESH_TOKEN_PUBLIC_KEY,
  tokenExpiryTime: 300, // seconds => 5 minutes
  redisServerPort: process.env.DDD_FORUM_REDIS_PORT || 6379,
  redisServerURL: process.env.DDD_FORUM_REDIS_SERVER_URL,
  redisLocalURL: process.env.DDD_FORUM_REDIS_LOCAL_URL,
  redisConnectionString: process.env.REDIS_URL,
};

export { authConfig };
