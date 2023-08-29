import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IOldBook = {
  title: string;
  image?: string;
  author_name?: string;
  publisher_name?: string;
  class_level?: string;
  faculty_name?: string;
  description?: string;
  price?: number;
  Last_edition?: string;
  userEmail?: string;
  customer: Types.ObjectId | IUser;
};

export type IOldBookFilter = {
  searchTerm?: string;
  title?: string;
  author_name?: string;
  publisher_name?: string;
  class_level?: string;
  faculty_name?: string;
  Last_edition?: string;
  userEmail?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type OldBookModel = Model<IOldBook, Record<string, unknown>>;
