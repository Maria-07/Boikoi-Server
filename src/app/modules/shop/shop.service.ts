import mongoose, { SortOrder } from 'mongoose';
import { IShop, IShopFilter } from './shop.interface';
import { User } from '../user/user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Shop } from './shop.model';
import {
  IGenericResponse,
  IPaginationOption,
} from '../../../interfaces/pagination';
import { shopSearchableFields } from '../../../constance/searchableFields';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

// create a Shop
const createShop = async (shopData: IShop): Promise<IShop | null> => {
  const bookShopOwnerDetails = await User.findById(shopData.bookShopOwner);
  console.log(bookShopOwnerDetails);

  if (bookShopOwnerDetails) {
    if (bookShopOwnerDetails.role !== 'bookShopOwner') {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'This is not a valid bookShopOwner id'
      );
    }
  }

  const isExist = await Shop.findOne({ bookShopOwner: shopData.bookShopOwner });
  console.log('isExist', isExist);

  // if (isExist) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Shop already Existed !!');
  // }
  let newShopAllData = null;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newShop = await Shop.create([shopData], { session });

    if (!newShop.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create Shop Profile'
      );
    }

    newShopAllData = newShop[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newShopAllData;
};

// get all Shops
const getAllShop = async (
  filters: IShopFilter,
  paginationOption: IPaginationOption
): Promise<IGenericResponse<IShop[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: shopSearchableFields.map(field => ({
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

  const result = await Shop.find(whereCondition)
    .populate('bookShopOwner')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Shop.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get a single Shop
const getSingleShop = async (id: string): Promise<IShop | null> => {
  const result = await Shop.findById(id).populate('bookShopOwner');
  return result;
};

// updated Shop
const updateShop = async (
  id: string,
  payload: Partial<IShop>,
  token: string
): Promise<IShop | null> => {
  console.log(id, payload);
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

  //   const ShopDetails = await Shop.findById(id);
  //   // console.log('ShopDetails 🐮', ShopDetails);

  //   if (!ShopDetails) {
  //     throw new ApiError(httpStatus.NOT_FOUND, 'This Shop is invalid');
  //   }

  //   const bookShopOwnerDetails = await User.findById(ShopDetails?.bookShopOwner);
  //   // console.log('👉👉👉👉👉👉bookShopOwnerDetails', bookShopOwnerDetails);

  //   if (
  //     bookShopOwnerDetails?.phoneNumber !== phone ||
  //     bookShopOwnerDetails?.role !== role
  //   ) {
  //     throw new ApiError(
  //       httpStatus.NOT_FOUND,
  //       'This is not a valid bookShopOwner id for this Shop'
  //     );
  //   }

  const result = await Shop.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('bookShopOwner');

  console.log(result, 'updated result');

  return result;
};

// Delete Shop
const deleteShop = async (id: string, token: string): Promise<IShop | null> => {
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

  //   const ShopDetails = await Shop.findById(id);
  //   // console.log('ShopDetails 🐮', ShopDetails);

  //   if (!ShopDetails) {
  //     throw new ApiError(httpStatus.NOT_FOUND, 'This Shop is invalid');
  //   }

  //   const bookShopOwnerDetails = await User.findById(ShopDetails?.bookShopOwner);
  //   // console.log('👉👉👉👉👉👉bookShopOwnerDetails', bookShopOwnerDetails);

  //   if (
  //     bookShopOwnerDetails?.phoneNumber !== phone ||
  //     bookShopOwnerDetails?.role !== role
  //   ) {
  //     throw new ApiError(
  //       httpStatus.NOT_FOUND,
  //       'This is not a valid bookShopOwner id for this Shop'
  //     );
  //   }
  const result = await Shop.findByIdAndDelete({ _id: id }, { new: true });

  // console.log('Deleted Result 🗑️🗑️', result);
  return result;
};

export const ShopService = {
  createShop,
  getAllShop,
  getSingleShop,
  deleteShop,
  updateShop,
};
