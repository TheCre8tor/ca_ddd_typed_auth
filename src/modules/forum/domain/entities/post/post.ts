import { has } from 'lodash';
import { Either, Left, left, Right } from '../../../../../shared/core/either';
import { Guard, IGuardArgument } from '../../../../../shared/core/guard';
import { Result } from '../../../../../shared/core/result';
import { AggregateRoot } from '../../../../../shared/domain/aggregates/aggregate_root';
import { UniqueEntityID } from '../../../../../shared/domain/utils/unique_entity_id';
import { EditPostErrors } from '../../../usecases/post/edit_post/edit_post.error';
import { CommentPosted } from '../../events/comment_posted';
import { CommentVotesChanged } from '../../events/comment_votes_changed';
import { PostCreated } from '../../events/post_created';
import { PostVotesChanged } from '../../events/post_votes_changed';
import { PostLink } from '../../value_objects/post/post_link';
import { PostSlug } from '../../value_objects/post/post_slug';
import { PostText } from '../../value_objects/post/post_text';
import { PostTitle } from '../../value_objects/post/post_title';
import { PostType } from '../../value_objects/post/post_type';
import { PostVote } from '../../value_objects/post/post_vote';
import { Comments } from '../../watch_list/comments';
import { PostVotes } from '../../watch_list/post_votes';
import { Comment } from '../comment/comment';
import { MemberId } from '../member/member_id';
import { PostId } from './post_id';

export type UpdatePostOrLinkResult = Either<
    EditPostErrors.InvalidPostTypeOperationError | EditPostErrors.PostSealedError | Result<any>,
    Result<void>
>;

export interface PostProps {
    memberId: MemberId;
    slug: PostSlug;
    title: PostTitle;
    type: PostType;
    text?: PostText;
    link?: PostLink;
    comments?: Comments;
    votes?: PostVotes;
    totalNumComments?: number;
    points?: number; // posts can have negative or positive valued points
    dateTimePosted?: string | Date;
}

export class Post extends AggregateRoot<PostProps> {
    private constructor(props: PostProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get postId(): PostId {
        return PostId.create(this._id).getValue();
    }

    get memberId(): MemberId {
        return this.props.memberId;
    }

    get title(): PostTitle {
        return this.props.title;
    }

    get slug(): PostSlug {
        return this.props.slug;
    }

    get dateTimePosted(): Date | string {
        return this.props.dateTimePosted!;
    }

    get comments(): Comments | undefined {
        return this.props.comments;
    }

    get points(): number | undefined {
        return this.props.points;
    }

    get link(): PostLink | undefined {
        return this.props.link;
    }

    get text(): PostText | undefined {
        return this.props.text;
    }

    get type(): PostType {
        return this.props.type;
    }

    get totalNumComments(): number | undefined {
        return this.props.totalNumComments;
    }

    public updateTotalNumberComments(numComments: number): void {
        if (numComments >= 0) {
            this.props.totalNumComments = numComments;
        }
    }

    public hasComments(): boolean {
        return this.totalNumComments !== 0;
    }

    public isTextPost(): boolean {
        return this.props.type === 'text';
    }

    public isLinkPost(): boolean {
        return this.props.type === 'link';
    }

    public updateText(postText: PostText): UpdatePostOrLinkResult {
        if (!this.isTextPost()) {
            return new Left(new EditPostErrors.InvalidPostTypeOperationError());
        }

        if (this.hasComments()) {
            return new Left(new EditPostErrors.PostSealedError());
        }

        const guardResult = Guard.againstNullOrUndefined(postText, 'postText');

        if (!guardResult.succeeded) {
            return new Left(Result.fail<any>(guardResult.message!));
        }

        this.props.text = postText;

        return new Right(Result.ok<void>());
    }

    public updateLink(postLink: PostLink): UpdatePostOrLinkResult {
        if (!this.isLinkPost()) {
            return new Left(new EditPostErrors.InvalidPostTypeOperationError());
        }

        if (this.hasComments()) {
            return new Left(new EditPostErrors.PostSealedError());
        }

        const guardResult = Guard.againstNullOrUndefined(postLink, 'postLink');

        if (!guardResult.succeeded) {
            return new Left(Result.fail<any>(guardResult.message!));
        }

        this.props.link = postLink;

        return new Right(Result.ok<void>());
    }

    public updatePostScore(
        numPostUpvotes: number,
        numPostDownvotes: number,
        numPostCommentUpvotes: number,
        numPostCommentDownvotes: number
    ) {
        const postVotes = numPostUpvotes - numPostDownvotes;
        const postCommentUpvotes = numPostCommentUpvotes - numPostCommentDownvotes;

        this.props.points = postVotes + postCommentUpvotes;
    }

    public addVote(vote: PostVote): Result<void> {
        this.props.votes?.add(vote);

        this.addDomainEvent(new PostVotesChanged(this, vote));
        return Result.ok<void>();
    }

    public removeVote(vote: PostVote): Result<void> {
        this.props.votes?.remove(vote);

        this.addDomainEvent(new PostVotesChanged(this, vote));
        return Result.ok<void>();
    }

    private removeCommentIfExists(comment: Comment): void {
        const isCommentExists = this.props.comments?.exists(comment);

        if (isCommentExists) {
            this.props.comments?.remove(comment);
        }
    }

    public addComment(comment: Comment): Result<void> {
        this.removeCommentIfExists(comment);

        this.props.comments?.add(comment);
        this.props.totalNumComments!++;

        this.addDomainEvent(new CommentPosted(this, comment));
        return Result.ok<void>();
    }

    public updateComment(comment: Comment): Result<void> {
        this.removeCommentIfExists(comment);

        this.props.comments?.add(comment);
        this.addDomainEvent(new CommentVotesChanged(this, comment));

        return Result.ok<void>();
    }

    public getVotes(): PostVotes {
        return this.props.votes!;
    }

    public static isValidPostType(rawType: string): boolean {
        const linkType: PostType = 'link';
        const textType: PostType = 'text';

        return rawType === linkType || rawType === textType;
    }

    public static create(props: PostProps, id?: UniqueEntityID): Result<Post> {
        const guardArgs: IGuardArgument[] = [
            { argument: props.memberId, argumentName: 'memberId' },
            { argument: props.slug, argumentName: 'slug' },
            { argument: props.title, argumentName: 'title' },
            { argument: props.type, argumentName: 'type' }
        ];

        if (props.type === 'link') {
            guardArgs.push({ argument: props.link, argumentName: 'link' });
        } else {
            guardArgs.push({ argument: props.text, argumentName: 'text' });
        }

        const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

        if (!guardResult.succeeded) {
            return Result.fail<Post>(guardResult.message!);
        }

        if (!this.isValidPostType(props.type)) {
            return Result.fail<Post>('Invalid post type provided');
        }

        const defaultValues: PostProps = {
            ...props,
            comments: props.comments ? props.comments : Comments.create([]),
            points: has(props, 'points') ? props.points : 0,
            dateTimePosted: props.dateTimePosted ? props.dateTimePosted : new Date(),
            totalNumComments: props.totalNumComments ? props.totalNumComments : 0,
            votes: props.votes ? props.votes : PostVotes.create([])
        };

        const isNewPost = !!id === false;
        const post = new Post(defaultValues, id);

        if (isNewPost) {
            post.addDomainEvent(new PostCreated(post));

            // Create with initial upvote from whoever created the post
            post.addVote(PostVote.createUpvote(props.memberId, post.postId).getValue());
        }

        return Result.ok<Post>(post);
    }
}
