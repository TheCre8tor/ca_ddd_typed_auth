import { redisConnection } from "./redis/redis.connection";
import { AuthService } from "./auth/auth.service";

const authService = new AuthService(redisConnection);

export { authService };
