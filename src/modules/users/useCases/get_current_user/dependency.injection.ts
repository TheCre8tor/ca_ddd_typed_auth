import { GetCurrentUserController } from "./get_current_user.controller";
import { getUserByUserNameUseCase } from "../get_user_by_username/dependency.injection";

const getCurrentUserController = new GetCurrentUserController(
  getUserByUserNameUseCase
);

export { getCurrentUserController };
