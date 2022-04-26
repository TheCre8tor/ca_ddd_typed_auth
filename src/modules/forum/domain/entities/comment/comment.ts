import { CommentText } from '../../value_objects/comment/comment_text';
import { MemberId } from '../member/member_id';

export interface CommentProps {
    memberId: MemberId;
    text: CommentText;
}
