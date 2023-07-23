import { Schema, model } from 'mongoose';
import { BookShopOwnerModel, IBookShopOwner } from './bookShopOwner.interface';

export const BookShopOwnerSchema = new Schema<IBookShopOwner>(
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

export const BookShopOwner = model<IBookShopOwner, BookShopOwnerModel>(
  'BookShopOwner',
  BookShopOwnerSchema
);
