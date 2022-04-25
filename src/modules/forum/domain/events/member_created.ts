import { IDomainEvent } from '../../../../shared/domain/events/domain_event.interface';
import { UniqueEntityID } from '../../../../shared/domain/utils/unique_entity_id';
import { Member } from '../entities/member';

export class MemberCreated implements IDomainEvent {
    public dateTimeOccured: Date;
    public member: Member;

    constructor(member: Member) {
        this.dateTimeOccured = new Date();
        this.member = member;
    }

    public getAggregateId(): UniqueEntityID {
        return this.member.id;
    }
}
