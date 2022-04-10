import { userRepository } from "../../repositories/dependency.injection";
import { GetUserByUserNameController } from "./get_user_by_username.controller";
import { GetUserByUserNameUseCase } from "./get_user_by_username.usecase";

const getUserByUserNameUseCase = new GetUserByUserNameUseCase(userRepository);
const getUserByUserNameController = new GetUserByUserNameController(
  getUserByUserNameUseCase
);

export { getUserByUserNameController };
