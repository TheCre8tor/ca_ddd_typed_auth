import { Left, Right } from '../../../../shared/core/either';
import { Result } from '../../../../shared/core/result';
import { DownvoteCommentResponse } from '../../usecases/comments/downvote_comment/downvote_comment';
import { UpvoteCommentResponse } from '../../usecases/comments/upvote_comment/upvote_comment.response';
import { Comment } from '../entities/comment/comment';
import { CommentVote } from '../entities/comment/comment_vote';
import { Member } from '../entities/member/member';
import { Post } from '../entities/post/post';
import { PostVote } from '../value_objects/post/post_vote';

export class PostService {
    public downvoteComment(
        post: Post,
        member: Member,
        comment: Comment,
        existingVotesOnCommentByMember: CommentVote[]
    ): DownvoteCommentResponse {
        // If it was already downvoted, do nothing.
        const existingDownvote: CommentVote | undefined = existingVotesOnCommentByMember.find(vote =>
            vote.isDownvote()
        );

        const downvoteAlreadyExists = !!existingDownvote;

        if (downvoteAlreadyExists) {
            return new Right(Result.ok<void>());
        }

        // if upvote exists, we need to remove it.
        const existingUpvote: CommentVote | undefined = existingVotesOnCommentByMember.find(vote => vote.isUpvote());

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

    public upvoteComment(
        post: Post,
        member: Member,
        comment: Comment,
        existingVotesOnCommentByMember: CommentVote[]
    ): UpvoteCommentResponse {
        // If upvote already exists
        const existingUpvote: CommentVote | undefined = existingVotesOnCommentByMember.find(vote => vote.isUpvote());

        const upvoteAlreadyExists = !!existingUpvote;

        if (upvoteAlreadyExists) {
            return new Right(Result.ok<void>());
        }

        // If downvote exists, we need to promote and remove it.
        const existingDownvote: CommentVote | undefined = existingVotesOnCommentByMember.find(vote =>
            vote.isDownvote()
        );

        const downvoteAlreadyExists = !!existingDownvote;

        if (downvoteAlreadyExists) {
            comment.removeVote(existingDownvote);
            post.updateComment(comment);

            return new Right(Result.ok<void>());
        }

        // Otherwise, give the comment an upvote.
        const upvoteOrError = CommentVote.createUpvote(member.memberId, comment.commentId);

        if (upvoteOrError.isFailure) {
            return new Left(upvoteOrError);
        }

        const upvote: CommentVote = upvoteOrError.getValue();
        comment.addVote(upvote);

        post.updateComment(comment);

        return new Right(Result.ok<void>());
    }

    // TODO: Start from here!
    // public downvotePost(post: Post, member: Member, existingVotesOnPostByMember: PostVote[]): DownvotePostresponse {
    //     // If already downvoted, do nothing
    //     const existingDownvote: PostVote | undefined = existingVotesOnPostByMember.find(vote => vote.isDownvote());

    //     const downvoteAlreadyExists = !!existingDownvote;

    //     if (downvoteAlreadyExists) {
    //         return new Right(Result.ok<void>());
    //     }

    //     // if upvote exists, we need to remove it
    //     const existingUpvote: PostVote | undefined = existingVotesOnPostByMember.find(vote => vote.isUpvote());

    //     const upvoteAlreadyExists = !!existingUpvote;

    //     if (upvoteAlreadyExists) {
    //         post.removeVote(existingUpvote);

    //         return new Right(Result.ok<void>());
    //     }

    //     // Otherwise, we get to create the downvote now.
    //     // const down;
    // }
}
