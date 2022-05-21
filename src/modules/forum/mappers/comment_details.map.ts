import { Mapper } from '../../../shared/mappers/mapper';
import { CommentVote } from '../domain/entities/comment/comment_vote';
import { CommentDetails } from '../domain/value_objects/post/post_details';

export class CommentDetailsMap implements Mapper<CommentDetails> {
    // public static toDomain(raw: any): CommentDetails {
    //     const votes: CommentVote[] = raw.CommentVotes ?
    // }
}
