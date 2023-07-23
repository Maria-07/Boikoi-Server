import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

//* Create-Customer
router.post('/create-customer', UserController.createCustomer);

//* Create-ShopOwner
router.post('/create-bookShopOwner', UserController.createBookShopOwner);

//* Create-Admin
router.post('/create-admin', UserController.createAdmin);

export const UserRoutes = router;
