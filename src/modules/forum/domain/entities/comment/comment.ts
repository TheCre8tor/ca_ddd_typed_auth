import { CommentText } from '../../value_objects/comment/comment_text';
import { MemberId } from '../member/member_id';
import { PostId } from '../post/post_id';

export interface CommentProps {
    memberId: MemberId;
    postId: PostId;
    text: CommentText;
}
