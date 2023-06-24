import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  console.log(payload);

  const isUserExist = await User.isUserExist(phoneNumber);
  console.log('isisUserExist', isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // match password
  if (
    isUserExist.password &&
    !(await User.isPasswordMatch(password, isUserExist.password))
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

export const AuthService = {
  loginUser,
};
