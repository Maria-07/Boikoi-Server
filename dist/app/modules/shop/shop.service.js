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
exports.ShopService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const shop_model_1 = require("./shop.model");
const searchableFields_1 = require("../../../constance/searchableFields");
const paginationHelpers_1 = require("../../../helpers/paginationHelpers");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
// create a Shop
const createShop = (shopData) => __awaiter(void 0, void 0, void 0, function* () {
    const bookShopOwnerDetails = yield user_model_1.User.findById(shopData.bookShopOwner);
    console.log(bookShopOwnerDetails);
    if (bookShopOwnerDetails) {
        if (bookShopOwnerDetails.role !== 'bookShopOwner') {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This is not a valid bookShopOwner id');
        }
    }
    const isExist = yield shop_model_1.Shop.findOne({ bookShopOwner: shopData.bookShopOwner });
    console.log('isExist', isExist);
    // if (isExist) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'Shop already Existed !!');
    // }
    let newShopAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const newShop = yield shop_model_1.Shop.create([shopData], { session });
        if (!newShop.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Shop Profile');
        }
        newShopAllData = newShop[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return newShopAllData;
});
// get all Shops
const getAllShop = (filters, paginationOption) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            $or: searchableFields_1.shopSearchableFields.map(field => ({
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
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginationHelpers.calculationPagination(paginationOption);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
    const result = yield shop_model_1.Shop.find(whereCondition)
        .populate('bookShopOwner')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield shop_model_1.Shop.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// get a single Shop
const getSingleShop = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_model_1.Shop.findById(id).populate('bookShopOwner');
    return result;
});
// updated Shop
const updateShop = (id, payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, payload);
    // console.log('Token => 🔖🔖', token);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    console.log('verifiedToken =======', verifiedToken);
    //   const { phone, role } = verifiedToken;
    //   // console.log('PHONE 📞', phone);
    //   const ShopDetails = await Shop.findById(id);
    //   // console.log('ShopDetails 🐮', ShopDetails);
    //   if (!ShopDetails) {
    //     throw new ApiError(httpStatus.NOT_FOUND, 'This Shop is invalid');
    //   }
    //   const bookShopOwnerDetails = await User.findById(ShopDetails?.bookShopOwner);
    //   // console.log('👉👉👉👉👉👉bookShopOwnerDetails', bookShopOwnerDetails);
    //   if (
    //     bookShopOwnerDetails?.phoneNumber !== phone ||
    //     bookShopOwnerDetails?.role !== role
    //   ) {
    //     throw new ApiError(
    //       httpStatus.NOT_FOUND,
    //       'This is not a valid bookShopOwner id for this Shop'
    //     );
    //   }
    const result = yield shop_model_1.Shop.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    }).populate('bookShopOwner');
    console.log(result, 'updated result');
    return result;
});
// Delete Shop
const deleteShop = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Token => 🔖🔖', token);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    console.log('verifiedToken =======', verifiedToken);
    //   const { phone, role } = verifiedToken;
    //   // console.log('PHONE 📞', phone);
    //   const ShopDetails = await Shop.findById(id);
    //   // console.log('ShopDetails 🐮', ShopDetails);
    //   if (!ShopDetails) {
    //     throw new ApiError(httpStatus.NOT_FOUND, 'This Shop is invalid');
    //   }
    //   const bookShopOwnerDetails = await User.findById(ShopDetails?.bookShopOwner);
    //   // console.log('👉👉👉👉👉👉bookShopOwnerDetails', bookShopOwnerDetails);
    //   if (
    //     bookShopOwnerDetails?.phoneNumber !== phone ||
    //     bookShopOwnerDetails?.role !== role
    //   ) {
    //     throw new ApiError(
    //       httpStatus.NOT_FOUND,
    //       'This is not a valid bookShopOwner id for this Shop'
    //     );
    //   }
    const result = yield shop_model_1.Shop.findByIdAndDelete({ _id: id }, { new: true });
    // console.log('Deleted Result 🗑️🗑️', result);
    return result;
});
exports.ShopService = {
    createShop,
    getAllShop,
    getSingleShop,
    deleteShop,
    updateShop,
};
