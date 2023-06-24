import catchAsync from '../../../shared/catchAsync';
import { Request, RequestHandler, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AdminService } from './admin.service';
import { IAdmin } from './admin.interface';

// create user
const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...admin } = req.body;

    const result = await AdminService.createAdmin(admin);

    sendResponse<IAdmin>(res, {
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
