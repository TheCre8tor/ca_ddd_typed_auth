import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { BaseController } from "../../../../shared/infrastructure/http/models/base_controller";
import { JWTToken } from "../../domain/jwt";
import { LoginDTOResponse } from "../login/login.dto";
import { RefreshAccessTokenDTO } from "./refresh_access_token.dto";
import { RefreshAccessTokenErrors } from "./refresh_access_token.errors";
import { RefreshAccessTokenUseCase } from "./refresh_access_token.usecase";

class RefreshAccessTokenController extends BaseController {
  private usecase: RefreshAccessTokenUseCase;

  constructor(usecase: RefreshAccessTokenUseCase) {
    super();
    this.usecase = usecase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    const dto: RefreshAccessTokenDTO = req.body;

    try {
      const result = await this.usecase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case RefreshAccessTokenErrors.RefreshTokenNotFound:
            return this.notFound(res, error.errorValue().message);
          case RefreshAccessTokenErrors.UserNotFoundOrDeletedError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue().message);
        }
      } else {
        const accessToken: JWTToken = result.value.getValue();

        return this.ok<LoginDTOResponse>(res, {
          accessToken: accessToken,
          refreshToken: dto.refreshToken,
        });
      }
    } catch (err: any) {
      return this.fail(res, err);
    }
  }
}

export { RefreshAccessTokenController };
