'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require('express'));
const user_controller_1 = require('./user.controller');
const auth_1 = __importDefault(require('../../middlewares/auth'));
const user_1 = require('../../../enums/user');
const router = express_1.default.Router();
// my profile get
router.get(
  '/my-profile',
  (0, auth_1.default)(
    user_1.ENUM_USER_ROLE.ADMIN,
    user_1.ENUM_USER_ROLE.BOOK_SHOP_OWNER,
    user_1.ENUM_USER_ROLE.CUSTOMER
  ),
  user_controller_1.UserController.getMyProfile
);
exports.UserRoutes = router;
