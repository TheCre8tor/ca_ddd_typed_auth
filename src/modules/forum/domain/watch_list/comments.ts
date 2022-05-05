import { WatchedList } from '../../../../shared/domain/watch_list/watch_list';
import { Comment } from '../entities/comment/comment';

export class Comments extends WatchedList<any> {
    private constructor(initialVotes: Comment[]) {
        super(initialVotes);
    }

    public compareItems(a: Comment, b: Comment): boolean {
        return a.equals(b);
    }

    public static create(comments?: Comment[]): Comments {
        return new Comments(comments ? comments : []);
    }
}
