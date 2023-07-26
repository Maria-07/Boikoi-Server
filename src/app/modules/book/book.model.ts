import { Schema, model } from 'mongoose';
import { BookModel, IBook } from './book.interface';
import { bookGenres, educationLevels, facultiesList } from './book.constance';

const BookSchema = new Schema<IBook, BookModel>(
  {
    title: { type: String, required: true },
    image: { type: String },
    author_name: { type: String, required: true },
    publisher_name: { type: String, required: true },
    genre: { type: String, enum: bookGenres },
    class_level: { type: String, enum: educationLevels },
    faculty_name: { type: String, enum: facultiesList },
    quantity: { type: Number },
    description: { type: String },
    price: { type: String, required: true },
    is_sale: { type: Boolean, default: false },
    Last_edition: { type: String },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    userEmail: {
      type: String,
    },
    reviews: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Book = model<IBook, BookModel>('Book', BookSchema);
