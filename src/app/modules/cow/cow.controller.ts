import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { CowService } from './cow.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constance/paginationC';
import { ICow } from './cow.interface';
import { cowFilterableFields } from '../../../constance/filterableFields';

// create a cow profile
const createCow: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...cowData } = req.body;
    const result = await CowService.createCow(cowData);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Cow created successfully',
      data: result,
    });
  }
);

// get all cow [search and filter]
const getAllCow = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, cowFilterableFields);
  // console.log('filters ==== ', filters);

  const paginationOption = pick(req.query, paginationFields);

  const result = await CowService.getAllCow(filters, paginationOption);

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cows retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get a single cow
const getSingleCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CowService.getSingleCow(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrieved successfully',
    data: result,
  });
});

// Update Cow
const updateCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const token = req.headers.authorization;

  const result = await CowService.updateCow(id, updatedData, token as string);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow Updated successfully',
    data: result,
  });
});

// Delete Cow
const deleteCow = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  // cowAuth(token as string, id);

  const result = await CowService.deleteCow(id, token as string);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow Deleted successfully',
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCow,
  getSingleCow,
  deleteCow,
  updateCow,
};
