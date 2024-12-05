import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InstrumentDto } from 'src/posts/dto/instrument.dto';

export type UserDocument = User & Document;

export interface Instrument {
	name: string;
	level: number;
	genre: string;
}

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt
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
	zipCode: string;

	@Prop()
	phone: string;

	@Prop()
	profileText: string;

	@Prop()
	dateOfBirth: Date;

	@Prop({ type: [{ name: String, level: Number, genre: String, _id: false }] })
	instruments: InstrumentDto[];
}

export const UserSchema = SchemaFactory.createForClass(User);
