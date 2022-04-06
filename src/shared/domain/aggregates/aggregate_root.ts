import { Entity } from "../../../modules/users/domain/entities/entity";
import { DomainEvent } from "../events/domain_events";
import { IDomainEvent } from "../events/domain_event.interface";
import { UniqueEntityID } from "../utils/unique_entity_id";

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: IDomainEvent[] = [];

  get id(): UniqueEntityID {
    return this._id;
  }

  get domainEvents(): IDomainEvent[] {
    return this._domainEvents;
  }

  private logDomainEventAdded(domainEvent: IDomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);

    console.info(
      `[Domain Event Created]:`,
      thisClass?.constructor.name,
      "==>",
      domainEventClass?.constructor.name
    );
  }

  protected addDomainEvent(domainEvent: IDomainEvent): void {
    // Add the domain event to this aggregate's list of domain events
    this._domainEvents.push(domainEvent);

    // Add this aggregate instance to the domain event's list of aggregates whose
    // events is eventually needs to dispatch
    DomainEvent.markAggregateForDispatch(this);

    // log the domain event
    this.logDomainEventAdded(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }
}
