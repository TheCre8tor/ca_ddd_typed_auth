import { Request, Response, Router } from "express";
import { createUserController } from "../../../useCases/create_user/dependency.injection";
import { deleteUserController } from "../../../useCases/delete_user/dependency.injection";

const userRouter = Router();

userRouter.post("/", (req: Request, res: Response) => {
  return createUserController.execute(req, res);
});

userRouter.delete("/:userId", (req: Request, res: Response) => {
  return deleteUserController.execute(req, res);
});

export { userRouter };
