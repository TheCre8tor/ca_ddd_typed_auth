import { DeleteUserController } from "./delete_user.controller";
import { DeleteUserUseCase } from "./delete_user.usecase";
import { userRepository } from "../../repositories/dependency.injection";

const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

export { deleteUserUseCase, deleteUserController };
