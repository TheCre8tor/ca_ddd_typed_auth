import { IDomainEvent } from '../../../../shared/domain/events/domain_event.interface';
import { UniqueEntityID } from '../../../../shared/domain/utils/unique_entity_id';
import { Comment } from '../entities/comment/comment';
import { Post } from '../entities/post/post';

export class CommentPosted implements IDomainEvent {
    public dateTimeOccured: Date;
    public post: Post;
    public comment: Comment;

    constructor(post: Post, comment: Comment) {
        this.dateTimeOccured = new Date();
        this.post = post;
        this.comment = comment;
    }

    getAggregateId(): UniqueEntityID {
        return this.post.id;
    }
}
