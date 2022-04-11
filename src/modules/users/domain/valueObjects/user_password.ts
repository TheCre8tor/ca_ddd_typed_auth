import { ValueObject } from "../../../../shared/domain/valueObjects/value_object";
import argon2 from "argon2";
import { Guard } from "../../../../shared/core/guard";
import { Result } from "../../../../shared/core/result";

export interface IUserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<IUserPasswordProps> {
  private static minLength: number = 6;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IUserPasswordProps) {
    super(props);
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password);
    } catch (err: any) {
      return await Promise.reject(err);
    }
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed as boolean;
  }

  /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed password
   */

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;

    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.argon2Compare(plainTextPassword, hashed);
    }

    return this.props.value === plainTextPassword;
  }

  private async argon2Compare(
    plainText: string,
    hashed: string
  ): Promise<boolean> {
    try {
      return await argon2.verify(hashed, plainText);
    } catch (err: any) {
      return false;
    }
  }

  public getHashedValue(): Promise<string> {
    return new Promise((resolve) => {
      if (this.isAlreadyHashed()) {
        return resolve(this.props.value);
      }

      return resolve(this.hashPassword(this.props.value));
    });
  }

  public static create(props: IUserPasswordProps): Result<UserPassword> {
    const propsResult = Guard.againstNullOrUndefined(props.value, "password");

    if (!propsResult.succeeded) {
      return Result.fail<UserPassword>(propsResult.message as string);
    } else {
      if (!props.hashed) {
        if (!this.isAppropriateLength(props.value)) {
          return Result.fail<UserPassword>(
            "Password doesn't meet criteria [6 chars min]"
          );
        }
      }

      return Result.ok<UserPassword>(
        new UserPassword({
          value: props.value,
          hashed: !!props.hashed,
        })
      );
    }
  }
}
