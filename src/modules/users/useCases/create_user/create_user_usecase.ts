import { AppError } from "../../../../shared/core/errors/app_error";
import { Either, Left, left, Right } from "../../../../shared/core/either";
import { Result } from "../../../../shared/core/result";
import { CreateUserErrors } from "./create_user_errors";
import { CreateUserDTO } from "./create_user_dto";
import { UseCase } from "../../../../shared/useCases/usecase";
import { IUserRepository } from "../../repositories/user_repository.interface";
import { UserEmail } from "../../domain/valueObjects/user_email";
import { UserPassword } from "../../domain/valueObjects/user_password";
import { UserName } from "../../domain/valueObjects/user_name";
import log from "../../../../shared/utils/logger";
import { User } from "../../domain/aggregates/user";

type EitherResponse = Either<
  | CreateUserErrors.EmailAlreadyExistsError
  | CreateUserErrors.UsernameTakenError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

export class CreateUserUseCase
  implements UseCase<CreateUserDTO, Promise<EitherResponse>>
{
  private repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  async execute(request: CreateUserDTO): Promise<EitherResponse> {
    const emailOrError = UserEmail.create(request.email);
    const passwordOrError = UserPassword.create({ value: request.password });
    const usernameOrError = UserName.create({ name: request.username });

    const dtoResult = Result.combine([
      emailOrError,
      passwordOrError,
      usernameOrError,
    ]);

    if (dtoResult.isFailure) {
      return new Left(Result.fail<void>(dtoResult.error));
    }

    const email: UserEmail = emailOrError.getValue();
    const password: UserPassword = passwordOrError.getValue();
    const username: UserName = usernameOrError.getValue();

    try {
      const userAlreadyExists = await this.repository.exists(email);

      if (userAlreadyExists) {
        return new Left(
          new CreateUserErrors.EmailAlreadyExistsError(email.value)
        );
      }

      try {
        const usernameAlreadyTaken = await this.repository.getUserByUserName(
          username.value
        );

        const userNameTaken = !!usernameAlreadyTaken === true;

        if (userNameTaken) {
          return new Left(
            new CreateUserErrors.UsernameTakenError(username.value)
          );
        }
      } catch (err: any) {}

      const userOrError: Result<User> = User.create({
        email,
        password,
        username,
      });

      if (userOrError.isFailure) {
        return new Left(Result.fail<User>(userOrError.error as string));
      }

      const user: User = userOrError.getValue();

      await this.repository.save(user);

      return new Right(Result.ok<void>());
    } catch (err: any) {
      return new Left(new AppError.UnexpectedError(err));
    }
  }
}
