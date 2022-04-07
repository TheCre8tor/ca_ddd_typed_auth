import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { BaseController } from "../../../../shared/infrastructure/http/models/base_controller";

export class CreateUserController extends BaseController {
  protected executeImpl(req: Request, res: Response): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
