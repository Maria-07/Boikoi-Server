import { Schema, model } from 'mongoose';
import { IShop, ShopModel } from './shop.interface';
import { areas, cities, locations, streets } from './shop.constant';

const ShopSchema = new Schema<IShop, ShopModel>(
  {
    shop_name: { type: String, required: true },
    shop_number: { type: String, required: true },
    contact_number: { type: String, required: true },
    image: { type: String },
    location: { type: String, enum: locations, required: true },
    address: {
      type: {
        street: { type: String, enum: streets },
        area: { type: String, enum: areas },
        city: { type: String, enum: cities },
      },
      required: true,
    },
    shop_weekend: { type: String },
    shop_open_time: { type: String },
    shop_close_time: { type: String },
    book_shop_ratings: { type: String },
    BookShopOwner: {
      type: Schema.Types.ObjectId,
      ref: 'BookShopOwner',
      required: true,
    },
    userEmail: {
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
