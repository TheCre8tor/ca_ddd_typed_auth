import { Request, Response } from "express";
import { BaseController } from "../../../../shared/infrastructure/http/models/base_controller";

export class CreateUserController extends BaseController {
  private useCase: CreateUserUseCase;

  constructor(useCase: CreateUserUseCase) {
    super();
    this.useCase = useCase;
  }

  protected executeImpl(req: Request, res: Response): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
