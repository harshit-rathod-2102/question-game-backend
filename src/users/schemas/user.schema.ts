import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, minlength: 2 })
  firstName: string;

  @Prop({ required: true, minlength: 2 })
  lastName: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop()
  profilePicture?: string;

  @Prop({ required: true })
  birthdate: Date;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ default: 'player' })
  role: string;

  @Prop({ default: [] })
  permissions: number[];

  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual for full name
UserSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
