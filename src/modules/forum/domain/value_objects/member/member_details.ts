import { Guard } from '../../../../../shared/core/guard';
import { Result } from '../../../../../shared/core/result';
import { ValueObject } from '../../../../../shared/domain/value_objects/value_object';
import { UserName } from '../../../../users/domain/valueObjects/user_name';

interface MemberDetailsProps {
    username: UserName;
    reputation: number;
    isAdminUser?: boolean;
    isDeleted?: boolean;
}

/**
 * @desc Read model for member
 */

export class MemberDetails extends ValueObject<MemberDetailsProps> {
    get username(): UserName {
        return this.props.username;
    }

    get reputation(): number {
        return this.props.reputation;
    }

    get isAdminUser(): boolean | undefined {
        return this.props.isAdminUser;
    }

    get isDeleted(): boolean | undefined {
        return this.props.isDeleted;
    }

    private constructor(props: MemberDetailsProps) {
        super(props);
    }

    public static create(props: MemberDetailsProps): Result<MemberDetails> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.username, argumentName: 'username' },
            { argument: props.reputation, argumentName: 'reputation' }
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<MemberDetails>(guardResult.message!);
        }

        const memberDetails: MemberDetailsProps = {
            ...props,
            isAdminUser: props.isAdminUser ? props.isAdminUser : false,
            isDeleted: props.isDeleted ? props.isDeleted : false
        };

        return Result.ok<MemberDetails>(new MemberDetails(memberDetails));
    }
}
