import { CommentId } from '../../domain/entities/comment/comment_id';
import { CommentVote } from '../../domain/entities/comment/comment_vote';
import { MemberId } from '../../domain/entities/member/member_id';
import { PostId } from '../../domain/entities/post/post_id';
import { VoteType } from '../../domain/vote';
import { CommentVotes } from '../../domain/watch_list/comment_votes';

export interface ICommentVotesRepository {
    exists(commentId: CommentId, memberId: MemberId, voteType: VoteType): Promise<boolean>;
    getVotesForCommentByMemberId(commentId: CommentId, memberId: MemberId): Promise<CommentVote[]>;
    countUpvotesForCommentByCommentId(comment: CommentId): Promise<number>;
    countDownvotesForCommentByCommentId(comment: CommentId): Promise<number>;
    countAllPostCommentUpvotes(postId: PostId): Promise<number>;
    countAllPostCommentDownvotes(postId: PostId): Promise<number>;
    countAllPostCommentUpvotesExcludingOP(postId: PostId): Promise<number>;
    countAllPostCommentDownvotesExcludingOP(postId: PostId): Promise<number>;
    saveBulk(votes: CommentVotes): Promise<any>;
    save(vote: CommentVote): Promise<any>;
    delete(vote: CommentVote): Promise<any>;
}
