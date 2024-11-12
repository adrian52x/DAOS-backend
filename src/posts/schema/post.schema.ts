import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {

	readonly _id: Types.ObjectId;
	
	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	content: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
