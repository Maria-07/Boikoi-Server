'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Admin = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require('mongoose');
const bcrypt_1 = __importDefault(require('bcrypt'));
const config_1 = __importDefault(require('../../../config'));
const AdminSchema = new mongoose_1.Schema(
  {
    phoneNumber: { type: String, unique: true, required: true },
    role: { type: String, enum: ['admin'], required: true },
    password: { type: String, required: true, select: 0 },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    address: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
AdminSchema.statics.isUserExist = function (phoneNumber) {
  return __awaiter(this, void 0, void 0, function* () {
    return yield exports.Admin.findOne(
      { phoneNumber },
      { phoneNumber: 1, role: 1, password: 1 }
    );
  });
};
AdminSchema.statics.isPasswordMatch = function (givenPassword, savedPassword) {
  return __awaiter(this, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(givenPassword, savedPassword);
  });
};
AdminSchema.pre('save', function (next) {
  return __awaiter(this, void 0, void 0, function* () {
    const user = this;
    //hash password
    user.password = yield bcrypt_1.default.hash(
      user.password,
      Number(config_1.default.bcrypt_salt_rounds)
    );
    next();
  });
});
exports.Admin = (0, mongoose_1.model)('Admin', AdminSchema);
