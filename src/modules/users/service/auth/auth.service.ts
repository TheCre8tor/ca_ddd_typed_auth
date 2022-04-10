import { RedisClientType } from "redis";
import { User } from "../../domain/aggregates/user";
import { JWTClaims, JWTToken } from "../../domain/jwt";
import { IAuthService } from "./auth.service.interface";
import { AbstractRedisClient } from "../redis/redis_client.abstract";

import jwt from "jsonwebtoken";
import { authConfig } from "../../../../config";

/**
 * @class JWTClient
 * @extends AbstractRedisClient
 * @desc This class is responsible for persisting jwts to redis
 * and for signing tokens. It should also be responsible for determining their
 * validity.
 */

export class AuthService extends AbstractRedisClient implements IAuthService {
  public jwtHashName: string = "activeJwtClients";
  constructor(redisClient: RedisClientType) {
    super(redisClient);
  }

  /**
   * @function signJWT
   * @desc Signs the JWT token using the server secret with some claims
   * about the current user.
   */

  signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      userId: props.userId,
      email: props.email,
      username: props.username,
      isEmailVerified: props.isEmailVerified,
      adminUser: props.adminUser,
    };

    return jwt.sign(claims, authConfig.secret!, {
      expiresIn: authConfig.tokenExpiryTime,
    });
  }

  decodeJWT(token: string): Promise<JWTClaims> {
    throw new Error("Method not implemented.");
  }
  createRefreshToken(): string {
    throw new Error("Method not implemented.");
  }
  getTokens(email: string): Promise<string[]> {
    throw new Error("Method not implemented.");
  }
  saveAuthenticatedUser(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deAuthenticateUser(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  refreshTokenExists(refreshToken: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getUserEmailFromRefreshToken(refreshToken: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
