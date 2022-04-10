import { User } from "../domain/aggregates/user";
import { UserEmail } from "../domain/valueObjects/user_email";
import { UserName } from "../domain/valueObjects/user_name";
import { IUserRepository } from "./user_repository.interface";
import UserModel from "../infrastructure/database/models/user.model";
import { UserMap } from "../mappers/user_map";
import log from "../../../shared/utils/logger";

export class UserRepositoryImpl implements IUserRepository {
  private model: typeof UserModel;

  constructor(model: typeof UserModel) {
    this.model = model;
  }

  public async exists(userEmail: UserEmail): Promise<boolean> {
    const findUser = await this.model.findOne({ email: userEmail.value });
    return !!findUser === true;
  }

  public async getUserByEmail(email: UserEmail): Promise<User | null> {
    const user = await this.model.findOne({ email: email.value });

    if (!!user === false) return null;

    return UserMap.toDomain(user);
  }

  public async getUserByUserId(userId: string): Promise<User | null> {
    const user = await this.model.findOne({ nano_id: userId });

    if (!!user === false) return null;

    return UserMap.toDomain(user);
  }

  public async getUserByUserName(
    userName: string | UserName
  ): Promise<User | null> {
    const parameter = userName instanceof UserName;

    const user = await this.model.findOne({
      username: parameter ? (<UserName>userName).value : userName,
    });

    if (!!user === false) return null;

    return UserMap.toDomain(user)!;
  }

  public async update(user: User): Promise<void> {
    const exits = await this.exists(user.email);

    if (exits) {
      const rawUserData = await UserMap.toPersistence(user);
      await this.model.updateOne({ nano_id: user.id.toValue() }, rawUserData);
    }

    return;
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
