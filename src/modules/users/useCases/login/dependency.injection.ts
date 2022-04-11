import { userRepository } from "../../repositories/dependency.injection";
import { authService } from "../../service/dependency.injection";
import { LoginController } from "./login.controller";
import { LoginUseCase } from "./login.usecase";

const loginUsecase = new LoginUseCase(userRepository, authService);
const loginController = new LoginController(loginUsecase);

export { loginController };
