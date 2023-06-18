'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.User = void 0;
const mongoose_1 = require('mongoose');
const user_constance_1 = require('./user.constance');
const UserSchema = new mongoose_1.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
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
exports.User = (0, mongoose_1.model)('User', UserSchema);
