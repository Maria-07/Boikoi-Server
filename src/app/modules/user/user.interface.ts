/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IRole = 'customer' | 'bookShopOwner' | 'admin';

export type IUser = {
  role: IRole;
  password: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  contact: string;
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
