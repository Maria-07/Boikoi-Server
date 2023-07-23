import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type ICustomer = {
  name: UserName;
  contact: string;
};

export type CustomerModel = Model<ICustomer, Record<string, unknown>>;
