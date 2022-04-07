import { User } from "../domain/aggregates/user";
import { UserEmail } from "../domain/valueObjects/user_email";
import { UserName } from "../domain/valueObjects/user_name";
import { IUserRepository } from "./user_repository.interface";
import UserModel from "../infrastructure/database/models/user.model";

export class UserRepositoryImpl implements IUserRepository {
  // todo: UserRepositoryImpl is not yet completed -->
  private model: typeof UserModel;

  constructor(model: typeof UserModel) {
    this.model = model;
  }

  public async exists(userEmail: UserEmail): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public getUserByUserId(userId: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public getUserByUserName(userName: string | UserName): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public save(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
