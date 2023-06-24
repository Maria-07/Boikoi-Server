// import config from '../../../config';
// import catchAsync from '../../../shared/catchAsync';
// import { Request, Response } from 'express';
// import { ILoginUserResponse } from './auth.interface';
// import sendResponse from '../../../shared/sendResponse';
// import httpStatus from 'http-status';
// import { AuthService } from './auth.service';

// const loginUser = catchAsync(async (req: Request, res: Response) => {
//   const { ...loginData } = req.body;

//   const result = await AuthService.loginUser(loginData);
//   const { refreshToken, ...others } = result;

//   // set refresh token  in Cookie
//   const cookieOption = {
//     secure: config.env === 'production',
//     httpOnly: true,
//   };

//   res.cookie('refreshToken', refreshToken, cookieOption);

//   sendResponse<ILoginUserResponse>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'user logged in successfully',
//     data: others,
//   });
// });

// export const AuthController = {
//   loginUser,
//   //   refreshToken,
// };
