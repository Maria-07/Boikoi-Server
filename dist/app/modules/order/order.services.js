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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const user_model_1 = require('../user/user.model');
const order_model_1 = require('./order.model');
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const http_status_1 = __importDefault(require('http-status'));
const cow_model_1 = require('../cow/cow.model');
// create a Order
const createOrder = order =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log('order = ', order);
    const BuyerDetails = yield user_model_1.User.findById(order.buyer);
    console.log('BuyerDetails', BuyerDetails);
    const CowDetails = yield cow_model_1.Cow.findById(order.cow);
    console.log('CowDetails', CowDetails);
    if (!CowDetails || !BuyerDetails) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'Buyer and Cow Id not founded'
      );
    }
    if (CowDetails.label === 'sold out') {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'This Cow is already sold out'
      );
    }
    if (BuyerDetails.budget < CowDetails.price) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'Buyer Does not have sufficient budget to buy this cow'
      );
    }
    let newOrderAllData = null;
    // Start the transaction
    const session = yield mongoose_1.default.startSession();
    try {
      session.startTransaction();
      // // Update the cow's label to 'sold out'
      CowDetails.label = 'sold out';
      yield CowDetails.save({ session });
      // // Deduct the cost of the cow from the buyer's budget
      BuyerDetails.budget -= CowDetails.price;
      yield BuyerDetails.save({ session });
      // // Add the cost of the cow to the seller's income
      const sellerData = yield user_model_1.User.findById(CowDetails.seller);
      if (sellerData) {
        sellerData.income += CowDetails.price;
        yield sellerData.save({ session });
      }
      const newOrder = yield order_model_1.Order.create([order], { session });
      if (!newOrder.length) {
        throw new ApiError_1.default(
          http_status_1.default.BAD_REQUEST,
          'Failed to create this order'
        );
      }
      newOrderAllData = newOrder[0];
      yield session.commitTransaction();
      yield session.endSession();
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw error;
    }
    return newOrderAllData;
  });
exports.OrderService = {
  createOrder,
};
