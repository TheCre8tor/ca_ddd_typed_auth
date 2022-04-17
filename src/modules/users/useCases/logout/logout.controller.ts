import { Response } from "express";

import { BaseController } from "../../../../shared/infrastructure/http/models/base_controller";
import { DecodedExpressRequest } from "../../infrastructure/http/models/decoded_request";
import { LogoutUseCase } from "./logout.usecase";

class LogoutController extends BaseController {
  private usecase: LogoutUseCase;

  constructor(usecase: LogoutUseCase) {
    super();
    this.usecase = usecase;
  }

  protected async executeImpl(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<any> {
    const { userId } = res.locals.decoded;

    try {
      const result = await this.usecase.execute({ userId });

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message);
      } else {
        return this.ok(res);
      }
    } catch (err: any) {
      return this.fail(res, err);
    }
  }
}

export { LogoutController };
