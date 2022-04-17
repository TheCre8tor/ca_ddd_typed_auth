import { Either } from "../../../../shared/core/either";
import { AppError } from "../../../../shared/core/errors/app_error";
import { Result } from "../../../../shared/core/result";
import { UseCase } from "../../../../shared/useCases/usecase";
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
    request?: RefreshAccessTokenDTO
  ): Promise<EitherResponse> {
    throw new Error("Method not implemented.");
  }
}
