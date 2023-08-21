import { Schema, model } from 'mongoose';
import { BlogModel, IBlog } from './blog.interface';

const BlogSchema: Schema<IBlog> = new Schema<IBlog>(
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

export const Blog = model<IBlog, BlogModel>('Blog', BlogSchema);
