import { Comment } from '../../domain/entities/comment/comment';
import { CommentId } from '../../domain/entities/comment/comment_id';
import { MemberId } from '../../domain/entities/member/member_id';
import { CommentDetails } from '../../domain/value_objects/post/post_details';

export interface ICommentRepo {
    exists(commentId: string): Promise<boolean>;
    getCommentDetailsByPostSlug(slug: string, memberId?: MemberId, offset?: number): Promise<CommentDetails[]>;
    getCommentDetailsByCommentId(commentId: string, memberId?: MemberId): Promise<CommentDetails>;
    getCommentByCommentId(commentId: string): Promise<Comment>;
    save(comment: Comment): Promise<void>;
    saveBulk(comments: Comment[]): Promise<void>;
    deleteComment(commentId: CommentId): Promise<void>;
}
