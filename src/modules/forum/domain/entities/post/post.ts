import { Either } from '../../../../../shared/core/either';
import { Result } from '../../../../../shared/core/result';
import { AggregateRoot } from '../../../../../shared/domain/aggregates/aggregate_root';
import { UniqueEntityID } from '../../../../../shared/domain/utils/unique_entity_id';
import { EditPostErrors } from '../../../usecases/post/edit_post/edit_post.error';
import { PostLink } from '../../value_objects/post/post_link';
import { PostSlug } from '../../value_objects/post/post_slug';
import { PostText } from '../../value_objects/post/post_text';
import { PostTitle } from '../../value_objects/post/post_title';
import { PostType } from '../../value_objects/post/post_type';
import { Comments } from '../../watch_list/comments';
import { PostVotes } from '../../watch_list/post_votes';
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
    dateTimePosted: string | Date;
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
        return this.props.dateTimePosted;
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

    // TODO: Start from here -->
}
