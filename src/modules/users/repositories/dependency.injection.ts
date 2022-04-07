import UserModel from "../infrastructure/database/models/user.model";
import { UserRepositoryImpl } from "./user_repository.impl";

const userRepository = new UserRepositoryImpl(UserModel);

export { userRepository };
