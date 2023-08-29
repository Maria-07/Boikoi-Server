import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { OldBookService } from './oldBook.service';
import sendResponse from '../../../shared/sendResponse';
import { oldBookFilterableFields } from '../../../constance/filterableFields';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constance/paginationC';
import { IOldBook } from './oldBook.interface';

//! create an old Book profile
const createOldBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    let verifiedToken = null;

    try {
      verifiedToken = jwtHelpers.verifyToken(
        token as string,
        config.jwt.secret as Secret
      );
    } catch (err) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
    }

    console.log('verifiedToken =======', verifiedToken);

    const { userEmail } = verifiedToken;

    const { ...bookData } = req.body;
    const result = await OldBookService.createOldBook({
      ...bookData,
      userEmail,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Book created successfully',
      data: result,
    });
  }
);

//! get all Book [search and filter]
const getAllOldBook = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, oldBookFilterableFields);
  // console.log('filters ==== ', filters);

  const paginationOption = pick(req.query, paginationFields);

  const result = await OldBookService.getAllOldBook(filters, paginationOption);

  sendResponse<IOldBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

//! get a single Old Book
const getSingleOldBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await OldBookService.getSingleOldBook(id);

  sendResponse<IOldBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single book retrieved successfully',
    data: result,
  });
});

//! Update Old Book
const updateOldBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const token = req.headers.authorization;

  const result = await OldBookService.updateOldBook(
    id,
    updatedData,
    token as string
  );

  sendResponse<IOldBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book Updated successfully',
    data: result,
  });
});

//! Delete Old Book
const deleteOldBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  // BookAuth(token as string, id);

  const result = await OldBookService.deleteOldBook(id, token as string);

  sendResponse<IOldBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book Deleted successfully',
    data: result,
  });
});

export const OldBookController = {
  createOldBook,
  getAllOldBook,
  getSingleOldBook,
  updateOldBook,
  deleteOldBook,
};
