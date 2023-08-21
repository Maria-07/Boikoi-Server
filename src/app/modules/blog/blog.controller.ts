import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { BlogService } from './blog.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { BlogFilterableFields } from './blog.constance';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constance/paginationC';
import { IBlog } from './blog.interface';

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
  // console.log('filters ==== ', filters);

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

export const BlogController = {
  createBlog,
  getAllBlog,
};
