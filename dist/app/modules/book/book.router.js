"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../../enums/user");
const book_controller_1 = require("./book.controller");
const router = express_1.default.Router();
// create a Book Profile
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.BOOK_SHOP_OWNER), book_controller_1.BookController.createBook);
// get all Book
router.get('/', book_controller_1.BookController.getAllBook);
// get single Book
router.get('/:id', book_controller_1.BookController.getSingleBook);
// update a Book
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.BOOK_SHOP_OWNER), book_controller_1.BookController.updateBook);
// delete a Book
router.delete('/:id', 
// auth(ENUM_USER_ROLE.BOOK_SHOP_OWNER, ENUM_USER_ROLE.ADMIN),
book_controller_1.BookController.deleteBook);
//* add a review
router.post('/review/:id', book_controller_1.BookController.addReview);
//* get all review
router.get('/review/:id', book_controller_1.BookController.getAllReview);
exports.BookRoutes = router;
