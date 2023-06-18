'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = void 0;
const mongoose_1 = require('mongoose');
const user_constance_1 = require('./user.constance');
// import ApiError from '../../../errors/ApiError';
// import httpStatus from 'http-status';
const UserSchema = new mongoose_1.Schema(
  {
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: user_constance_1.role, required: true },
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
// UserSchema.pre('save', async function (next) {
//   const isExit = await User.findOne({
//     phoneNumber: this.phoneNumber,
//     role: this.role,
//   });
//   if (isExit) {
//     throw new ApiError(httpStatus.CONFLICT, 'This User is already Exist ❗❗');
//   }
//   next();
// });
exports.User = (0, mongoose_1.model)('User', UserSchema);
