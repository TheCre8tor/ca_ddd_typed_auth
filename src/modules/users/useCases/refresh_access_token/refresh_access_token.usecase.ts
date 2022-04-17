import { Either, Left, Right } from "../../../../shared/core/either";
import { AppError } from "../../../../shared/core/errors/app_error";
import { Result } from "../../../../shared/core/result";
import { UseCase } from "../../../../shared/useCases/usecase";
import { User } from "../../domain/aggregates/user";
import { JWTToken } from "../../domain/jwt";
import { IUserRepository } from "../../repositories/user_repository.interface";
import { IAuthService } from "../../service/auth/auth.service.interface";
import { RefreshAccessTokenDTO } from "./refresh_access_token.dto";
import { RefreshAccessTokenErrors } from "./refresh_access_token.errors";

type EitherResponse = Either<
  RefreshAccessTokenErrors.RefreshTokenNotFound | AppError.UnexpectedError,
  Result<JWTToken>
>;

export class RefreshAccessTokenUseCase
  implements UseCase<RefreshAccessTokenDTO, EitherResponse>
{
  private repository: IUserRepository;
  private authService: IAuthService;

  constructor(repository: IUserRepository, authService: IAuthService) {
    this.repository = repository;
    this.authService = authService;
  }

  public async execute(
    request: RefreshAccessTokenDTO
  ): Promise<EitherResponse> {
    const { refreshToken } = request;

    let user: User | null;
    let email: string;

    try {
      try {
        email = await this.authService.getUserEmailFromRefreshToken(
          refreshToken
        );
      } catch (err) {
        return new Left(new RefreshAccessTokenErrors.RefreshTokenNotFound());
      }

      try {
        user = await this.repository.getUserByEmail(email);
      } catch (err) {
        return new Left(new RefreshAccessTokenErrors.RefreshTokenNotFound());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        userId: user?.userId.id.toString()!,
        isEmailVerified: user?.isEmailVerified!,
        email: user?.email.value!,
        username: user?.username.value!,
        adminUser: user?.isAdminUser!,
      });

      user?.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user!);

      return new Right(Result.ok<JWTToken>(accessToken));
    } catch (err: any) {
      return new Left(new AppError.UnexpectedError(err));
    }
  }
}
