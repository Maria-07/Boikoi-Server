import { Model } from 'mongoose';

export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type IAdmin = {
  name: UserName;
  contact: string;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>>;
