"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldBookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const oldBook_controller_1 = require("./oldBook.controller");
const router = express_1.default.Router();
//! create an old Book Profile
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CUSTOMER), oldBook_controller_1.OldBookController.createOldBook);
//! get all Book
router.get('/', oldBook_controller_1.OldBookController.getAllOldBook);
//! get single Book
router.get('/:id', oldBook_controller_1.OldBookController.getSingleOldBook);
//! update an old Book
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CUSTOMER), oldBook_controller_1.OldBookController.updateOldBook);
//! delete a Book
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.CUSTOMER), oldBook_controller_1.OldBookController.deleteOldBook);
exports.OldBookRoutes = router;
