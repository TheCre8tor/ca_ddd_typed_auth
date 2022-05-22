import { Comment } from '../../domain/entities/comment/comment';
import { CommentId } from '../../domain/entities/comment/comment_id';
import { MemberId } from '../../domain/entities/member/member_id';
import { CommentDetails } from '../../domain/value_objects/post/post_details';
import { CommentDetailsMap } from '../../mappers/comment_details.map';
import { ICommentRepository } from './comment_repository.interface';
import { ICommentVotesRepository } from './comment_votes_repository.interface';

export class CommentRepositoryImpl implements ICommentRepository {
    // TODO: Revisit
    private models: any;
    private commentVotesRepo: ICommentVotesRepository;

    constructor(models: any, commentVotesRepo: ICommentVotesRepository) {
        this.models = models;
        this.commentVotesRepo = commentVotesRepo;
    }
    getCommentDetailsByPostSlug(slug: string, memberId?: MemberId, offset?: number): Promise<CommentDetails[]> {
        throw new Error('Method not implemented.');
    }
    getCommentDetailsByCommentId(commentId: string, memberId?: MemberId): Promise<CommentDetails> {
        throw new Error('Method not implemented.');
    }
    getCommentByCommentId(commentId: string): Promise<Comment> {
        throw new Error('Method not implemented.');
    }
    save(comment: Comment): Promise<void> {
        throw new Error('Method not implemented.');
    }
    saveBulk(comments: Comment[]): Promise<void> {
        throw new Error('Method not implemented.');
    }
    deleteComment(commentId: CommentId): Promise<void> {
        throw new Error('Method not implemented.');
    }

    private createBaseQuery(): any {
        return {
            where: {}
        };
    }

    private createBaseDetailsQuery(): any {
        const models = this.models;
        return {
            where: {},
            include: [
                { model: models.Post, as: 'Post', where: {} },
                {
                    model: models.Member,
                    as: 'Member',
                    include: [{ model: models.BaseUser, as: 'BaseUser' }]
                }
            ],
            limit: 15,
            offset: 0
        };
    }

    async exists(commentId: string): Promise<boolean> {
        const CommentModel = this.models.Comment;
        const detailsQuery = this.createBaseQuery();

        detailsQuery.where['comment_id'] = commentId;

        const comment = await CommentModel.findOne(detailsQuery);
        const found = !!comment === true;

        return found;
    }

    // TODO: Come back here
    // async getCommetDetailsByPostSlug(slug: string, memberId?: MemberId, offset?: number): Promise<CommentDetails[]> {
    //     const CommentModel = this.models.Comment;
    //     const detailsQuery = this.createBaseDetailsQuery();
    //     detailsQuery.include[0].where['slug'] = slug;

    //     if (!!memberId === true) {
    //         detailsQuery.inlude.push({
    //             model: this.models.CommentVote,
    //             as: 'CommentVotes',
    //             where: { member_id: memberId?.id.toString() },
    //             required: false
    //         });
    //     }

    //     const comments = await CommentModel.findAll(detailsQuery);
    //     return comments.map(c => CommentDetailsMap.toDomain(c));
    // }
}
