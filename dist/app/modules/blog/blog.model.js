'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Blog = void 0;
const mongoose_1 = require('mongoose');
const BlogSchema = new mongoose_1.Schema(
  {
    title: { type: String, required: true },
    img: { type: String },
    blog_part: { type: String, required: true },
    email: { type: String, required: true },
    user_name: { type: String, required: true },
    comments: [
      {
        name: { type: String },
        comment: { type: String },
        date: { type: Date },
        // timestamps: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
exports.Blog = (0, mongoose_1.model)('Blog', BlogSchema);
