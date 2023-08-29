import mongoose, { SortOrder } from 'mongoose';
import { IOldBook, IOldBookFilter } from './oldBook.interface';
import { OldBook } from './oldBook.modal';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  IGenericResponse,
  IPaginationOption,
} from '../../../interfaces/pagination';
import { oldBookSearchableFields } from '../../../constance/searchableFields';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { User } from '../user/user.model';

//! create an old Book
const createOldBook = async (bookData: IOldBook): Promise<IOldBook | null> => {
  let newBookAllData = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newBook = await OldBook.create([bookData], { session });

    if (!newBook.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create an Old Book'
      );
    }

    newBookAllData = newBook[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newBookAllData;
};

//! get all Books
const getAllOldBook = async (
  filters: IOldBookFilter,
  paginationOption: IPaginationOption
): Promise<IGenericResponse<IOldBook[]>> => {
  const { searchTerm, maxPrice, minPrice, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: oldBookSearchableFields.map(field => ({
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

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculationPagination(paginationOption);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await OldBook.find(whereCondition)
    .populate('customer')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await OldBook.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

//! get a single Book
const getSingleOldBook = async (id: string): Promise<IOldBook | null> => {
  const result = await OldBook.findById(id).populate('customer');
  return result;
};

//! updated Old Book
const updateOldBook = async (
  id: string,
  payload: Partial<IOldBook>,
  token: string
): Promise<IOldBook | null> => {
  // console.log(id, payload);
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

  // console.log('verifiedToken =======', verifiedToken);

  const { userEmail, role } = verifiedToken;

  const BookDetails = await OldBook.findById(id);
  //   // console.log('BookDetails 🐮', BookDetails);

  if (!BookDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This Book is invalid');
  }

  const booOwnerDetails = await User.findById(BookDetails?.customer);
  //   // console.log('👉👉👉👉👉👉bookBookOwnerDetails', bookBookOwnerDetails);

  if (booOwnerDetails?.email !== userEmail || booOwnerDetails?.role !== role) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'This is not a valid bookBookOwner id for this Book'
    );
  }

  const result = await OldBook.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('customer');
  return result;
};

//! Delete Old Book
const deleteOldBook = async (
  id: string,
  token: string
): Promise<IOldBook | null> => {
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

  // console.log('verifiedToken =======', verifiedToken);

  const { userEmail, role } = verifiedToken;

  const BookDetails = await OldBook.findById(id);
  //   // console.log('BookDetails 🐮', BookDetails);

  if (!BookDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This Book is invalid');
  }

  const booOwnerDetails = await User.findById(BookDetails?.customer);
  //   // console.log('👉👉👉👉👉👉bookBookOwnerDetails', bookBookOwnerDetails);

  if (booOwnerDetails?.email !== userEmail || booOwnerDetails?.role !== role) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'This is not a valid bookBookOwner id for this Book'
    );
  }
  const result = await OldBook.findByIdAndDelete({ _id: id }, { new: true });

  return result;
};

export const OldBookService = {
  createOldBook,
  getAllOldBook,
  getSingleOldBook,
  updateOldBook,
  deleteOldBook,
};
