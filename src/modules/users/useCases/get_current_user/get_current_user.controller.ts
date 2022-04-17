import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { BaseController } from "../../../../shared/infrastructure/http/models/base_controller";
import { DecodedExpressRequest } from "../../infrastructure/http/models/decoded_request";
import { UserMap } from "../../mappers/user_map";
import { GetUserByUserNameUseCase } from "../get_user_by_username/get_user_by_username.usecase";

export class GetCurrentUserController extends BaseController {
  private usecase: GetUserByUserNameUseCase;

  constructor(usecase: GetUserByUserNameUseCase) {
    super();
    this.usecase = usecase;
  }

  public async executeImpl(req: DecodedExpressRequest, res: Response) {
    const { username } = res.locals.decoded;

    try {
      const result = await this.usecase.execute({ username });

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message);
      } else {
        const user = result.value.getValue();

        return this.ok(res, {
          user: UserMap.toDTO(user),
        });
      }
    } catch (err: any) {
      return this.fail(res, err);
    }
  }
}
