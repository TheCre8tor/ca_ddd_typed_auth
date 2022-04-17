import { UseCaseError } from "../../../../shared/core/errors/usecase_error";
import { Result } from "../../../../shared/core/result";

export namespace LogoutErrors {
  export class UserNotFoundOrDeletedError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User not found or doesn't exist anymore.`,
      } as UseCaseError);
    }
  }
}
