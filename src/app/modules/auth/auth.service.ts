// import { User } from '../user/user.model';
// import { ILoginUser, ILoginUserResponse } from './auth.interface';

// const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
//   const { phoneNumber, password } = payload;

//   const isUserExist = await User.isUserExist(id);
//   if (!isUserExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
//   }

//   // console.log('isisUserExist', isUserExist);

//   // match password
//   if (
//     isUserExist.password &&
//     !(await User.isPasswordMatch(password, isUserExist.password))
//   ) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'password is incorrect');
//   }

//   // create accessToken and refreshToken
//   const { id: userId, role, needsPasswordChange } = isUserExist;

//   const accessToken = jwtHelpers.createToken(
//     {
//       userId,
//       role,
//     },
//     config.jwt.secret as Secret,
//     config.jwt.expire_in as string
//   );

//   const refreshToken = jwtHelpers.createToken(
//     {
//       userId,
//       role,
//     },
//     config.jwt.refresh_secret as Secret,
//     config.jwt.refresh_expire_in as string
//   );

//   // console.log({ accessToken, refreshToken, needsPasswordChange });

//   return { accessToken, refreshToken, needsPasswordChange };
// };

// export const AuthService = {
//   loginUser,
// };
