import { Either, Left, Right } from "../../../../shared/core/either";
import { AppError } from "../../../../shared/core/errors/app_error";
import { Result } from "../../../../shared/core/result";
import { UseCase } from "../../../../shared/useCases/usecase";
import { User } from "../../domain/aggregates/user";
import { IUserRepository } from "../../repositories/user_repository.interface";
import { IAuthService } from "../../service/auth/auth.service.interface";
import { LogoutDTO } from "./logout.dto";
import { LogoutErrors } from "./logout.errors";

type EitherResponse = Either<AppError.UnexpectedError, Result<void>>;

class LogoutUseCase implements UseCase<LogoutDTO, EitherResponse> {
  private repository: IUserRepository;
  private authService: IAuthService;

  constructor(repository: IUserRepository, authService: IAuthService) {
    this.repository = repository;
    this.authService = authService;
  }

  public async execute(request: LogoutDTO): Promise<EitherResponse> {
    let user: User | null;

    const { userId } = request;

    try {
      try {
        // todo: make an experiment on the logic
        user = await this.repository.getUserByUserId(userId);
      } catch (err) {
        return new Left(new LogoutErrors.UserNotFoundOrDeletedError());
      }

      await this.authService.deAuthenticateUser(user?.email.value!);

      return new Right(Result.ok<void>());
    } catch (err: any) {
      return new Left(new AppError.UnexpectedError(err));
    }
  }
}

export { LogoutUseCase };
