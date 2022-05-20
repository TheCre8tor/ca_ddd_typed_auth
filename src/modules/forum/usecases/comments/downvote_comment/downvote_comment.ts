import { Either } from '../../../../../shared/core/either';
import { AppError } from '../../../../../shared/core/errors/app_error';
import { Result } from '../../../../../shared/core/result';
import { DownvoteCommentErrors } from './downvote_comment.errors';

export type DownvoteCommentResponse = Either<
    | DownvoteCommentErrors.CommentNotFoundError
    | DownvoteCommentErrors.MemberNotFoundError
    | DownvoteCommentErrors.PostNotFoundError
    | AppError.UnexpectedError
    | Result<any>,
    Result<void>
>;
