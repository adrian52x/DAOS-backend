// post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true }) // Enables automatic creation of createdAt and updatedAt
export class Post {
	@Prop({ required: true })
	title: string;

	@Prop({ required: true, enum: ['isPlaying', 'isLooking'] })
	postType: 'isPlaying' | 'isLooking';

	@Prop({ required: true })
	instrument: string;

	@Prop({ required: true })
	description: string;

	@Prop({ required: true })
	area: string;

	@Prop({ required: true })
	groupName: string;

	@Prop()
	websiteLink?: string;

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;

	@Prop()
	deletedAt: Date; // Soft delete timestamp
}

export const PostSchema = SchemaFactory.createForClass(Post);
