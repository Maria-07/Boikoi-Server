import mongoose from 'mongoose';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const createAdmin = async (admin: IAdmin): Promise<IAdmin | null> => {
  let newAdminAllData = null;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const newAdmin = await Admin.create([admin], { session });

    if (!newAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    newAdminAllData = newAdmin[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  return newAdminAllData;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  // console.log(payload);

  const isUserExist = await Admin.isUserExist(phoneNumber);
  // console.log('isisUserExist', isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // match password
  if (
    isUserExist.password &&
    !(await Admin.isPasswordMatch(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'password is incorrect');
  }

  // create accessToken and refreshToken
  const { phoneNumber: phone, role } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    {
      phone,
      role,
    },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      phone,
      role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expire_in as string
  );

  // console.log({ accessToken, refreshToken, needsPasswordChange });

  return { accessToken, refreshToken };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  console.log(token, 'token 🚩🗃️👉🔰');

  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { phone } = verifiedToken;

  // console.log('verifiedToken', verifiedToken);

  const isUserExist = await Admin.isUserExist(phone);
  // console.log('isUserExist', isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    { phoneNumber: isUserExist.phoneNumber, role: isUserExist.role },
    config.jwt.secret as Secret,
    config.jwt.expire_in as string
  );

  return { accessToken: newAccessToken };
};

export const AdminService = {
  createAdmin,
  loginUser,
  refreshToken,
};
