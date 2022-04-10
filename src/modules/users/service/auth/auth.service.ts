import { RedisClientType } from "redis";
import { User } from "../../domain/aggregates/user";
import { JWTClaims, JWTToken, RefreshToken } from "../../domain/jwt";
import { IAuthService } from "./auth.service.interface";
import { AbstractRedisClient } from "../redis/redis_client.abstract";
import randtoken from "rand-token";

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

    return jwt.sign(claims, authConfig.secret_token!, {
      expiresIn: authConfig.tokenExpiryTime,
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
      const result = jwt.verify(token, authConfig.secret_token!);
      return result as JWTClaims;
    } catch (err: any) {
      return err;
    }
  }

  private constructKey(email: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${email}`;
  }

  public createRefreshToken(): RefreshToken {
    return randtoken.uid(256);
  }

  /**
   * @method getTokens
   * @desc Gets the user's tokens that are currently active.
   * @return Promise<string[]>
   */

  public async getTokens(email: string): Promise<string[]> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${email}`
    );
    return keyValues.map((kv) => kv.value);
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
