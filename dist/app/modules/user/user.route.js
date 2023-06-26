"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
// my profile get
router.get('/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), user_controller_1.UserController.getMyProfile);
// Update My Profile
router.patch('/my-profile', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.BUYER, user_1.ENUM_USER_ROLE.SELLER), user_controller_1.UserController.updateMyProfile);
//get all Users
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getAllUsers);
// get single User
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.getSingleUser);
// get User updated
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.updateUser);
// delete a User
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
