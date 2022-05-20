import { Left, Right } from '../../../../shared/core/either';
import { Result } from '../../../../shared/core/result';
import { DownvoteCommentResponse } from '../../usecases/comments/downvote_comment/downvote_comment';
import { Comment } from '../entities/comment/comment';
import { CommentVote } from '../entities/comment/comment_vote';
import { Member } from '../entities/member/member';
import { Post } from '../entities/post/post';

export class PostService {
    public downvoteComment(
        post: Post,
        member: Member,
        comment: Comment,
        existingVotesCommentByMember: CommentVote[]
    ): DownvoteCommentResponse {
        // If it was already downvoted, do nothing.
        const existingDownvote: CommentVote | undefined = existingVotesCommentByMember.find(vote => vote.isDownvote());

        const downvoteAlreadyExists = !!existingDownvote;

        if (downvoteAlreadyExists) {
            return new Right(Result.ok<void>());
        }

        // if upvote exists, we need to remove it.
        const existingUpvote: CommentVote | undefined = existingVotesCommentByMember.find(vote => vote.isUpvote());

        const upvoteAlreadyExists = !!existingUpvote;

        if (upvoteAlreadyExists) {
            comment.removeVote(existingUpvote);
            post.updateComment(comment);

            return new Right(Result.ok<void>());
        }

        // Neither, let's create the downvote ourselves.
        const downvoteOrError = CommentVote.createDownvote(member.memberId, comment.commentId);

        if (downvoteOrError.isFailure) {
            return new Left(downvoteOrError);
        }

        const downvote: CommentVote = downvoteOrError.getValue();

        comment.addVote(downvote);
        post.updateComment(comment);

        return new Right(Result.ok<void>());
    }
}
