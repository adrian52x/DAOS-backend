import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { Ensemble } from 'src/ensembles/schema/ensemble.schema';
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
	author: User;

	@Prop({ type: Types.ObjectId, ref: 'Ensemble' }) // not required - only if post is part of an ensemble
  	ensemble: Ensemble;
}

export const PostSchema = SchemaFactory.createForClass(Post);
