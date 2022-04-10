import config from "config";

const authConfig = {
  secret: config.get("authConfig.secret"),
  tokenExpiryTime: 300, // seconds => 5 minutes
  redisServerPort: config.get("authConfig.redisServerPort") || 6379,
  redisServerURL: config.get("authConfig.redisServerURL"),
  redisConnectionString: config.get("authConfig.redisConnectionString"),
};

export { authConfig };
