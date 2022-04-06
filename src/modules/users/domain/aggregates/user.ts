import { Guard } from "../../../../shared/core/guard";
import { Result } from "../../../../shared/core/result";
import { UserId } from "../entities/user_id";
import { UserCreated } from "../events/user_created";
import { UserDeleted } from "../events/user_deleted";
import { UserLoggedIn } from "../events/user_logged_in";
import { JWTToken, RefreshToken } from "../jwt";
import { UserEmail } from "../valueObjects/user_email";
import { UserName } from "../valueObjects/user_name";
import { UserPassword } from "../valueObjects/user_password";

import { AggregateRoot } from "../../../../shared/domain/aggregates/aggregate_root";
import { UniqueEntityID } from "./../../../../shared/domain/utils/unique_entity_id";

interface UserProps {
  email: UserEmail;
  username: UserName;
  password: UserPassword;
  isEmailVerified?: boolean;
  isAdminUser?: boolean;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  isDeleted?: boolean;
  lastLogin?: Date;
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue();
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get username(): UserName {
    return this.props.username;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  // TODO: monitor the result of this function because of the bang operator
  get isEmailVerified(): boolean {
    return !!this.props.isEmailVerified;
  }

  // TODO: monitor the result of this function because of the bang operator
  get isAdminUser(): boolean {
    return !!this.props.isAdminUser;
  }

  get lastLogin(): Date {
    return this.props.lastLogin as Date;
  }

  get refreshToken(): RefreshToken {
    return this.props.refreshToken as RefreshToken;
  }

  constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.addDomainEvent(new UserLoggedIn(this));
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.addDomainEvent(new UserDeleted(this));
      this.props.isDeleted = true;
    }
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.username, argumentName: "username" },
      { argument: props.email, argumentName: "email" },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message as string);
    }

    const isNewUser = !!id === false;

    const user = new User({
      ...props,
      isDeleted: props.isDeleted ? props.isDeleted : false,
      isEmailVerified: props.isEmailVerified ? props.isEmailVerified : false,
      isAdminUser: props.isAdminUser ? props.isAdminUser : false,
    });

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
    }

    return Result.ok<User>(user);
  }
}
