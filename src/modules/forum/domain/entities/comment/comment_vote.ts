import { Guard } from '../../../../../shared/core/guard';
import { Result } from '../../../../../shared/core/result';
import { Entity } from '../../../../../shared/domain/entities/entity';
import { UniqueEntityID } from '../../../../../shared/domain/utils/unique_entity_id';
import { VoteType } from '../../vote';
import { MemberId } from '../member/member_id';
import { CommentId } from './comment_id';

interface CommentVoteProps {
    commentId: CommentId;
    memberId: MemberId;
    type: VoteType;
}

export class CommentVote extends Entity<CommentVoteProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get commentId(): CommentId {
        return this.props.commentId;
    }

    get memberId(): MemberId {
        return this.props.memberId;
    }

    get type(): VoteType {
        return this.props.type;
    }

    private constructor(props: CommentVoteProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public isUpvote(): boolean {
        return this.props.type === 'UPVOTE';
    }

    public isDownvote(): boolean {
        return this.props.type === 'DOWNVOTE';
    }

    public static create(props: CommentVoteProps, id?: UniqueEntityID): Result<CommentVote> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.memberId, argumentName: 'memberId' },
            { argument: props.commentId, argumentName: 'commentId' },
            { argument: props.type, argumentName: 'type' }
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<CommentVote>(guardResult.message!);
        } else {
            return Result.ok<CommentVote>(new CommentVote(props, id));
        }
    }

    public static createUpvote(memberId: MemberId, commentId: CommentId): Result<CommentVote> {
        const memberGuard = Guard.againstNullOrUndefined(memberId, 'memberId');
        const commentGuard = Guard.againstNullOrUndefined(commentId, 'commentId');

        if (!memberGuard.succeeded) {
            return Result.fail<CommentVote>(memberGuard.message!);
        }

        if (!commentGuard.succeeded) {
            return Result.fail<CommentVote>(commentGuard.message!);
        }

        return Result.ok<CommentVote>(
            new CommentVote({
                memberId,
                commentId,
                type: 'UPVOTE'
            })
        );
    }

    public static createDownvote(memberId: MemberId, commentId: CommentVote): Result<CommentVote> {
        const memberGuard = Guard.againstNullOrUndefined(memberId, 'memberId');
        const commentGuard = Guard.againstNullOrUndefined(commentId, 'commentId');

        if (!memberGuard.succeeded) {
            return Result.fail<CommentVote>(memberGuard.message!);
        }

        if (!commentGuard.succeeded) {
            return Result.fail<CommentVote>(commentGuard.message!);
        }

        return Result.ok<CommentVote>(
            new CommentVote({
                memberId,
                commentId,
                type: 'DOWNVOTE'
            })
        );
    }
}
