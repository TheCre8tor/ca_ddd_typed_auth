import { RedisClientType } from "redis";
import { User } from "../../domain/aggregates/user";
import { JWTClaims, JWTToken, RefreshToken } from "../../domain/jwt";
import { IAuthService } from "./auth.service.interface";
import { AbstractRedisClient } from "../redis/redis_client.abstract";
import randtoken from "rand-token";

import jwt from "jsonwebtoken";
import { authConfig } from "../../../../config";
import c from "config";

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

  public addToken(
    email: string,
    refreshToken: RefreshToken,
    token: JWTToken
  ): Promise<any> {
    return this.set(this.constructKey(email, refreshToken), token);
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(
        user.email.value,
        user.refreshToken,
        user.accessToken
      );
    }
  }

  /**
   * @method clearAllSessions
   * @desc Clears all active sessions for the current user.
   * @param {username} string
   * @return Promise<any>
   */

  public async clearAllSessions(email: string): Promise<any> {
    const keyValues = await this.getAllKeyValue(
      `*${this.jwtHashName}.${email}`
    );
    const keys = keyValues.map(async (kv) => kv.key);

    return Promise.all(keys.map(async (key) => this.deleteOne(await key)));
  }

  public async deAuthenticateUser(email: string): Promise<void> {
    return await this.clearAllSessions(email);
  }

  public async refreshTokenExists(refreshToken: string): Promise<boolean> {
    const keys = await this.getAllKeys(`*${refreshToken}`);
    return keys.length !== 0;
  }

  public async getUserEmailFromRefreshToken(
    refreshToken: string
  ): Promise<string> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) throw new Error("Email not found for refresh token.");

    const key = keys[0];

    const indexOfKey = key.indexOf(this.jwtHashName);
    return key.substring(indexOfKey + this.jwtHashName.length + 1);
  }

  // Additional APIs -->
  /**
   * @method clearAllTokens
   * @desc Clears all jwt tokens from redis. Usually useful for testing.
   * @return Promise<any>
   */

  public async clearAllTokens(): Promise<any> {
    const allKeys = await this.getAllKeys(`*${this.jwtHashName}*`);
    return Promise.all(allKeys.map((key) => this.deleteOne(key)));
  }

  /**
   * @method countSessions
   * @desc Counts the total number of sessions for a particular user.
   * @param {email} string
   * @return Promise<number>
   */

  public countSessions(email: string): Promise<number> {
    return this.count(`*${this.jwtHashName}.${email}`);
  }

  /**
   * @method countTokens
   * @desc Counts the total number of sessions for a particular user.
   * @return Promise<number>
   */

  public countTokens(): Promise<number> {
    return this.count(`*${this.jwtHashName}`);
  }

  /**
   * @method getToken
   * @desc Gets a single token for the user.
   * @param {email} string
   * @param {refreshToken} string
   * @return Promise<string>
   */

  public async getToken(
    email: string,
    refreshToken: RefreshToken
  ): Promise<string> {
    return this.getOne(this.constructKey(email, refreshToken));
  }

  /**
   * @method clearToken
   * @desc Deletes a single user's session token.
   * @param {email} string
   * @param {refreshToken} string
   * @return Promise<string>
   */

  public async clearToken(
    email: string,
    refreshToken: RefreshToken
  ): Promise<any> {
    return this.deleteOne(this.constructKey(email, refreshToken));
  }

  /**
   * @method sessionExists
   * @desc Checks if the session for this user exists
   * @param {email} string
   * @param {refreshToken} string
   * @return Promise<boolean>
   */

  public async sessionExists(
    email: string,
    refreshToken: RefreshToken
  ): Promise<boolean> {
    const token = await this.getToken(email, refreshToken);

    return !!token ? true : false;
  }
}
