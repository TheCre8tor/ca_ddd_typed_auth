import { CreateUserUseCase } from "./create_user_usecase";
import { userRepository } from "../../repositories/dependency.injection";
import { CreateUserController } from "./create_user_controller";

const createUserUseCase = new CreateUserUseCase(userRepository);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserUseCase, createUserController };
