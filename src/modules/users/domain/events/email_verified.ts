import { User } from "../aggregates/user";
import { UniqueEntityID } from "../unique_entity_id";
import { IDomainEvent } from "./domain_event.interface";

export class EmailVerified implements IDomainEvent {
  public dateTimeOccured: Date;
  public user: User;

  constructor(user: User) {
    this.dateTimeOccured = new Date();
    this.user = user;
  }

  public getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
