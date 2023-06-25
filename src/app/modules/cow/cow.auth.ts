import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Cow } from './cow.model';
import { User } from '../user/user.model';

const cowAuth = async (token: string, id: string) => {
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

  const sellerDetails = await User.findById(cowDetails?.seller);
  console.log('👉👉👉👉👉👉sellerDetails', sellerDetails);

  if (sellerDetails?.phoneNumber !== phone && sellerDetails?.role !== role) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'This is not a valid seller id for this cow'
    );
  }
};

export default cowAuth;
