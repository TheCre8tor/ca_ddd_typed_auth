import { Either } from '../../../../../shared/core/either';
import { AppError } from '../../../../../shared/core/errors/app_error';
import { Result } from '../../../../../shared/core/result';
import { UpvotePostErrors } from './upvote_post.errors';

export type UpvotePostResponse = Either<
    | UpvotePostErrors.MemberNotFoundError
    | UpvotePostErrors.AlreadyUpvotedError
    | UpvotePostErrors.PostNotFoundError
    | AppError.UnexpectedError
    | Result<any>,
    Result<void>
>;
