import { Guard } from '../../../../../shared/core/guard';
import { Result } from '../../../../../shared/core/result';
import { Entity } from '../../../../../shared/domain/entities/entity';
import { UniqueEntityID } from '../../../../../shared/domain/utils/unique_entity_id';
import { MemberId } from '../../entities/member/member_id';
import { PostId } from '../../entities/post/post_id';
import { VoteType } from '../../vote';

interface PostVoteProps {
    postId: PostId;
    memberId: MemberId;
    type: VoteType;
}

export class PostVote extends Entity<PostVoteProps> {
    private constructor(props: PostVoteProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    get postId(): PostId {
        return this.props.postId;
    }

    get type(): VoteType {
        return this.props.type;
    }

    public isUpvote(): boolean {
        return this.props.type === 'UPVOTE';
    }

    public isDownvote(): boolean {
        return this.props.type === 'DOWNVOTE';
    }

    public static create(props: PostVoteProps, id?: UniqueEntityID): Result<PostVote> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.memberId, argumentName: 'memberid' },
            { argument: props.postId, argumentName: 'postId' },
            { argument: props.type, argumentName: 'type' }
        ]);

        if (!guardResult.succeeded) {
            return Result.fail<PostVote>(guardResult.message!);
        }

        return Result.ok<PostVote>(new PostVote(props, id));
    }
}
