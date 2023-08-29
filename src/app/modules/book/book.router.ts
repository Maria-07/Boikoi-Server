import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { BookController } from './book.controller';

const router = express.Router();

// create a Book Profile
router.post(
  '/',
  auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER),
  BookController.createBook
);

// get all Book
router.get('/', BookController.getAllBook);

// get single Book
router.get('/:id', BookController.getSingleBook);

// update a Book
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER),
  BookController.updateBook
);

// delete a Book
router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER, ENUM_USER_ROLE.ADMIN),
  BookController.deleteBook
);

//* add a review
router.post('/review/:id', BookController.addReview);

//* get all review
router.get('/review/:id', BookController.getAllReview);

export const BookRoutes = router;
