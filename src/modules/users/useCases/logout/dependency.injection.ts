import { userRepository } from "../../repositories/dependency.injection";
import { authService } from "../../service/dependency.injection";
import { LogoutController } from "./logout.controller";
import { LogoutUseCase } from "./logout.usecase";

const logoutUsecase = new LogoutUseCase(userRepository, authService);
const logoutController = new LogoutController(logoutUsecase);

export { logoutController };
