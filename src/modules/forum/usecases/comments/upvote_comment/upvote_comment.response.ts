import { Either } from '../../../../../shared/core/either';
import { AppError } from '../../../../../shared/core/errors/app_error';
import { Result } from '../../../../../shared/core/result';
import { UpvotePostErrors } from '../../post/upvote_post/upvote_post.errors';
import { UpvoteCommentErrors } from './upvote_comment.errors';

export type UpvoteCommentResponse = Either<
    | UpvotePostErrors.PostNotFoundError
    | UpvoteCommentErrors.CommentNotFoundError
    | UpvoteCommentErrors.MemberNotFoundError
    | AppError.UnexpectedError
    | Result<any>,
    Result<void>
>;
