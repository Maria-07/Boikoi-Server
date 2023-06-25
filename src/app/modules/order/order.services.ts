import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Cow } from '../cow/cow.model';

// create a Order
const createOrder = async (order: IOrder): Promise<IOrder | null> => {
  console.log('order = ', order);

  const BuyerDetails = await User.findById(order.buyer);
  console.log('BuyerDetails', BuyerDetails);

  const CowDetails = await Cow.findById(order.cow);
  console.log('CowDetails', CowDetails);

  if (BuyerDetails?.role !== 'buyer') {
    throw new ApiError(httpStatus.NOT_FOUND, 'This user is not a buyer');
  }

  if (!CowDetails || !BuyerDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Buyer and Cow Id not founded');
  }

  if (CowDetails.label === 'sold out') {
    throw new ApiError(httpStatus.NOT_FOUND, 'This Cow is already sold out');
  }

  if (BuyerDetails.budget < CowDetails.price) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Buyer Does not have sufficient budget to buy this cow'
    );
  }

  let newOrderAllData = null;

  // Start the transaction
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Update the cow's label to 'sold out'
    await Cow.updateOne(
      { _id: CowDetails.id },
      { $set: { label: 'sold out' } }
    );

    // Deduct the cost of the cow from the buyer's budget
    const buyerBudgetUpdate = {
      budget: BuyerDetails.budget - CowDetails.price,
    };

    await User.findOneAndUpdate({ _id: order.buyer }, buyerBudgetUpdate);

    // Add the cost of the cow to the seller's income
    const sellerData = await User.findById(CowDetails.seller);
    if (sellerData) {
      const sellerIncomeUpdate = {
        income: sellerData?.income + CowDetails.price,
      };
      await User.findOneAndUpdate({ _id: sellerData?.id }, sellerIncomeUpdate);
    }

    const newOrder = await Order.create([order], { session });

    if (!newOrder.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create this order');
    }

    newOrderAllData = newOrder[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newOrderAllData;
};

export const OrderService = {
  createOrder,
};
