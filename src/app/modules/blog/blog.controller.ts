import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { BlogService } from './blog.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { BlogFilterableFields } from './blog.constance';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constance/paginationC';
import { IBlog, IComment } from './blog.interface';
import ApiError from '../../../errors/ApiError';

// create a Blog
const createBlog: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...blogData } = req.body;
    const result = await BlogService.createBlog(blogData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Blog created successfully',
      data: result,
    });
  }
);

// get all Blog [search and filter]
const getAllBlog = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BlogFilterableFields);

  const paginationOption = pick(req.query, paginationFields);

  const result = await BlogService.getAllBlog(filters, paginationOption);

  sendResponse<IBlog[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get a single Blog
const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.getSingleBlog(id);

  sendResponse<IBlog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

// Update Blog
const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await BlogService.updateBlog(id, updatedData);

  sendResponse<IBlog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Updated successfully',
    data: result,
  });
});

// Delete Blog
const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.deleteBlog(id);

  sendResponse<IBlog>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog Deleted successfully',
    data: result,
  });
});

//* Add comments
const AddBlogComment: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const { name, comment } = req.body;

    const blog = await BlogService.getSingleBlog(blogId);

    if (!blog) {
      throw new ApiError(httpStatus.NOT_FOUND, 'blog not found');
    }

    // Make sure blog.comments is defined before pushing the new review
    if (!blog.comments) {
      blog.comments = [];
    }

    // Add the review to the blog's comments array
    const comments: IComment = { name, comment };
    blog.comments.push(comments);

    // Save the updated blog with the new review
    await BlogService.AddBlogComment(blogId, comments);

    sendResponse<IBlog>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blog Comment added successfully!',
      data: blog,
    });
  }
);

export const BlogController = {
  createBlog,
  getAllBlog,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  AddBlogComment,
};
