import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export interface Instrument {
	name: string;
	level: number;
	genre: string;
}

@Schema()
export class User {
	
	readonly _id: Types.ObjectId;
	
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop()
	address: string;

	@Prop()
	zipcode: string;

	@Prop()
	phone: string;

	@Prop()
	profileText: string;

	@Prop()
	dateOfBirth: Date;

	@Prop({ type: [{ name: String, level: Number, genre: String, _id: false }] })
	instruments: Instrument[];

	@Prop()
	createdAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);
