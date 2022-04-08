import { Request, Response, Router } from "express";
import { createUserController } from "../../../useCases/create_user/dependency.injection";

const userRouter = Router();

userRouter.post("/", (req: Request, res: Response) => {
  return createUserController.execute(req, res);
});

export { userRouter };
