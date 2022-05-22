import { prop } from '@typegoose/typegoose';

export class Comment {
    @prop()
    comment_id: string;

    @prop()
    member_id: string;
}
