import { UniqueEntityID } from "../utils/unique_entity_id";

export interface IDomainEvent {
  dateTimeOccured: Date;
  getAggregateId(): UniqueEntityID;
}
