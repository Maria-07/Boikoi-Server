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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const cow_model_1 = require("../cow/cow.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
// create a Order
const createOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('order = ', order);
    const BuyerDetails = yield user_model_1.User.findById(order.buyer);
    // console.log('BuyerDetails', BuyerDetails);
    const CowDetails = yield cow_model_1.Cow.findById(order.cow);
    // console.log('CowDetails', CowDetails);
    if ((BuyerDetails === null || BuyerDetails === void 0 ? void 0 : BuyerDetails.role) !== 'buyer') {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This user is not a buyer');
    }
    if (!CowDetails || !BuyerDetails) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Buyer and Cow Id not founded');
    }
    if (CowDetails.label === 'sold out') {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This Cow is already sold out');
    }
    if (BuyerDetails.budget < CowDetails.price) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Buyer Does not have sufficient budget to buy this cow');
    }
    let newOrderAllData = null;
    // Start the transaction
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Update the cow's label to 'sold out'
        yield cow_model_1.Cow.updateOne({ _id: CowDetails.id }, { $set: { label: 'sold out' } });
        // Deduct the cost of the cow from the buyer's budget
        const buyerBudgetUpdate = {
            budget: BuyerDetails.budget - CowDetails.price,
        };
        yield user_model_1.User.findOneAndUpdate({ _id: order.buyer }, buyerBudgetUpdate);
        // Add the cost of the cow to the seller's income
        const sellerData = yield user_model_1.User.findById(CowDetails.seller);
        if (sellerData) {
            const sellerIncomeUpdate = {
                income: (sellerData === null || sellerData === void 0 ? void 0 : sellerData.income) + CowDetails.price,
            };
            yield user_model_1.User.findOneAndUpdate({ _id: sellerData === null || sellerData === void 0 ? void 0 : sellerData.id }, sellerIncomeUpdate);
        }
        const newOrder = yield order_model_1.Order.create([order], { session });
        if (!newOrder.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create this order');
        }
        newOrderAllData = newOrder[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return newOrderAllData;
});
// get all services
const getSingleOrder = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Token => 🔖🔖', token);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    // console.log('verifiedToken =======>', verifiedToken);
    const { phone, role } = verifiedToken;
    const user = yield user_model_1.User.findOne({ phoneNumber: phone }, { _id: 1 });
    const userId = user === null || user === void 0 ? void 0 : user.id;
    // console.log('User Id From token 👉', userId);
    // ------------------------------------------------------token----------
    const order = yield order_model_1.Order.findById(id);
    if (role === 'buyer') {
        const buyerID = order === null || order === void 0 ? void 0 : order.buyer.toString();
        // console.log('Buyer ID = ', buyerID);
        if (buyerID !== userId) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'This buyer is not authorized');
        }
    }
    if (role === 'seller') {
        const CowDetails = yield cow_model_1.Cow.findById(order === null || order === void 0 ? void 0 : order.cow);
        const SellerID = CowDetails === null || CowDetails === void 0 ? void 0 : CowDetails.seller.toString();
        // console.log('Seller ID = ', SellerID);
        if (SellerID !== userId) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'This Seller is not authorized');
        }
    }
    const result = yield order_model_1.Order.findById(id)
        .populate('cow')
        .populate('buyer')
        .populate({
        path: 'cow',
        populate: {
            path: 'seller',
            model: 'User',
        },
    });
    return result;
});
exports.OrderService = {
    createOrder,
    getSingleOrder,
};
