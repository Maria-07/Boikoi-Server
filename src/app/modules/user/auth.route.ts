import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/sign-up',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);

export const AuthRoutes = router;
