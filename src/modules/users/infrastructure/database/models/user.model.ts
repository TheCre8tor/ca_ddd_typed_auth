import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class User {
  @prop()
  nano_id: string;

  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true, unique: true, limit: 250 })
  username: string;

  @prop({ required: true, trim: true })
  password: string;

  @prop({ default: false })
  verified: boolean;

  @prop({ default: false })
  is_admin: boolean;

  @prop({ default: false })
  is_deleted: boolean;
}

const UserModel = getModelForClass(User);

export default UserModel;
