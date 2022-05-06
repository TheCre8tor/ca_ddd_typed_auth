import { WatchedList } from '../../../../shared/domain/watch_list/watch_list';
import { PostVote } from '../value_objects/post/post_vote';

export class PostVotes extends WatchedList<PostVote> {
    private constructor(initialVotes: PostVote[]) {
        super(initialVotes);
    }

    public compareItems(a: PostVote, b: PostVote): boolean {
        return a.equals(b);
    }

    public static create(initialVotes?: PostVote[]): PostVotes {
        return new PostVotes(initialVotes ? initialVotes : []);
    }
}
