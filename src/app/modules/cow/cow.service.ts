import mongoose, { SortOrder } from 'mongoose';
// import { User } from '../user/user.model';
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
import { User } from '../user/user.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

// create a cow
const createCow = async (cow: ICow): Promise<ICow | null> => {
  const sellerDetails = await User.findById(cow.seller);
  console.log(sellerDetails);

  if (sellerDetails) {
    if (sellerDetails.role !== 'seller') {
      throw new ApiError(httpStatus.NOT_FOUND, 'This is not a valid seller id');
    }
  }

  if (cow.label) {
    cow.label = 'for sale';
  }

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
  const { searchTerm, maxPrice, minPrice, ...filtersData } = filters;

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
  if (searchTerm) {
    if (!isNaN(parseFloat(searchTerm))) {
      // [field] = parseFloat(searchTerm);
      // console.log(field);

      console.log(searchTerm);
    }
  }

  console.log(minPrice, maxPrice);

  if (minPrice !== undefined) {
    andCondition.push({
      price: {
        $gte: minPrice,
      },
    });
  }
  if (maxPrice !== undefined) {
    andCondition.push({
      price: {
        $lte: maxPrice,
      },
    });
  }

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

  const result = await Cow.find(whereCondition)
    .populate('seller')
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
  const result = await Cow.findById(id).populate('seller');
  return result;
};

// updated Cow
const updateCow = async (
  id: string,
  payload: Partial<ICow>,
  token: string
): Promise<ICow | null> => {
  console.log(id, payload);
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

  console.log('verifiedToken =======', verifiedToken);

  const { phone, role } = verifiedToken;
  console.log('PHONE 📞', phone);

  const cowDetails = await Cow.findById(id);
  console.log('cowDetails 🐮', cowDetails);

  if (!cowDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This cow is invalid');
  }

  const sellerDetails = await User.findById(cowDetails?.seller);
  console.log('👉👉👉👉👉👉sellerDetails', sellerDetails);

  if (sellerDetails?.phoneNumber !== phone || sellerDetails?.role !== role) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'This is not a valid seller id for this cow'
    );
  }

  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('seller');

  console.log(result, 'updated result');

  return result;
};

// Delete Cow
const deleteCow = async (id: string, token: string): Promise<ICow | null> => {
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

  console.log('verifiedToken =======', verifiedToken);

  const { phone, role } = verifiedToken;
  console.log('PHONE 📞', phone);

  const cowDetails = await Cow.findById(id);
  console.log('cowDetails 🐮', cowDetails);

  if (!cowDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This cow is invalid');
  }

  const sellerDetails = await User.findById(cowDetails?.seller);
  console.log('👉👉👉👉👉👉sellerDetails', sellerDetails);

  if (sellerDetails?.phoneNumber !== phone || sellerDetails?.role !== role) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'This is not a valid seller id for this cow'
    );
  }
  const result = await Cow.findByIdAndDelete({ _id: id }, { new: true });

  console.log('Deleted Result 🗑️🗑️', result);
  return result;
};

export const CowService = {
  createCow,
  getAllCow,
  getSingleCow,
  deleteCow,
  updateCow,
};
