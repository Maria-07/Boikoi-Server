import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './order.services';
import { Order } from './order.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { error } from 'winston';
import { Cow } from '../cow/cow.model';

// create Order
const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...order } = req.body;
    // console.log('order pro', order);

    const result = await OrderService.createOrder(order);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  }
);

// get Order
const getOrder = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  // console.log('Token => 🔖🔖', token);

  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token as string,
      config.jwt.secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  // console.log('verifiedToken =======>', verifiedToken);

  const { phone, role } = verifiedToken;

  const userId = await User.findOne({ phoneNumber: phone }, { _id: 1 });
  // console.log('userID 👥', userId?.id);
  const id = userId?.id;

  // const cow = await Order.

  let query = {};
  let result;

  if (role === 'buyer') {
    query = {
      buyer: id,
    };
    result = await Order.find(query)
      .populate('cow')
      .populate('buyer')
      .populate({
        path: 'cow',
        populate: {
          path: 'seller',
          model: 'User',
        },
      });
  } else if (role === 'seller') {
    const CowList = await Cow.find({ seller: id }, { _id: 1 });
    // console.log('CowDetails', CowList);

    const cowIdList = CowList.map(c => c._id);
    // console.log('id======', cowIdList);

    result = await Order.find({ cow: { $in: cowIdList } }).populate({
      path: 'cow',
      populate: {
        path: 'seller',
        model: 'User',
      },
    });
  } else if (role === 'admin') {
    result = await Order.find({})
      .populate('cow')
      .populate('buyer')
      .populate({
        path: 'cow',
        populate: {
          path: 'seller',
          model: 'User',
        },
      });
  } else {
    throw error;
  }

  // console.log('Total Orders', result.length);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

// get a single Order
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const token = req.headers.authorization;

  const result = await OrderService.getSingleOrder(id, token as string);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getOrder,
  getSingleOrder,
};
