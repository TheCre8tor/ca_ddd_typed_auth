import { Guard } from '../../../../shared/core/guard';
import { Result } from '../../../../shared/core/result';
import { ValueObject } from '../../../../shared/domain/value_objects/value_object';

interface UserNameProps {
    name: string;
}

export class UserName extends ValueObject<UserNameProps> {
    private static maxLength: number = 15;
    private static minLength: number = 2;

    get value(): string {
        return this.props.name;
    }

    private constructor(props: UserNameProps) {
        super(props);
    }

    // Factory Method -->

    public static create(props: UserNameProps): Result<UserName> {
        const usernameResult = Guard.againstNullOrUndefined(props.name, 'username');
        if (!usernameResult.succeeded) {
            return Result.fail<UserName>(usernameResult.message as string);
        }

        const minLengthResult = Guard.againstAtLeast(this.minLength, props.name);
        if (!minLengthResult.succeeded) {
            return Result.fail<UserName>(minLengthResult.message as string);
        }

        const maxLengthResult = Guard.againstAtMost(this.maxLength, props.name);
        if (!maxLengthResult.succeeded) {
            return Result.fail<UserName>(maxLengthResult.message as string);
        }

        return Result.ok<UserName>(new UserName(props));
    }
}
