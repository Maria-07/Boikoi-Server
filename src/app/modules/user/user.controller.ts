import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { IUser } from './user.interface';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

// Get Profile Data
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  const result = await UserService.getMyProfile(token as string);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users information retrieved successfully',
    data: result,
  });
});

export const UserController = {
  getMyProfile,
};
