import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// my profile get
router.get(
  '/my-profile',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.getMyProfile
);

// Update My Profile
router.patch(
  '/my-profile',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  UserController.updateMyProfile
);

//get all Users
router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

// get single User
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);

// get User updated
router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.updateUser);

// delete a User
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
