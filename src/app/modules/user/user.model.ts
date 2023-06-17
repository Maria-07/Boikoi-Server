import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { role } from './user.constance';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    phoneNumber: { type: String, required: true },
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

UserSchema.pre('save', async function (next) {
  const isExit = await User.findOne({
    phoneNumber: this.phoneNumber,
    role: this.role,
  });

  if (isExit) {
    throw new ApiError(httpStatus.CONFLICT, 'This User is already Exist ❗❗');
  }
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
