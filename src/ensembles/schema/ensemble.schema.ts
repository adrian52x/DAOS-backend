import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

export type EnsembleDocument = Ensemble & Document;

@Schema()
export class Ensemble {
    @Prop({ required: true })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    owner: User;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    members: string[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    pendingRequests: string[];
}

export const EnsembleSchema = SchemaFactory.createForClass(Ensemble);