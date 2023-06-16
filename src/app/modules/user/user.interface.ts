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

export type UserModel = Model<IUser, Record<string, unknown>>;

export type IUserFilters = {
  searchTerm?: string;
  id?: string;
  role?: string;
  phoneNumber?: string;
  budget?: string;
};
