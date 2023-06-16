import mongoose, { SortOrder } from 'mongoose';
import { IUser, IUserFilters } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  IGenericResponse,
  IPaginationOption,
} from '../../../interfaces/pagination';
import { userSearchableFields } from '../../../constance/searchableFields';
import { paginationHelpers } from '../../../helpers/paginationHelpers';

// create a user through sign in
const createUser = async (user: IUser): Promise<IUser | null> => {
  let newUserAllData = null;

  console.log(user.role);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (user.role === 'seller') {
      if (!user.budget) {
        user.budget = 0;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Seller can not have any budget'
        );
      }

      if (!user.income) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Seller Must need to have income'
        );
      }
    } else {
      if (!user.income) {
        user.income = 0;
      } else {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Buyer can not have any income'
        );
      }

      if (!user.budget) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Buyer Must need to have Budget'
        );
      }
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

// get all users
const getAllUsers = async (
  filters: IUserFilters,
  paginationOption: IPaginationOption
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculationPagination(paginationOption);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await User.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
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
  getAllUsers,
  updatedUser,
  getSingleUser,
  deleteUser,
};
