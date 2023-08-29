import { Schema, model } from 'mongoose';
import { IOldBook, OldBookModel } from './oldBook.interface';

const OldBookSchema = new Schema<IOldBook, OldBookModel>(
  {
    title: { type: String, required: true },
    image: { type: String },
    author_name: { type: String },
    publisher_name: { type: String },
    class_level: { type: String },
    faculty_name: { type: String },
    description: { type: String },
    price: { type: Number },
    Last_edition: { type: String },
    userEmail: {
      type: String,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const OldBook = model<IOldBook, OldBookModel>('OldBook', OldBookSchema);
