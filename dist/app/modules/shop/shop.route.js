"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const shop_controller_1 = require("./shop.controller");
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// get my Shop
router.get('/my-shop', (0, auth_1.default)(user_1.ENUM_USER_ROLE.BOOK_SHOP_OWNER), shop_controller_1.ShopController.getMyShop);
//* get all Shop's by address
router.get('/shop-address', shop_controller_1.ShopController.getShopAddress);
//* create a Shop Profile
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.BOOK_SHOP_OWNER), shop_controller_1.ShopController.createShop);
// get all Shop
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CUSTOMER, user_1.ENUM_USER_ROLE.BOOK_SHOP_OWNER), shop_controller_1.ShopController.getAllShop);
// get single Shop
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.CUSTOMER, user_1.ENUM_USER_ROLE.BOOK_SHOP_OWNER), shop_controller_1.ShopController.getSingleShop);
// update a Shop
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BOOK_SHOP_OWNER), shop_controller_1.ShopController.updateShop);
// delete a Shop
router.delete('/:id', 
// auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER, ENUM_USER_ROLE.ADMIN),
shop_controller_1.ShopController.deleteShop);
exports.ShopRoutes = router;
