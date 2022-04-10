import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/base_controller";
import { UserMap } from "../../mappers/user_map";
import { GetUserByUserNameDTO } from "./get_user_by_username.dto";
import { GetUserByUserNameErrors } from "./get_user_by_username.errors";
import { GetUserByUserNameUseCase } from "./get_user_by_username.usecase";

export class GetUserByUserNameController extends BaseController {
  private usecase: GetUserByUserNameUseCase;

  constructor(usecase: GetUserByUserNameUseCase) {
    super();
    this.usecase = usecase;
  }

  public async executeImpl(
    req: Request<GetUserByUserNameDTO>,
    res: Response
  ): Promise<any> {
    const dto: GetUserByUserNameDTO = req.params;

    try {
      const result = await this.usecase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case GetUserByUserNameErrors.UserNotFoundError:
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
