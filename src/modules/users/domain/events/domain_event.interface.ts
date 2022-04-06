import { UniqueEntityID } from "../unique_entity_id";

export interface IDomainEvent {
  dateTimeOccured: Date;
  getAggregateId(): UniqueEntityID;
}
