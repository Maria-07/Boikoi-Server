'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Admin = exports.AdminSchema = void 0;
const mongoose_1 = require('mongoose');
exports.AdminSchema = new mongoose_1.Schema(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        middleName: {
          type: String,
        },
      },
      required: true,
    },
    contact: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
exports.Admin = (0, mongoose_1.model)('Admin', exports.AdminSchema);
