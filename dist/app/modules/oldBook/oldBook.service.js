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
exports.OldBookService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const oldBook_modal_1 = require("./oldBook.modal");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const searchableFields_1 = require("../../../constance/searchableFields");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const user_model_1 = require("../user/user.model");
//! create an old Book
const createOldBook = (bookData) => __awaiter(void 0, void 0, void 0, function* () {
    let newBookAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newBook = yield oldBook_modal_1.OldBook.create([bookData], { session });
        if (!newBook.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create an Old Book');
        }
        newBookAllData = newBook[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return newBookAllData;
});
//! get all Books
const getAllOldBook = (filters, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, maxPrice, minPrice } = filters, filtersData = __rest(filters, ["searchTerm", "maxPrice", "minPrice"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            $or: searchableFields_1.oldBookSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andCondition.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    if (minPrice !== undefined) {
        andCondition.push({
            price: {
                $gte: minPrice,
            },
        });
    }
    if (maxPrice !== undefined) {
        andCondition.push({
            price: {
                $lte: maxPrice,
            },
        });
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
        andCondition.push({
            price: {
                $gte: minPrice,
                $lte: maxPrice,
            },
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculationPagination(paginationOption);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
    const result = yield oldBook_modal_1.OldBook.find(whereCondition)
        .populate('customer')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield oldBook_modal_1.OldBook.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
//! get a single Book
const getSingleOldBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield oldBook_modal_1.OldBook.findById(id).populate('customer');
    return result;
});
//! updated Old Book
const updateOldBook = (id, payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(id, payload);
    // console.log('Token => 🔖🔖', token);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    // console.log('verifiedToken =======', verifiedToken);
    const { userEmail, role } = verifiedToken;
    const BookDetails = yield oldBook_modal_1.OldBook.findById(id);
    //   // console.log('BookDetails 🐮', BookDetails);
    if (!BookDetails) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This Book is invalid');
    }
    const booOwnerDetails = yield user_model_1.User.findById(BookDetails === null || BookDetails === void 0 ? void 0 : BookDetails.customer);
    //   // console.log('👉👉👉👉👉👉bookBookOwnerDetails', bookBookOwnerDetails);
    if ((booOwnerDetails === null || booOwnerDetails === void 0 ? void 0 : booOwnerDetails.email) !== userEmail || (booOwnerDetails === null || booOwnerDetails === void 0 ? void 0 : booOwnerDetails.role) !== role) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This is not a valid bookBookOwner id for this Book');
    }
    const result = yield oldBook_modal_1.OldBook.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    }).populate('customer');
    return result;
});
//! Delete Old Book
const deleteOldBook = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Token => 🔖🔖', token);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    // console.log('verifiedToken =======', verifiedToken);
    const { userEmail, role } = verifiedToken;
    const BookDetails = yield oldBook_modal_1.OldBook.findById(id);
    //   // console.log('BookDetails 🐮', BookDetails);
    if (!BookDetails) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This Book is invalid');
    }
    const booOwnerDetails = yield user_model_1.User.findById(BookDetails === null || BookDetails === void 0 ? void 0 : BookDetails.customer);
    //   // console.log('👉👉👉👉👉👉bookBookOwnerDetails', bookBookOwnerDetails);
    if ((booOwnerDetails === null || booOwnerDetails === void 0 ? void 0 : booOwnerDetails.email) !== userEmail || (booOwnerDetails === null || booOwnerDetails === void 0 ? void 0 : booOwnerDetails.role) !== role) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This is not a valid bookBookOwner id for this Book');
    }
    const result = yield oldBook_modal_1.OldBook.findByIdAndDelete({ _id: id }, { new: true });
    return result;
});
exports.OldBookService = {
    createOldBook,
    getAllOldBook,
    getSingleOldBook,
    updateOldBook,
    deleteOldBook,
};
