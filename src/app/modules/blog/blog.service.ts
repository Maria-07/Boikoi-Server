import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import {
  IGenericResponse,
  IPaginationOption,
} from '../../../interfaces/pagination';
import { blogSearchableFields } from './blog.constance';
import { IBlog, IBlogFilter, IComment } from './blog.interface';
import { Blog } from './blog.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

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

// get a single Blog
const getSingleBlog = async (id: string): Promise<IBlog | null> => {
  const result = await Blog.findById(id);
  return result;
};

// updated Blog
const updateBlog = async (
  id: string,
  payload: Partial<IBlog>
): Promise<IBlog | null> => {
  const result = await Blog.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

// Delete Blog
const deleteBlog = async (id: string): Promise<IBlog | null> => {
  const result = await Blog.findByIdAndDelete({ _id: id }, { new: true });

  return result;
};

// add Comment
const AddBlogComment = async (
  blogId: string,
  comments: IComment
): Promise<void> => {
  const blog = await Blog.findById(blogId).lean().exec();

  console.log('comments', comments);

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'blog not found');
  }

  if (!blog.comments) {
    blog.comments = [];
  }

  comments.date = new Date();
  blog.comments.push(comments);

  await Blog.findByIdAndUpdate(blogId, {
    comments: blog.comments,
  })
    .sort('date')
    .exec();
};

export const BlogService = {
  createBlog,
  getAllBlog,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  AddBlogComment,
};
