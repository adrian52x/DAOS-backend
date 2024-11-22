import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { Ensemble } from 'src/ensembles/schema/ensemble.schema';
import { User } from 'src/users/schema/user.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt
export class Post {
	readonly _id: Types.ObjectId;

	@Prop({ required: true })
	name: string; // Name of the ensemble

	@Prop({ required: true })
	area: string; // Location

	@Prop({ required: true })
	numOfMusicians: string; // Number of musicians as a range or number

	@Prop({ required: true })
	description: string; // Post title

	@Prop({ type: [String], required: true }) // Supports multiple instruments
	instrument: string[];

	@Prop({ type: Number, required: true }) // Experience in years
	experience: number;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	author: User;

	@Prop({ type: Types.ObjectId, ref: 'Ensemble' }) // Optional ensemble reference
	ensemble: Ensemble;
}

export const PostSchema = SchemaFactory.createForClass(Post);
