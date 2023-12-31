import express from 'express';
// import auth from '../../middlewares/auth';
// import { ENUM_USER_ROLE } from '../../../enums/user';
import { ShopController } from './shop.controller';

const router = express.Router();

// create a Shop Profile
router.post(
  '/',
  // auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER),
  ShopController.createShop
);

// get all Shop
router.get(
  '/',
  // auth(
  //   ENUM_USER_ROLE.ADMIN,
  //   ENUM_USER_ROLE.CUSTOMER,
  //   ENUM_USER_ROLE.BOOK_SHOP_OWNER
  // ),
  ShopController.getAllShop
);

// get single Shop
router.get(
  '/:id',
  // auth(
  //   ENUM_USER_ROLE.ADMIN,
  //   ENUM_USER_ROLE.CUSTOMER,
  //   ENUM_USER_ROLE.BOOK_SHOP_OWNER
  // ),
  ShopController.getSingleShop
);

// update a Shop
router.patch(
  '/:id',
  // auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER),
  ShopController.updateShop
);

// delete a Shop
router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER, ENUM_USER_ROLE.ADMIN),
  ShopController.deleteShop
);

export const ShopRoutes = router;
