import { UseCaseError } from "../../../../shared/core/errors/usecase_error";
import { Result } from "../../../../shared/core/result";

export namespace LoginUseCaseErrors {
  export class InvalidEmailOrPasswordError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Invalid email or password.`,
      });
    }
  }
}
