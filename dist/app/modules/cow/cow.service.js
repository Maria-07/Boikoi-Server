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
exports.CowService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cow_model_1 = require("./cow.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const searchableFields_1 = require("../../../constance/searchableFields");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const user_model_1 = require("../user/user.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
// create a cow
const createCow = (cow) => __awaiter(void 0, void 0, void 0, function* () {
    const sellerDetails = yield user_model_1.User.findById(cow.seller);
    // console.log(sellerDetails);
    if (sellerDetails) {
        if (sellerDetails.role !== 'seller') {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This is not a valid seller id');
        }
    }
    if (cow.label) {
        cow.label = 'for sale';
    }
    let newCowAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newCow = yield cow_model_1.Cow.create([cow], { session });
        if (!newCow.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Cow Profile');
        }
        newCowAllData = newCow[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return newCowAllData;
});
// get all Cows
const getAllCow = (filters, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, maxPrice, minPrice } = filters, filtersData = __rest(filters, ["searchTerm", "maxPrice", "minPrice"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            $or: searchableFields_1.cowSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (searchTerm) {
        if (!isNaN(parseFloat(searchTerm))) {
            // [field] = parseFloat(searchTerm);
            // console.log(field);
            // console.log(searchTerm);
        }
    }
    // console.log(minPrice, maxPrice);
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
    if (Object.keys(filtersData).length) {
        andCondition.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculationPagination(paginationOption);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
    const result = yield cow_model_1.Cow.find(whereCondition)
        .populate('seller')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield cow_model_1.Cow.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get a single cow
const getSingleCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id).populate('seller');
    return result;
});
// updated Cow
const updateCow = (id, payload, token) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { phone, role } = verifiedToken;
    // console.log('PHONE 📞', phone);
    const cowDetails = yield cow_model_1.Cow.findById(id);
    // console.log('cowDetails 🐮', cowDetails);
    if (!cowDetails) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This cow is invalid');
    }
    const sellerDetails = yield user_model_1.User.findById(cowDetails === null || cowDetails === void 0 ? void 0 : cowDetails.seller);
    // console.log('👉👉👉👉👉👉sellerDetails', sellerDetails);
    if ((sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.phoneNumber) !== phone || (sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.role) !== role) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This is not a valid seller id for this cow');
    }
    const result = yield cow_model_1.Cow.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    }).populate('seller');
    // console.log(result, 'updated result');
    return result;
});
// Delete Cow
const deleteCow = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Token => 🔖🔖', token);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    // console.log('verifiedToken =======', verifiedToken);
    const { phone, role } = verifiedToken;
    // console.log('PHONE 📞', phone);
    const cowDetails = yield cow_model_1.Cow.findById(id);
    // console.log('cowDetails 🐮', cowDetails);
    if (!cowDetails) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This cow is invalid');
    }
    const sellerDetails = yield user_model_1.User.findById(cowDetails === null || cowDetails === void 0 ? void 0 : cowDetails.seller);
    // console.log('👉👉👉👉👉👉sellerDetails', sellerDetails);
    if ((sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.phoneNumber) !== phone || (sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.role) !== role) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This is not a valid seller id for this cow');
    }
    const result = yield cow_model_1.Cow.findByIdAndDelete({ _id: id }, { new: true });
    // console.log('Deleted Result 🗑️🗑️', result);
    return result;
});
exports.CowService = {
    createCow,
    getAllCow,
    getSingleCow,
    deleteCow,
    updateCow,
};
