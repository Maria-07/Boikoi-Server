"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldBookController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const oldBook_service_1 = require("./oldBook.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const filterableFields_1 = require("../../../constance/filterableFields");
const pick_1 = __importDefault(require("../../../shared/pick"));
const paginationC_1 = require("../../../constance/paginationC");
//! create an old Book profile
const createOldBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    console.log('verifiedToken =======', verifiedToken);
    const { userEmail } = verifiedToken;
    const bookData = __rest(req.body, []);
    const result = yield oldBook_service_1.OldBookService.createOldBook(Object.assign(Object.assign({}, bookData), { userEmail }));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Book created successfully',
        data: result,
    });
}));
//! get all Book [search and filter]
const getAllOldBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, filterableFields_1.oldBookFilterableFields);
    // console.log('filters ==== ', filters);
    const paginationOption = (0, pick_1.default)(req.query, paginationC_1.paginationFields);
    const result = yield oldBook_service_1.OldBookService.getAllOldBook(filters, paginationOption);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Books retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
}));
//! get a single Old Book
const getSingleOldBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield oldBook_service_1.OldBookService.getSingleOldBook(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single book retrieved successfully',
        data: result,
    });
}));
//! Update Old Book
const updateOldBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    const token = req.headers.authorization;
    const result = yield oldBook_service_1.OldBookService.updateOldBook(id, updatedData, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book Updated successfully',
        data: result,
    });
}));
//! Delete Old Book
const deleteOldBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.headers.authorization;
    // BookAuth(token as string, id);
    const result = yield oldBook_service_1.OldBookService.deleteOldBook(id, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book Deleted successfully',
        data: result,
    });
}));
exports.OldBookController = {
    createOldBook,
    getAllOldBook,
    getSingleOldBook,
    updateOldBook,
    deleteOldBook,
};
