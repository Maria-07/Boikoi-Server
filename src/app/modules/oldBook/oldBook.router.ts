import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { OldBookController } from './oldBook.controller';

const router = express.Router();

//! create an old Book Profile
router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER),
  OldBookController.createOldBook
);

//! get all Book
router.get('/', OldBookController.getAllOldBook);

//! get single Book
router.get('/:id', OldBookController.getSingleOldBook);

//! update an old Book
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.CUSTOMER),
  OldBookController.updateOldBook
);

//! delete a Book
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.CUSTOMER),
  OldBookController.deleteOldBook
);

export const OldBookRoutes = router;
