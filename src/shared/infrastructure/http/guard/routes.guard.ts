import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

import { IAuthService } from "../../../../modules/users/service/auth/auth.service.interface";
import log from "../../../utils/logger";
import { isProduction } from "./../../../../config";

type RequestCode = 400 | 401 | 403;

class RouteGuard {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
  }

  private endRequest(res: Response, status: RequestCode, message: string): any {
    return res.status(status).send({ error: message });
  }

  public includeDecodedTokenIfExists() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (token) {
        const decoded = await this.authService.decodeJWT(token);
        const signatureExist = !!decoded === true;

        if (!signatureExist) {
          return this.endRequest(res, 403, "Token signature expired.");
        }

        const { email } = decoded;

        const tokens = await this.authService.getTokens(email);

        // todo: write about this!
        if (tokens.length !== 0) {
          res.locals.decoded = decoded;
          return next();
        } else {
          return next();
        }
      } else {
        return next();
      }
    };
  }

  public ensureAuthenticated() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (token) {
        const decoded = await this.authService.decodeJWT(token);

        const signatureExist = !!decoded === true;

        if (!signatureExist) {
          return this.endRequest(res, 403, "Token signature expired.");
        }

        const { email } = decoded;

        const tokens = await this.authService.getTokens(email);

        if (tokens.length !== 0) {
          res.locals.decoded = decoded;
          return next();
        } else {
          return this.endRequest(
            res,
            403,
            "Auth token not found. User is probably not logged in. Please login again."
          );
        }
      } else {
        return this.endRequest(res, 403, "No access token provided");
      }
    };
  }

  public static createRateLimit(mins: number, maxRequests: number) {
    return rateLimit({
      windowMs: mins * 60 * 1000,
      max: maxRequests,
    });
  }

  public static restrictedUrl(req: Request, res: Response, next: NextFunction) {
    if (!isProduction) {
      return next();
    }

    const approvedDomainList = ["http://localhost:3000"];

    const domain = req.headers.origin;

    const isValidDomain = !!approvedDomainList.find((item) => item === domain);
    log.info(`Domain =${domain}, valid?=${isValidDomain}`);

    if (!isValidDomain) {
      return res.status(403).json({ message: "Unauthorized" });
    } else {
      return next();
    }
  }
}

export { RouteGuard };
