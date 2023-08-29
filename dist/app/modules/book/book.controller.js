'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.BookController = void 0;
const catchAsync_1 = __importDefault(require('../../../shared/catchAsync'));
const sendResponse_1 = __importDefault(require('../../../shared/sendResponse'));
const http_status_1 = __importDefault(require('http-status'));
const pick_1 = __importDefault(require('../../../shared/pick'));
const paginationC_1 = require('../../../constance/paginationC');
const config_1 = __importDefault(require('../../../config'));
const jwtHelpers_1 = require('../../../helpers/jwtHelpers');
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const filterableFields_1 = require('../../../constance/filterableFields');
const book_service_1 = require('./book.service');
const book_model_1 = require('./book.model');
// create a Book profile
const createBook = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    let verifiedToken = null;
    try {
      verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(
        token,
        config_1.default.jwt.secret
      );
    } catch (err) {
      throw new ApiError_1.default(
        http_status_1.default.FORBIDDEN,
        'Invalid Refresh Token'
      );
    }
    console.log('verifiedToken =======', verifiedToken);
    const { userEmail } = verifiedToken;
    const bookData = __rest(req.body, []);
    const result = yield book_service_1.BookService.createBook(
      Object.assign(Object.assign({}, bookData), { userEmail })
    );
    (0, sendResponse_1.default)(res, {
      success: true,
      statusCode: http_status_1.default.OK,
      message: 'Book created successfully',
      data: result,
    });
  })
);
// get all Book [search and filter]
const getAllBook = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(
      req.query,
      filterableFields_1.bookFilterableFields
    );
    // console.log('filters ==== ', filters);
    const paginationOption = (0, pick_1.default)(
      req.query,
      paginationC_1.paginationFields
    );
    const result = yield book_service_1.BookService.getAllBook(
      filters,
      paginationOption
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Books retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  })
);
// get a single Book
const getSingleBook = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield book_service_1.BookService.getSingleBook(id);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Book retrieved successfully',
      data: result,
    });
  })
);
// Update Book
const updateBook = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    const token = req.headers.authorization;
    const result = yield book_service_1.BookService.updateBook(
      id,
      updatedData,
      token
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Book Updated successfully',
      data: result,
    });
  })
);
// Delete Book
const deleteBook = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.headers.authorization;
    // BookAuth(token as string, id);
    const result = yield book_service_1.BookService.deleteBook(id, token);
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Book Deleted successfully',
      data: result,
    });
  })
);
//* Add reviews
const addReview = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const addReview = req.body.reviews;
    // console.log('new review : ', addReview);
    const result = yield book_model_1.Book.updateOne(
      { _id: id },
      { $push: { reviews: addReview } }
    );
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'Add Review successfully',
      data: result,
    });
  })
);
//* get reviews
const getAllReview = (0, catchAsync_1.default)((req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    const result = yield book_model_1.Book.findOne({ _id: id }).select({
      reviews: 1,
      _id: 0,
    });
    (0, sendResponse_1.default)(res, {
      statusCode: http_status_1.default.OK,
      success: true,
      message: 'get all Review successfully',
      data: result,
    });
  })
);
exports.BookController = {
  createBook,
  getAllBook,
  getSingleBook,
  deleteBook,
  updateBook,
  addReview,
  getAllReview,
};
