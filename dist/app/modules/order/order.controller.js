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
exports.OrderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const order_services_1 = require("./order.services");
const order_model_1 = require("./order.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const winston_1 = require("winston");
const cow_model_1 = require("../cow/cow.model");
// create Order
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = __rest(req.body, []);
    // console.log('order pro', order);
    const result = yield order_services_1.OrderService.createOrder(order);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order created successfully',
        data: result,
    });
}));
// get Order
const getOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
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
    const userId = yield user_model_1.User.findOne({ phoneNumber: phone }, { _id: 1 });
    // console.log('userID 👥', userId?.id);
    const id = userId === null || userId === void 0 ? void 0 : userId.id;
    // const cow = await Order.
    let query = {};
    let result;
    if (role === 'buyer') {
        query = {
            buyer: id,
        };
        result = yield order_model_1.Order.find(query)
            .populate('cow')
            .populate('buyer')
            .populate({
            path: 'cow',
            populate: {
                path: 'seller',
                model: 'User',
            },
        });
    }
    else if (role === 'seller') {
        const CowList = yield cow_model_1.Cow.find({ seller: id }, { _id: 1 });
        // console.log('CowDetails', CowList);
        const cowIdList = CowList.map(c => c._id);
        // console.log('id======', cowIdList);
        result = yield order_model_1.Order.find({ cow: { $in: cowIdList } }).populate({
            path: 'cow',
            populate: {
                path: 'seller',
                model: 'User',
            },
        });
    }
    else if (role === 'admin') {
        result = yield order_model_1.Order.find({})
            .populate('cow')
            .populate('buyer')
            .populate({
            path: 'cow',
            populate: {
                path: 'seller',
                model: 'User',
            },
        });
    }
    else {
        throw winston_1.error;
    }
    // console.log('Total Orders', result.length);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order retrieved successfully',
        data: result,
    });
}));
// get a single Order
const getSingleOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.headers.authorization;
    const result = yield order_services_1.OrderService.getSingleOrder(id, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order retrieved successfully',
        data: result,
    });
}));
exports.OrderController = {
    createOrder,
    getOrder,
    getSingleOrder,
};
