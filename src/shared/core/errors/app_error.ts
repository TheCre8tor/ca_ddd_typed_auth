import { Result } from "../result";
import { UseCaseError } from "./usecase_error";

export namespace AppError {
  export class UnexpectedError extends Result<UseCaseError> {
    public constructor(err?: any) {
      super(false, {
        message: !!err ? err : `An unexpected error occured`,
      } as UseCaseError);
    }

    // Factory Method -->
    public static create(err: any): UnexpectedError {
      return new UnexpectedError(err);
    }
  }
}
