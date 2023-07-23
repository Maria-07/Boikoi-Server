import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

//* Create-Customer
router.post('/create-customer', UserController.createCustomer);

//* Create-ShopOwner
router.post('/create-bookShopOwner', UserController.createBookShopOwner);

export const UserRoutes = router;
