import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/base_controller";
import { DeleteUserDTO } from "./delete_user.dto";
import { DeleteUserErrors } from "./delete_user.errors";
import { DeleteUserUseCase } from "./delete_user.usecase";

export class DeleteUserController extends BaseController {
  private usecase: DeleteUserUseCase;

  constructor(usecase: DeleteUserUseCase) {
    super();
    this.usecase = usecase;
  }

  public async executeImpl(
    req: Request<DeleteUserDTO>,
    res: Response
  ): Promise<any> {
    const dto: DeleteUserDTO = req.params;

    try {
      const result = await this.usecase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteUserErrors.UserNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue().message);
        }
      } else {
        return this.ok(res);
      }
    } catch (err: any) {
      return this.fail(res, err);
    }
  }
}
