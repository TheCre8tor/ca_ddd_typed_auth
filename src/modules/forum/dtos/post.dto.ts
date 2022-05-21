import { PostType } from '../domain/value_objects/post/post_type';
import { MemberDTO } from './member.dto';

export interface PostDTO {
    slug: string;
    title: string;
    createdAt: string | Date;
    memberPostedBy: MemberDTO;
    numComments: number;
    points: number;
    text: string;
    link: string;
    type: PostType;
    wasUpvotedByMe: boolean;
    wasDownvotedByMe: boolean;
}
