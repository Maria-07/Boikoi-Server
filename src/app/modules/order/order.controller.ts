import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './order.services';
import { IOrder } from './order.interface';
import { Order } from './order.model';

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
  const query = {};
  const result = await Order.find(query).populate('cow').populate('buyer');

  sendResponse<IOrder[]>(res, {
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
