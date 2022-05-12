import { IDomainEvent } from '../../../../shared/domain/events/domain_event.interface';
import { UniqueEntityID } from '../../../../shared/domain/utils/unique_entity_id';
import { Post } from '../entities/post/post';

export class PostCreated implements IDomainEvent {
    public dateTimeOccured: Date;
    public post: Post;

    constructor(post: Post) {
        this.dateTimeOccured = new Date();
        this.post = post;
    }

    getAggregateId(): UniqueEntityID {
        return this.post.id;
    }
}
