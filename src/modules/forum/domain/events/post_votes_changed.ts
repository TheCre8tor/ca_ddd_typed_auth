import { IDomainEvent } from '../../../../shared/domain/events/domain_event.interface';
import { UniqueEntityID } from '../../../../shared/domain/utils/unique_entity_id';
import { Post } from '../entities/post/post';
import { PostVote } from '../value_objects/post/post_vote';

export class PostVotesChanged implements IDomainEvent {
    public dateTimeOccured: Date;
    public post: Post;
    public vote: PostVote;

    constructor(post: Post, vote: PostVote) {
        this.dateTimeOccured = new Date();
        this.post = post;
        this.vote = vote;
    }

    getAggregateId(): UniqueEntityID {
        return this.post.id;
    }
}
