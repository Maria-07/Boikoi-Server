import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import httpStatus from 'http-status';

// create customer

const createCustomer: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { customer, ...userData } = req.body;
    const result = await UserService.createCustomer(customer, userData);

    console.log('result ', result);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'user created successfully',
      data: result,
    });
  }
);

export const UserController = { createCustomer };
