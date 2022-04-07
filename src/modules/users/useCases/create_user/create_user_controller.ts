import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/base_controller";
import { TextSanitizer } from "../../../../shared/utils/text_sanitizer";
import { CreateUserDTO } from "./create_user_dto";
import { CreateUserErrors } from "./create_user_errors";
import { CreateUserUseCase } from "./create_user_usecase";

export class CreateUserController extends BaseController {
  private usecase: CreateUserUseCase;

  constructor(usecase: CreateUserUseCase) {
    super();
    this.usecase = usecase;
  }

  protected async executeImpl(req: Request, res: Response): Promise<any> {
    let dto: CreateUserDTO = req.body as CreateUserDTO;

    dto = {
      username: TextSanitizer.sanitize(dto.username),
      email: TextSanitizer.sanitize(dto.email),
      password: dto.password,
    };

    try {
      const result = await this.usecase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.UsernameTakenError:
            return this.conflict(res, error.errorValue());
          case CreateUserErrors.EmailAlreadyExistsError:
            return this.conflict(res, error.errorValue());
          default:
            return this.fail(res, error.errorValue());
        }
      } else {
        return this.ok(res);
      }
    } catch (err: any) {
      return this.fail(res, err);
    }
  }
}
