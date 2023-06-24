/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IRole = 'seller' | 'buyer';

export type IUser = {
  phoneNumber: string;
  role: IRole;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  budget: number;
  income: number;
};

export type UserModel = {
  isUserExist(
    phoneNumber: string
  ): Promise<Pick<IUser, 'phoneNumber' | 'role' | 'password'>>;
  isPasswordMatch(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

// export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
  role?: string;
  phoneNumber?: string;
  budget?: number;
  income?: number;
};
