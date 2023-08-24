import express from 'express';
import { ShopController } from './shop.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

// get my Shop
router.get(
  '/my-shop',
  auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER),
  ShopController.getMyShop
);

//* get all Shop's by address
router.get('/shop-address', ShopController.getShopAddress);

//* create a Shop Profile
router.post(
  '/',
  auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER),
  ShopController.createShop
);

// get all Shop
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
    ENUM_USER_ROLE.BOOK_SHOP_OWNER
  ),
  ShopController.getAllShop
);

// get single Shop
router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
    ENUM_USER_ROLE.BOOK_SHOP_OWNER
  ),
  ShopController.getSingleShop
);

// update a Shop
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.BOOK_SHOP_OWNER),
  ShopController.updateShop
);

// delete a Shop
router.delete(
  '/:id',
  // auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER, ENUM_USER_ROLE.ADMIN),
  ShopController.deleteShop
);

export const ShopRoutes = router;
