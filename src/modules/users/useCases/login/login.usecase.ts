import { Either, Left, Right } from "../../../../shared/core/either";
import { AppError } from "../../../../shared/core/errors/app_error";
import { Result } from "../../../../shared/core/result";
import { UseCase } from "../../../../shared/useCases/usecase";
import { User } from "../../domain/aggregates/user";
import { JWTToken, RefreshToken } from "../../domain/jwt";
import { UserEmail } from "../../domain/valueObjects/user_email";
import { UserPassword } from "../../domain/valueObjects/user_password";
import { IUserRepository } from "../../repositories/user_repository.interface";
import { IAuthService } from "../../service/auth/auth.service.interface";
import { LoginDTO, LoginDTOResponse } from "./login.dto";
import { LoginUseCaseErrors } from "./login.errors";

type EitherResponse = Either<
  LoginUseCaseErrors.InvalidEmailOrPasswordError | AppError.UnexpectedError,
  Result<LoginDTOResponse>
>;

export class LoginUseCase implements UseCase<LoginDTO, EitherResponse> {
  private repository: IUserRepository;
  private authService: IAuthService;

  constructor(repository: IUserRepository, authService: IAuthService) {
    this.repository = repository;
    this.authService = authService;
  }

  public async execute(request: LoginDTO): Promise<EitherResponse> {
    let user: User | null;
    let email: UserEmail;
    let password: UserPassword;

    try {
      const emailOrError = UserEmail.create(request.email);
      const passwordOrError = UserPassword.create({ value: request.password });
      const payloadResult = Result.combine([emailOrError, passwordOrError]);

      if (payloadResult.isFailure) {
        return new Left(Result.fail<any>(payloadResult.error));
      }

      email = emailOrError.getValue();
      password = passwordOrError.getValue();

      user = await this.repository.getUserByEmail(email);

      const userNotFound = !!user === false;

      if (userNotFound) {
        return new Left(new LoginUseCaseErrors.InvalidEmailOrPasswordError());
      }

      const passwordValid = await user?.password.comparePassword(
        password.value
      );

      if (!passwordValid) {
        return new Left(new LoginUseCaseErrors.InvalidEmailOrPasswordError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        userId: user!.userId.id.toString(),
        username: user!.username.value,
        email: user!.email.value,
        isEmailVerified: user!.isEmailVerified,
        adminUser: user!.isAdminUser,
      });

      const refreshToken: RefreshToken = this.authService.createRefreshToken();

      user!.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user!);

      return new Right(
        Result.ok<LoginDTOResponse>({
          accessToken,
          refreshToken,
        })
      );
    } catch (err: any) {
      return new Left(new AppError.UnexpectedError(err));
    }
  }
}
