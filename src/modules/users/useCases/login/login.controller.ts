import { Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/base_controller";
import { DecodedExpressRequest } from "../../infrastructure/http/models/decoded_request";
import { LoginDTO, LoginDTOResponse } from "./login.dto";
import { LoginUseCaseErrors } from "./login.errors";
import { LoginUseCase } from "./login.usecase";

export class LoginController extends BaseController {
  private usecase: LoginUseCase;

  constructor(usecase: LoginUseCase) {
    super();
    this.usecase = usecase;
  }

  protected async executeImpl(
    req: DecodedExpressRequest,
    res: Response
  ): Promise<any> {
    const dto: LoginDTO = req.body;

    try {
      const result = await this.usecase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case LoginUseCaseErrors.InvalidEmailOrPasswordError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue().message);
        }
      } else {
        const dto: LoginDTOResponse = result.value.getValue();
        return this.ok<LoginDTOResponse>(res, dto);
      }
    } catch (err: any) {
      return this.fail(res, err);
    }
  }
}
