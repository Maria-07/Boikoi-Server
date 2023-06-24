import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { role } from './user.constance';
import bcrypt from 'bcrypt';

const UserSchema: Schema<IUser, UserModel> = new Schema<IUser>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: role, required: true },
    password: { type: String, required: true },
    name: {
      required: true,
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
    },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.statics.isUserExist = async function (
  id: string
): Promise<Pick<IUser, 'phoneNumber' | 'role' | 'password'> | null> {
  return await User.findOne({ id }, { phoneNumber: 1, role: 1, password: 1 });
};

UserSchema.statics.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const User = model<IUser, UserModel>('User', UserSchema);
