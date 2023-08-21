import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import {
  IGenericResponse,
  IPaginationOption,
} from '../../../interfaces/pagination';
import { blogSearchableFields } from './blog.constance';
import { IBlog, IBlogFilter } from './blog.interface';
import { Blog } from './blog.model';

// create a Blog
const createBlog = async (blogData: IBlog): Promise<IBlog | null> => {
  const result = await Blog.create(blogData);
  return result;
};

// get all Blogs
const getAllBlog = async (
  filters: IBlogFilter,
  paginationOption: IPaginationOption
): Promise<IGenericResponse<IBlog[]>> => {
  const { searchTerm } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: blogSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculationPagination(paginationOption);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Blog.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const BlogService = {
  createBlog,
  getAllBlog,
};
