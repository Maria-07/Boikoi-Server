import mongoose, { SortOrder } from 'mongoose';
import { User } from '../user/user.model';
import { ICow, ICowFilter } from './cow.interface';
import { Cow } from './cow.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  IGenericResponse,
  IPaginationOption,
} from '../../../interfaces/pagination';
import { cowSearchableFields } from '../../../constance/searchableFields';
import { paginationHelpers } from '../../../helpers/paginationHelpers';

// create a cow
const createCow = async (cow: ICow): Promise<ICow | null> => {
  const sellerDetails = await User.findById(cow.seller);
  console.log(sellerDetails);

  let newCowAllData = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newCow = await Cow.create([cow], { session });

    if (!newCow.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create Cow Profile'
      );
    }

    newCowAllData = newCow[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newCowAllData;
};

// get all Cows
const getAllCow = async (
  filters: ICowFilter,
  paginationOption: IPaginationOption
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  console.log(minPrice, maxPrice);

  if (minPrice !== undefined && maxPrice !== undefined) {
    andCondition.push({
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
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

  console.log(whereCondition);

  const result = await Cow.find(whereCondition)
    // .populate('User')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get a single cow
const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id);
  return result;
};

// Delete Cow
const deleteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete({ _id: id }, { new: true });
  return result;
};

export const CowService = {
  createCow,
  getAllCow,
  getSingleCow,
  deleteCow,
};
