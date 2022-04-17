import { Request, Response, Router } from "express";
import { createUserController } from "../../../useCases/create_user/dependency.injection";
import { deleteUserController } from "../../../useCases/delete_user/dependency.injection";
import { getCurrentUserController } from "../../../useCases/get_current_user/dependency.injection";
import { getUserByUserNameController } from "../../../useCases/get_user_by_username/dependency.injection";
import { loginController } from "../../../useCases/login/dependency.injection";
import { logoutController } from "../../../useCases/logout/dependency.injection";

const userRouter = Router();

userRouter.post("/", (req: Request, res: Response) => {
  return createUserController.execute(req, res);
});

userRouter.get("/me", (req: Request, res: Response) => {
  return getCurrentUserController.execute(req, res);
});

userRouter.post("/login", (req: Request, res: Response) => {
  return loginController.execute(req, res);
});

userRouter.post("/logout", (req: Request, res: Response) => {
  return logoutController.execute(req, res);
});

userRouter.delete("/:userId", (req: Request, res: Response) => {
  return deleteUserController.execute(req, res);
});

userRouter.get("/:username", (req: Request, res: Response) => {
  return getUserByUserNameController.execute(req, res);
});

export { userRouter };
