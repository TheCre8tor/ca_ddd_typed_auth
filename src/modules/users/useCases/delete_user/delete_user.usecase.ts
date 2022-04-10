import { Either, Left, Right } from "../../../../shared/core/either";
import { AppError } from "../../../../shared/core/errors/app_error";
import { Result } from "../../../../shared/core/result";
import { UseCase } from "../../../../shared/useCases/usecase";
import { IUserRepository } from "../../repositories/user_repository.interface";
import { DeleteUserDTO } from "./delete_user.dto";
import { DeleteUserErrors } from "./delete_user.errors";

type EitherResponse = Either<
  AppError.UnexpectedError | DeleteUserErrors.UserNotFoundError,
  Result<void>
>;

export class DeleteUserUseCase
  implements UseCase<DeleteUserDTO, EitherResponse>
{
  private repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  public async execute(request: DeleteUserDTO): Promise<EitherResponse> {
    try {
      const user = await this.repository.getUserByUserId(request.userId);

      const userFound = !!user === true;

      if (!userFound) {
        return new Left(new DeleteUserErrors.UserNotFoundError());
      }

      user?.delete();

      await this.repository.update(user!);

      return new Right(Result.ok<void>());
    } catch (err: any) {
      return new Left(new AppError.UnexpectedError(err));
    }
  }
}
