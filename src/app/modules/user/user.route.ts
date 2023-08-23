import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// my profile get
router.get(
  '/my-profile',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.BOOK_SHOP_OWNER,
    ENUM_USER_ROLE.CUSTOMER
  ),
  UserController.getMyProfile
);

export const UserRoutes = router;
