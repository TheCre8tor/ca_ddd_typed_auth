import { UniqueEntityID } from "../../../shared/domain/utils/unique_entity_id";
import { Mapper } from "../../../shared/mappers/mapper";
import log from "../../../shared/utils/logger";
import { User } from "../domain/aggregates/user";
import { UserEmail } from "../domain/valueObjects/user_email";
import { UserName } from "../domain/valueObjects/user_name";
import { UserPassword } from "../domain/valueObjects/user_password";
import { UserDTO, UserDTOLean } from "../dtos/user_dto";

export class UserMap implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      username: user.username.value,
      isEmailVerified: user.isEmailVerified,
      isAdminUser: user.isAdminUser,
      isDeleted: user.isDeleted,
    };
  }

  public static toLean(user: User): UserDTOLean {
    return {
      nano_id: user.userId?.id.toValue(),
      username: user.username.value,
      email: user.email.value,
    };
  }

  public static toDomain(raw: any): User | null {
    const usernameOrError = UserName.create({ name: raw.username });
    const userPasswordOrError = UserPassword.create({
      value: raw.password,
      hashed: true,
    });
    const userEmailOrError = UserEmail.create(raw.email);

    const userOrError = User.create(
      {
        username: usernameOrError.getValue(),
        password: userPasswordOrError.getValue(),
        email: userEmailOrError.getValue(),
        isEmailVerified: raw.verified,
        isAdminUser: raw.is_admin,
        isDeleted: raw.is_deleted,
      },
      new UniqueEntityID(raw.nano_id)
    );

    userOrError.isFailure ? log.info(userOrError.error) : "";

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static async toPersistence(user: User): Promise<any> {
    let password: string | null = null;

    if (!!user.password === true) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    return {
      nano_id: user.userId.id.toString(),
      email: user.email.value,
      verified: user.isEmailVerified,
      username: user.username.value,
      password: password,
      is_admin: user.isAdminUser,
      is_deleted: user.isDeleted,
    };
  }
}
