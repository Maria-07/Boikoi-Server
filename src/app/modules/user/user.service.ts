import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IUser } from './user.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from './user.model';

// Get Profile Data
const getMyProfile = async (token: string): Promise<IUser | null> => {
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

  const { userEmail } = verifiedToken;

  const result = await User.findOne({ email: userEmail });

  return result;
};

export const UserService = {
  getMyProfile,
  //   updateMyProfile,
};
