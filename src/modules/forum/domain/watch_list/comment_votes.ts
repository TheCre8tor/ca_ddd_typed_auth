import { WatchedList } from '../../../../shared/domain/watch_list/watch_list';
import { CommentVote } from '../entities/comment/comment_vote';

export class CommentVotes extends WatchedList<CommentVote> {
    private constructor(initialVotes: CommentVote[]) {
        super(initialVotes);
    }

    public compareItems(a: CommentVote, b: CommentVote): boolean {
        return a.equals(b);
    }

    public static create(initialVotes?: CommentVote[]): CommentVotes {
        return new CommentVotes(initialVotes ? initialVotes : []);
    }
}
