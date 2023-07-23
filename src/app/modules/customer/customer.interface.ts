import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export type ICustomer = {
  name: UserName;
  contact: string;
};

export type CustomerModel = Model<ICustomer, Record<string, unknown>>;
