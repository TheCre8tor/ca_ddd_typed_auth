import { Either, Left, Right } from "../../../../shared/core/either";
import { AppError } from "../../../../shared/core/errors/app_error";
import { Result } from "../../../../shared/core/result";
import { UseCase } from "../../../../shared/useCases/usecase";
import { User } from "../../domain/aggregates/user";
import { UserName } from "../../domain/valueObjects/user_name";
import { IUserRepository } from "../../repositories/user_repository.interface";
import { GetUserByUserNameDTO } from "./get_user_by_username.dto";
import { GetUserByUserNameErrors } from "./get_user_by_username.errors";

type EitherResponse = Either<AppError.UnexpectedError, Result<User>>;

export class GetUserByUserNameUseCase
  implements UseCase<GetUserByUserNameDTO, EitherResponse>
{
  private repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  public async execute(request: GetUserByUserNameDTO): Promise<EitherResponse> {
    try {
      const usernameOrError = UserName.create({
        name: request.username,
      });

      if (usernameOrError.isFailure) {
        return new Left(
          new AppError.UnexpectedError(usernameOrError.error?.toString())
        );
      }

      const username: UserName = usernameOrError.getValue();

      const user = await this.repository.getUserByUserName(username);

      const userFound = !!user === true;

      if (!userFound) {
        return new Left(
          new GetUserByUserNameErrors.UserNotFoundError(username.value)
        );
      }

      return new Right(Result.ok<User>(user!));
    } catch (err: any) {
      return new Left(new AppError.UnexpectedError(err));
    }
  }
}
