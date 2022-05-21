import { ICommentRepository } from './comment_repository.interface';
import { ICommentVotesRepository } from './comment_votes_repository.interface';

export class CommentRepositoryImpl implements ICommentRepo {
    // TODO: Revisit
    private models: any;
    private commentVotesRepo: ICommentVotesRepository;

    constructor(models: any, commentVotesRepo: ICommentVotesRepository) {
        this.models = models;
        this.commentVotesRepo = commentVotesRepo;
    }

    private createBaseQuery(): any {
        return {
            where: {}
        };
    }
}
