import { has } from 'lodash';
import { Guard } from '../../../../../shared/core/guard';
import { Result } from '../../../../../shared/core/result';
import { Entity } from '../../../../../shared/domain/entities/entity';
import { UniqueEntityID } from '../../../../../shared/domain/utils/unique_entity_id';
import { CommentText } from '../../value_objects/comment/comment_text';
import { CommentVotes } from '../../watch_list/comment_votes';
import { MemberId } from '../member/member_id';
import { PostId } from '../post/post_id';
import { CommentId } from './comment_id';
import { CommentVote } from './comment_vote';

export interface CommentProps {
    memberId: MemberId;
    text: CommentText;
    postId: PostId;
    votes?: CommentVotes;
    parentCommentId?: CommentId;
    points?: number;
}

export class Comment extends Entity<CommentProps> {
    private constructor(props: CommentProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get commentId(): CommentId {
        return CommentId.create(this._id).getValue();
    }

    get postId(): PostId {
        return this.props.postId;
    }

    get parentCommentId(): CommentId | undefined {
        return this.props.parentCommentId;
    }

    get memberId(): MemberId {
        return this.props.memberId;
    }

    get text(): CommentText {
        return this.props.text;
    }

    get points(): number {
        let initialValue = this.props.points!;
        return initialValue + this.computeVotePoints();
    }

    private computeVotePoints(): number {
        let tally = 0;

        for (let vote of this.props.votes!.getNewItems()) {
            if (vote.isUpvote()) {
                tally = tally + 1;
            }

            if (vote.isDownvote()) {
                tally = tally - 1;
            }
        }

        for (let vote of this.props.votes!.getRemovedItems()) {
            if (vote.isUpvote()) {
                tally = tally - 1;
            }

            if (vote.isDownvote()) {
                tally = tally + 1;
            }
        }

        return tally;
    }

    public removeVote(vote: CommentVote): Result<void> {
        this.props.votes?.remove(vote);
        return Result.ok<void>();
    }

    public addVote(vote: CommentVote): Result<void> {
        this.props.votes?.add(vote);
        return Result.ok<void>();
    }

    public getVote(): CommentVotes | undefined {
        return this.props.votes;
    }

    public updateScore(totalNumUpvotes: number, totalNumDownvotes: number): void {
        this.props.points = totalNumUpvotes - totalNumDownvotes;
    }

    public static create(props: CommentProps, id?: UniqueEntityID): Result<Comment> {
        const nullGuard = Guard.againstNullOrUndefinedBulk([
            { argument: props.memberId, argumentName: 'memberId' },
            { argument: props.text, argumentName: 'text' },
            { argument: props.postId, argumentName: 'postId' }
        ]);

        if (!nullGuard.succeeded) {
            return Result.fail<Comment>(nullGuard.message!);
        } else {
            const isNewComment = !!id === false;

            const defaultCommentProps: CommentProps = {
                ...props,
                points: has(props, 'points') ? props.points : 0,
                votes: props.votes ? props.votes : CommentVotes.create([])
            };

            const comment = new Comment(defaultCommentProps, id);

            if (isNewComment) {
                comment.addVote(CommentVote.createUpvote(props.memberId, comment.commentId).getValue());
            }

            return Result.ok<Comment>(comment);
        }
    }
}
