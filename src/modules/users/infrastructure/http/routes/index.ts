import { Request, Response, Router } from "express";
import { createUserController } from "../../../useCases/create_user/dependency.injection";
import { deleteUserController } from "../../../useCases/delete_user/dependency.injection";
import { getUserByUserNameController } from "../../../useCases/get_user_by_username/dependency.injection";

const userRouter = Router();

userRouter.post("/", (req: Request, res: Response) => {
  return createUserController.execute(req, res);
});

userRouter.delete("/:userId", (req: Request, res: Response) => {
  return deleteUserController.execute(req, res);
});

userRouter.get("/:username", (req: Request, res: Response) => {
  return getUserByUserNameController.execute(req, res);
});

export { userRouter };
