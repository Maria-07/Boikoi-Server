import mongoose from 'mongoose';
import { IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { Admin } from '../admin/admin.model';
import { IAdmin } from '../admin/admin.interface';

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
        user.income = 0;
      }
    } else {
      if (!user.income || user.income) {
        user.income = 0;
      }
    }

    if (user.role === 'buyer') {
      if (user.budget === 0) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Buyer must need some amount of Budget'
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

// Get Profile Data
const getMyProfile = async (token: string): Promise<IUser | IAdmin | null> => {
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

  // if (role !== 'admin') {
  //   const result = await User.findOne({ phoneNumber: phone });
  //   return result;
  // } else {
  //   const result = await Admin.findOne({ phoneNumber: phone });
  //
  // }

  const result =
    role !== 'admin'
      ? await User.findOne({ phoneNumber: phone })
      : await Admin.findOne({ phoneNumber: phone });

  return result;
};

// update profile Data
const updateMyProfile = async (
  payload: Partial<IUser | IAdmin>,
  token: string
): Promise<IUser | IAdmin | null> => {
  console.log(payload);
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

  const userDetails =
    role !== 'admin'
      ? await User.findOne({ phoneNumber: phone })
      : await Admin.findOne({ phoneNumber: phone });

  console.log('userDetails', userDetails);

  if (!userDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This cow is invalid');
  }

  if (userDetails?.phoneNumber !== phone || userDetails?.role !== role) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'You are UnAuthorized to update this profile'
    );
  }

  const result =
    role !== 'admin'
      ? await User.findOneAndUpdate({ phoneNumber: phone }, payload, {
          new: true,
        })
      : await Admin.findOneAndUpdate({ phoneNumber: phone }, payload, {
          new: true,
        });

  console.log(result, 'updated result');

  return result;
};

export const UserService = {
  createUser,
  updatedUser,
  getSingleUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
