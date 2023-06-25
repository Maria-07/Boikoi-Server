import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

//get all Users
router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

// get single User
router.get('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.getSingleUser);

// get User updated
router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.updateUser);

// delete a User
router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), UserController.deleteUser);

// my profile get
// router.get('/', auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
