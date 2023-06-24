import catchAsync from '../../../shared/catchAsync';
import { Request, RequestHandler, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AdminService } from './admin.service';

// create user
const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...admin } = req.body;

    const result = await AdminService.createAdmin(admin);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully',
      data: result,
    });
  }
);

export const AdminController = {
  createAdmin,
};
