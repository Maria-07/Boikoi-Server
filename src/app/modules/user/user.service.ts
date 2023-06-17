import mongoose from 'mongoose';
import { IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

// create a user through sign in
const createUser = async (user: IUser): Promise<IUser | null> => {
  let newUserAllData = null;

  console.log(user.role);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (user.role === 'seller') {
      if (!user.budget || user.budget) {
        user.budget = 0;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Seller can not have any budget'
        );
      }

      // if (!user.income) {
      //   throw new ApiError(
      //     httpStatus.BAD_REQUEST,
      //     'Seller Must need to have income'
      //   );
      // }
    } else {
      if (!user.income || user.income) {
        user.income = 0;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Buyer can not have any income'
        );
      }

      // if (!user.budget) {
      //   throw new ApiError(
      //     httpStatus.BAD_REQUEST,
      //     'Buyer Must need to have Budget'
      //   );
      // }
    }

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

// get a single user
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

// updated User
const updatedUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found !');
  }

  const { name, ...UserData } = payload;

  const updatedUserData: Partial<IUser> = { ...UserData };

  //dynamic handling
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      (updatedUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findByIdAndUpdate({ _id: id }, updatedUserData, {
    new: true,
  });

  return result;
};

// Delete User
const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete({ _id: id }, { new: true });
  return result;
};

export const UserService = {
  createUser,
  updatedUser,
  getSingleUser,
  deleteUser,
};
