import { Model } from 'mongoose';

export type IComment = {
  name: string;
  comment?: string;
  date?: Date;
};

export type IBlog = {
  title: string;
  img?: string;
  blog_part: string;
  email: string;
  user_name: string;
  comments?: IComment[];
};

export type IBlogFilter = {
  searchTerm?: string;
  title?: string;
};

export type BlogModel = Model<IBlog, Record<string, unknown>>;
