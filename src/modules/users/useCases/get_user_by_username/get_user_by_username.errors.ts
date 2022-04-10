import { UseCaseError } from "../../../../shared/core/errors/usecase_error";
import { Result } from "../../../../shared/core/result";

export namespace GetUserByUserNameErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(username: string) {
      super(false, {
        message: `No user with the username ${username} was found`,
      });
    }
  }
}
