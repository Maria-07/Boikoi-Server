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

// create Order
const createOrder: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...order } = req.body;
    console.log('order pro', order);

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
  console.log('Token => 🔖🔖', token);

  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token as string,
      config.jwt.secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  console.log('verifiedToken =======>', verifiedToken);

  const { phone, role } = verifiedToken;

  const userId = await User.findOne({ phoneNumber: phone }, { _id: 1 });
  console.log('userID 👥', userId?.id);
  const id = userId?.id;

  // const cow = await Order.

  let query = {};

  if (role === 'buyer') {
    query = {
      buyer: id,
    };
  }

  if (role === 'admin') {
    query = {};
  }

  if (role === 'seller') {
    query = {
      'cow.seller.id': id,
    };
  }

  const result = await Order.find(query)
    .populate('cow')
    .populate('buyer')
    .populate({
      path: 'cow',
      populate: {
        path: 'seller',
        model: 'User',
      },
    });
  // console.log('R E S U  L T', result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getOrder,
};
