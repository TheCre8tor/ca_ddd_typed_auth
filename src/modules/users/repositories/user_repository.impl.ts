import { User } from "../domain/aggregates/user";
import { UserEmail } from "../domain/valueObjects/user_email";
import { UserName } from "../domain/valueObjects/user_name";
import { IUserRepository } from "./user_repository.interface";
import UserModel from "../infrastructure/database/models/user.model";
import { UserMap } from "../mappers/user_map";
import log from "../../../shared/utils/logger";

export class UserRepositoryImpl implements IUserRepository {
  // todo: UserRepositoryImpl is not yet completed -->
  private model: typeof UserModel;

  constructor(model: typeof UserModel) {
    this.model = model;
  }

  public async exists(userEmail: UserEmail): Promise<boolean> {
    const findUser = await this.model.findOne({ email: userEmail.value });
    return !!findUser === true;
  }

  public getUserByUserId(userId: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  public async getUserByUserName(
    userName: string | UserName
  ): Promise<User | null> {
    const parameter = userName instanceof UserName;

    const findUserName = await this.model.findOne({
      username: parameter ? (<UserName>userName).value : userName,
    });

    if (!!findUserName === true) return null;

    return UserMap.toDomain(findUserName?.toJSON())!;
  }

  public async save(user: User): Promise<void> {
    const exists = await this.exists(user.email);

    if (!exists) {
      const rawUserData = await UserMap.toPersistence(user);
      await this.model.create(rawUserData);
    }

    return;
  }
}
