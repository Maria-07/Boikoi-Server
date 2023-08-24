import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type ILocation =
  | 'Nilkhet Book Market'
  | 'BanglaBazar Book Market'
  | 'Aziz Super Market'
  | 'Rokomari Book Store'
  | 'Prothoma Prokashon Bookstores'
  | 'Pathak Shamabesh Center'
  | 'Batighar'
  | 'Jonaki Boi Ghar'
  | 'Bookworm'
  | 'Bookshelf'
  | 'Others';

export type IAddress = {
  street: string;
  area: string;
  city: string;
};

export type IShop = {
  shop_name: string;
  shop_number?: string;
  contact_number: string;
  image?: string;
  location: ILocation;
  address: IAddress;
  shop_weekend?: string;
  shop_open_time?: string;
  shop_close_time?: string;
  book_shop_ratings?: string;
  userEmail?: string;
  description?: string;
  bookShopOwner: Types.ObjectId | IUser;
};

export type IShopFilter = {
  searchTerm?: string;
  shop_name?: string;
  shop_number?: string;
  contact_number?: string;
  shop_weekend?: string;
  shop_open_time?: string;
  shop_close_time?: string;
  book_shop_ratings?: string;
};

export type ShopModel = Model<IShop, Record<string, unknown>>;
