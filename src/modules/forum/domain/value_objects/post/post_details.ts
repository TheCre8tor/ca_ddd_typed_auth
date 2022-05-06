import { result } from 'lodash';
import { Guard } from '../../../../../shared/core/guard';
import { Result } from '../../../../../shared/core/result';
import { ValueObject } from '../../../../../shared/domain/value_objects/value_object';
import { CommentId } from '../../entities/comment/comment_id';
import { CommentText } from '../comment/comment_text';
import { MemberDetails } from '../member/member_details';
import { PostSlug } from './post_slug';
import { PostTitle } from './post_title';

interface CommentDetailsProps {
    commentId: CommentId;
    text: CommentText;
    member: MemberDetails;
    createdAt: Date | string;
    postSlug: PostSlug;
    postTitle: PostTitle;
    parentCommentId?: CommentId;
    points: number;
    wasUpvotedByMe: boolean;
    wasDownvotedByMe: boolean;
}

export class CommentDetails extends ValueObject<CommentDetailsProps> {
    private constructor(props: CommentDetailsProps) {
        super(props);
    }

    get commentId(): CommentId {
        return this.props.commentId;
    }

    get text(): CommentText {
        return this.props.text;
    }

    get member(): MemberDetails {
        return this.props.member;
    }

    get createdAt(): Date | string {
        return this.props.createdAt;
    }

    get postSlug(): PostSlug {
        return this.props.postSlug;
    }

    get postTitle(): PostTitle {
        return this.props.postTitle;
    }

    get parentCommentId(): CommentId | undefined {
        return this.props.parentCommentId;
    }

    get points(): number {
        return this.props.points;
    }

    get wasUpvotedByMe(): boolean {
        return this.props.wasUpvotedByMe;
    }

    get wasDownvotedByMe(): boolean {
        return this.props.wasDownvotedByMe;
    }

    public static create(props: CommentDetailsProps): Result<CommentDetails> {
        const nullGuard = Guard.againstNullOrUndefinedBulk([
            { argument: props.commentId, argumentName: 'commentId' },
            { argument: props.text, argumentName: 'text' },
            { argument: props.member, argumentName: 'member' },
            { argument: props.createdAt, argumentName: 'createdAt' },
            { argument: props.postSlug, argumentName: 'postSlug' },
            { argument: props.postTitle, argumentName: 'postTitle' },
            { argument: props.points, argumentName: 'points' }
        ]);

        if (!nullGuard.succeeded) {
            return Result.fail<CommentDetails>(nullGuard.message!);
        }

        return Result.ok<CommentDetails>(
            new CommentDetails({
                ...props,
                wasUpvotedByMe: props.wasUpvotedByMe ? props.wasUpvotedByMe : false,
                wasDownvotedByMe: props.wasDownvotedByMe ? props.wasDownvotedByMe : false
            })
        );
    }
}
