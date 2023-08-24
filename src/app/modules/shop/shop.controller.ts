import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { shopFilterableFields } from '../../../constance/filterableFields';
import { paginationFields } from '../../../constance/paginationC';
import { IShop } from './shop.interface';
import { ShopService } from './shop.service';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { SortOrder } from 'mongoose';
import { Shop } from './shop.model';

//* create a Shop profile
const createShop: RequestHandler = catchAsync(
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

    const { ...shopData } = req.body;
    const result = await ShopService.createShop({ ...shopData, userEmail });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Shop created successfully',
      data: result,
    });
  }
);

// get all Shop [search and filter]
const getAllShop = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, shopFilterableFields);
  // console.log('filters ==== ', filters);

  const paginationOption = pick(req.query, paginationFields);

  const result = await ShopService.getAllShop(filters, paginationOption);

  sendResponse<IShop[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shops retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get a single Shop
const getSingleShop = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ShopService.getSingleShop(id);

  sendResponse<IShop>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop retrieved successfully',
    data: result,
  });
});

//* get all Shop's by address
const getShopAddress = catchAsync(async (req: Request, res: Response) => {
  const paginationOption = pick(req.query, paginationFields);
  const { sortBy, sortOrder } =
    paginationHelpers.calculationPagination(paginationOption);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Shop.find().sort(sortConditions).select({
    address: 1,
    location: 1,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all address successfully',
    data: result,
  });
});

// Update Shop
const updateShop = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const token = req.headers.authorization;

  const result = await ShopService.updateShop(id, updatedData, token as string);

  sendResponse<IShop>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop Updated successfully',
    data: result,
  });
});

// Delete Shop
const deleteShop = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const token = req.headers.authorization;
  // ShopAuth(token as string, id);

  const result = await ShopService.deleteShop(id, token as string);

  sendResponse<IShop>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop Deleted successfully',
    data: result,
  });
});

export const ShopController = {
  createShop,
  getAllShop,
  getSingleShop,
  deleteShop,
  updateShop,
  getShopAddress,
};
