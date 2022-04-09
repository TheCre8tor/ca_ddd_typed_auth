import { UseCaseError } from "../../../../shared/core/errors/usecase_error";
import { Result } from "../../../../shared/core/result";

export namespace DeleteUserErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User not found`,
      });
    }
  }
}
