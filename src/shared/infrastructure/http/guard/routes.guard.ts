import { Response } from "express";
import { IAuthService } from "../../../../modules/users/service/auth/auth.service.interface";

type RequestCode = 400 | 401 | 403;

class RouteGuard {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  private endRequest(res: Response, status: RequestCode, message: string): any {
    return res.status(status).send({ error: message });
  }
}

export { RouteGuard };
