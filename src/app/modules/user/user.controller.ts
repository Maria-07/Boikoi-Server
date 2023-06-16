import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import pick from '../../../shared/pick';
import { userSearchableFields } from '../../../constance/searchableFields';
import { paginationFields } from '../../../constance/paginationC';
import { IUser } from './user.interface';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...user } = req.body;
    console.log(user);

    const result = await UserService.createUser(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully',
      data: result,
    });
  }
);

// get all user [search and filter]
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userSearchableFields);

  const paginationOption = pick(req.query, paginationFields);

  const result = await UserService.getAllUsers(filters, paginationOption);

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student get successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const UserController = {
  createUser,
  getAllUsers,
};
