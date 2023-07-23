import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ICustomer } from '../customer/customer.interface';
import { IUser } from './user.interface';
import { Customer } from '../customer/customer.model';
import ApiError from '../../../errors/ApiError';
import { User } from './user.model';
import { IBookShopOwner } from '../bookshopOwner/bookShopOwner.interface';
import { BookShopOwner } from '../bookshopOwner/bookShopOwner.model';

//* create customer
const createCustomer = async (
  customer: ICustomer,
  user: IUser
): Promise<IUser | null> => {
  let newUserAllData = null;

  const isCustomerExist = await User.findOne({ email: user?.email });
  // console.log('isCustomerExist', isCustomerExist)

  if (isCustomerExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Duplicate Error : This Email User is already Exist'
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const newCustomer = await Customer.create([customer], { session });

    if (!newCustomer.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create a Customer');
    }

    // set customer _id into user
    user.customer = newCustomer[0]._id;
    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newUserAllData;
};

//* create BookShopOwner
const createBookShopOwner = async (
  bookShopOwner: IBookShopOwner,
  user: IUser
): Promise<IUser | null> => {
  let newUserAllData = null;

  const isBookShopOwner = await User.findOne({ email: user?.email });

  if (isBookShopOwner) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Duplicate Error : This Email User is already Exist'
    );
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const newBookShopOwner = await BookShopOwner.create([bookShopOwner], {
      session,
    });

    if (!newBookShopOwner.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create a BookShopOwner'
      );
    }

    // set customer _id into user
    user.customer = newBookShopOwner[0]._id;
    const newUser = await User.create([user], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }

    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newUserAllData;
};

export const UserService = {
  createCustomer,
  createBookShopOwner,
};
