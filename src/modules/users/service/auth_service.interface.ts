import { User } from "../domain/aggregates/user";
import { JWTClaims, JWTToken, RefreshToken } from "../domain/jwt";

export interface IAuthService {
  signJWT(props: JWTClaims): JWTToken;
  decodeJWT(token: string): Promise<JWTClaims>;
  createRefreshToken(): RefreshToken;
  getTokens(email: string): Promise<string[]>;
  saveAuthenticatedUser(user: User): Promise<void>;
  deAuthenticateUser(email: string): Promise<void>;
  refreshTokenExists(refreshToken: RefreshToken): Promise<boolean>;
  getUserEmailFromRefreshToken(refreshToken: RefreshToken): Promise<string>;
}
