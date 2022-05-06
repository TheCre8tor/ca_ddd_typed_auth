import { CommentId } from '../../entities/comment/comment_id';
import { MemberDetails } from '../member/member_details';
import { PostSlug } from '../post/post_slug';
import { CommentText } from './comment_text';

interface CommentDetailsProps {
    commentId: CommentId;
    text: CommentText;
    member: MemberDetails;
    createdAt: Date | string;
    postSlug: PostSlug;
}
