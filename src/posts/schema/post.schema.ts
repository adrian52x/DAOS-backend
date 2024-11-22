import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { Ensemble } from 'src/ensembles/schema/ensemble.schema';
import { User } from 'src/users/schema/user.schema';
export interface Instrument {
	name: string;
	level: number;
	genre: string;
}
export type PostDocument = Post & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt
export class Post {
	readonly _id: Types.ObjectId;

	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	description: string;

	@Prop({ type: [{ name: String, level: Number, genre: String, _id: false }] })
	instruments: Instrument[];

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	author: User;

	@Prop({ type: Types.ObjectId, ref: 'Ensemble' }) // Optional ensemble reference
	ensemble: Ensemble;
}

export const PostSchema = SchemaFactory.createForClass(Post);
