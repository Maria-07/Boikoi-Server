import { Schema, model } from 'mongoose';
import { BookModel, IBook } from './book.interface';
import { bookGenres } from './book.constance';

const BookSchema = new Schema<IBook, BookModel>(
  {
    title: { type: String, required: true },
    image: { type: String },
    author_name: { type: String },
    publisher_name: { type: String },
    genre: { type: String, enum: bookGenres },
    class_level: { type: String },
    faculty_name: { type: String },
    quantity: { type: Number },
    description: { type: String },
    price: { type: Number, required: true },
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
    reviews: [
      {
        name: { type: String },
        review: { type: String },
        date: { type: Date },
        rating: { type: Number },
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

export const Book = model<IBook, BookModel>('Book', BookSchema);
