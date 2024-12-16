import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';
import { Ensemble } from 'src/ensembles/schema/ensemble.schema';
import { User } from 'src/users/schema/user.schema';
import { InstrumentDto } from '../../instruments/instrument.dto';

export type PostDocument = Post & Document;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt
export class Post {
	readonly _id: Types.ObjectId;

	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	description: string;

	@Prop({
		type: {
			name: { type: String, required: true },
			level: { type: Number, required: true },
			genre: { type: [String], required: true },
			_id: false,
		},
	})
	instrument: InstrumentDto;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true })
	author: User;

	@Prop({ type: Types.ObjectId, ref: 'Ensemble' })
	ensemble: Ensemble;

	@Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
	pendingRequests: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);