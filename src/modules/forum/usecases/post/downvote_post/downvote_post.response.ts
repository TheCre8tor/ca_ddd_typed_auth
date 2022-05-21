import { Either } from '../../../../../shared/core/either';
import { AppError } from '../../../../../shared/core/errors/app_error';
import { Result } from '../../../../../shared/core/result';
import { DownvotePostErrors } from './downvote_post.errors';

export type DownvotePostResponse = Either<
    | DownvotePostErrors.MemberNotFoundError
    | DownvotePostErrors.AlreadyDownvotedError
    | DownvotePostErrors.PostNotFoundError
    | AppError.UnexpectedError
    | Result<any>,
    Result<void>
>;
