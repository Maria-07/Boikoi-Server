/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { ICustomer } from '../customer/customer.interface';
import { IBookShopOwner } from '../bookshopOwner/bookShopOwner.interface';
import { IAdmin } from '../admin/admin.interface';

export type IRole = 'customer' | 'bookShopOwner' | 'admin';

export type IUser = {
  role: IRole;
  password: string;
  email: string;
  customer?: Types.ObjectId | ICustomer;
  bookShopOwner?: Types.ObjectId | IBookShopOwner;
  admin?: Types.ObjectId | IAdmin;
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<Pick<IUser, 'role' | 'password' | 'email'>>;
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>
