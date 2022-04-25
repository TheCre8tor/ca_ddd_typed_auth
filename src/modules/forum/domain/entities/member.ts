import { Guard } from '../../../../shared/core/guard';
import { Result } from '../../../../shared/core/result';
import { AggregateRoot } from '../../../../shared/domain/aggregates/aggregate_root';
import { UniqueEntityID } from '../../../../shared/domain/utils/unique_entity_id';
import { UserId } from '../../../users/domain/entities/user_id';
import { UserName } from '../../../users/domain/valueObjects/user_name';
import { MemberId } from '../value_objects/member/member_id';

interface MemberProps {
    userId: UserId;
    username: UserName;
    reputation?: number;
}

export class Member extends AggregateRoot<MemberProps> {
    get memberId(): MemberId {
        return MemberId.create(this._id).getValue();
    }

    get userId(): UserId {
        return this.props.userId;
    }

    get username(): UserName {
        return this.props.username;
    }

    get reputation(): number | undefined {
        return this.props.reputation;
    }

    public static create(props: MemberProps, id?: UniqueEntityID): Result<Member> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.userId, argumentName: 'userId' },
            { argument: props.username, argumentName: 'username' }
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<Member>(guardResult.message!);
        }

        const defaultValues: MemberProps = {
            ...props,
            reputation: props.reputation ? props.reputation : 0
        };

        const member = new Member(defaultValues, id);

        const isNewMember = !!id === false;

        if (isNewMember) {
            // member.addDomainEvent()
        }
    }
}
