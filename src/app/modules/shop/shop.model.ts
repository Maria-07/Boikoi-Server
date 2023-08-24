import { Schema, model } from 'mongoose';
import { IShop, ShopModel } from './shop.interface';
import { locations } from './shop.constant';

const ShopSchema = new Schema<IShop, ShopModel>(
  {
    shop_name: { type: String, required: true },
    shop_number: { type: String, required: true },
    contact_number: { type: String, required: true },
    image: { type: String },
    location: { type: String, enum: locations, required: true },
    address: {
      type: {
        street: { type: String },
        area: { type: String },
        city: { type: String },
      },
      required: true,
    },
    shop_weekend: { type: String },
    shop_open_time: { type: String },
    shop_close_time: { type: String },
    book_shop_ratings: { type: String },
    userEmail: {
      type: String,
    },
    bookShopOwner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Shop = model<IShop, ShopModel>('Shop', ShopSchema);
