import { RedisClientType } from "redis";
import { User } from "../../domain/aggregates/user";
import { JWTClaims, JWTToken, RefreshToken } from "../../domain/jwt";
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

  public signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      userId: props.userId,
      email: props.email,
      username: props.username,
      isEmailVerified: props.isEmailVerified,
      adminUser: props.adminUser,
    };

    return jwt.sign(claims, authConfig.privateKey!, {
      expiresIn: authConfig.tokenExpiryTime,
      algorithm: "RS256",
    });
  }

  /**
   * @method decodeJWT
   * @desc Decodes the JWT using the server secret. If successful decode,
   * it returns the data from the token.
   * @param {token} string
   * @return Promise<any>
   */

  public async decodeJWT(token: string): Promise<JWTClaims> {
    try {
      const result = jwt.verify(token, authConfig.publicKey, {
        algorithms: ["RS256"],
      });
      return result as JWTClaims;
    } catch (err: any) {
      return err;
    }
  }

  private constructKey(username: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${username}`;
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
