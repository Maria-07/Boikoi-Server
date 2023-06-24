// import express from 'express';
// import { UserController } from '../user/user.controller';
// import validateRequest from '../../middlewares/validateRequest';
// import { UserValidation } from '../user/user.validation';
// import { AuthController } from './auth.controller';
// import { AuthValidation } from './auth.validation';

// const router = express.Router();

// router.post(
//   '/sign-up',
//   validateRequest(UserValidation.createUserZodSchema),
//   UserController.createUser
// );

// router.post(
//   '/login',
//   validateRequest(AuthValidation.loginZodSchema),
//   AuthController.loginUser
// );

// // router.post(
// //   '/refresh-token',
// //   validateRequest(AuthValidation.refreshTokenZodSchema),
// //   AuthController.refreshToken
// // );

// export const AuthRoutes = router;
