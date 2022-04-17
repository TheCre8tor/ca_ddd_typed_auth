import { User } from "../domain/aggregates/user";
import { UserEmail } from "../domain/valueObjects/user_email";
import { UserName } from "../domain/valueObjects/user_name";

export interface IUserRepository {
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByEmail(email: UserEmail | string): Promise<User | null>;
  getUserByUserId(userId: string): Promise<User | null>;
  getUserByUserName(userName: UserName | string): Promise<User | null>;
  update(user: User): Promise<void>;
  save(user: User): Promise<void>;
}
