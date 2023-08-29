import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  IGenericResponse,
  IPaginationOption,
} from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { IBook, IBookFilter } from './book.interface';
import { Book } from './book.model';
import { bookSearchableFields } from '../../../constance/searchableFields';

// create a Book
const createBook = async (bookData: IBook): Promise<IBook | null> => {
  //   const bookBookOwnerDetails = await User.findById(BookData.BookBookOwner);
  //   console.log(bookBookOwnerDetails);

  //   if (bookBookOwnerDetails) {
  //     if (bookBookOwnerDetails.role !== 'bookBookOwner') {
  //       throw new ApiError(
  //         httpStatus.NOT_FOUND,
  //         'This is not a valid bookBookOwner id'
  //       );
  //     }
  //   }

  let newBookAllData = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newBook = await Book.create([bookData], { session });

    if (!newBook.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create Book Profile'
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

// get all Books
const getAllBook = async (
  filters: IBookFilter,
  paginationOption: IPaginationOption
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, maxPrice, minPrice, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: bookSearchableFields.map(field => ({
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

  const result = await Book.find(whereCondition)
    .populate('shop')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get a single Book
const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id).populate('shop');
  return result;
};

// updated Book
const updateBook = async (
  id: string,
  payload: Partial<IBook>,
  token: string
): Promise<IBook | null> => {
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

  console.log('verifiedToken =======', verifiedToken);

  //   const { phone, role } = verifiedToken;
  //   // console.log('PHONE 📞', phone);

  //   const BookDetails = await Book.findById(id);
  //   // console.log('BookDetails 🐮', BookDetails);

  //   if (!BookDetails) {
  //     throw new ApiError(httpStatus.NOT_FOUND, 'This Book is invalid');
  //   }

  //   const bookBookOwnerDetails = await User.findById(BookDetails?.bookBookOwner);
  //   // console.log('👉👉👉👉👉👉bookBookOwnerDetails', bookBookOwnerDetails);

  //   if (
  //     bookBookOwnerDetails?.phoneNumber !== phone ||
  //     bookBookOwnerDetails?.role !== role
  //   ) {
  //     throw new ApiError(
  //       httpStatus.NOT_FOUND,
  //       'This is not a valid bookBookOwner id for this Book'
  //     );
  //   }

  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('shop');

  // console.log(result, 'updated result');

  return result;
};

// Delete Book
const deleteBook = async (id: string, token: string): Promise<IBook | null> => {
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

  console.log('verifiedToken =======', verifiedToken);

  //   const { phone, role } = verifiedToken;
  //   // console.log('PHONE 📞', phone);

  //   const BookDetails = await Book.findById(id);
  //   // console.log('BookDetails 🐮', BookDetails);

  //   if (!BookDetails) {
  //     throw new ApiError(httpStatus.NOT_FOUND, 'This Book is invalid');
  //   }

  //   const bookBookOwnerDetails = await User.findById(BookDetails?.bookBookOwner);
  //   // console.log('👉👉👉👉👉👉bookBookOwnerDetails', bookBookOwnerDetails);

  //   if (
  //     bookBookOwnerDetails?.phoneNumber !== phone ||
  //     bookBookOwnerDetails?.role !== role
  //   ) {
  //     throw new ApiError(
  //       httpStatus.NOT_FOUND,
  //       'This is not a valid bookBookOwner id for this Book'
  //     );
  //   }
  const result = await Book.findByIdAndDelete({ _id: id }, { new: true });

  // console.log('Deleted Result 🗑️🗑️', result);
  return result;
};

export const BookService = {
  createBook,
  getAllBook,
  getSingleBook,
  deleteBook,
  updateBook,
};
