import express from 'express';
import { CowController } from './cow.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// create a Cow Profile
router.post('/', auth(ENUM_USER_ROLE.SELLER), CowController.createCow);

//get all Cow
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  CowController.getAllCow
);

// get single Cow
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER),
  CowController.getSingleCow
);

// update a Cow
router.patch('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.updateCow);

// delete a Cow
router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow);

export const CowRoutes = router;
