import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type IBookShopOwner = {
  name: UserName;
  contact: string;
};

export type BookShopOwnerModel = Model<IBookShopOwner, Record<string, unknown>>;
