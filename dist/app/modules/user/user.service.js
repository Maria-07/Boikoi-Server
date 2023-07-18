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
exports.UserService = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const user_model_1 = require('./user.model');
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const http_status_1 = __importDefault(require('http-status'));
const jwtHelpers_1 = require('../../../helpers/jwtHelpers');
const config_1 = __importDefault(require('../../../config'));
const admin_model_1 = require('../admin/admin.model');
// create a user through sign in
const createUser = user =>
  __awaiter(void 0, void 0, void 0, function* () {
    let newUserAllData = null;
    console.log(user.role);
    const session = yield mongoose_1.default.startSession();
    try {
      session.startTransaction();
      if (user.role === 'seller') {
        if (!user.budget || user.budget) {
          user.budget = 0;
          user.income = 0;
        }
      } else {
        if (!user.income || user.income) {
          user.income = 0;
        }
      }
      if (user.role === 'buyer') {
        if (user.budget === 0) {
          throw new ApiError_1.default(
            http_status_1.default.BAD_REQUEST,
            'Buyer must need some amount of Budget'
          );
        }
      }
      const newUser = yield user_model_1.User.create([user], { session });
      if (!newUser.length) {
        throw new ApiError_1.default(
          http_status_1.default.BAD_REQUEST,
          'Failed to create User'
        );
      }
      newUserAllData = newUser[0];
      yield session.commitTransaction();
      yield session.endSession();
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw error;
    }
    return newUserAllData;
  });
// get a single user
const getSingleUser = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
  });
// updated User
const updatedUser = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findById(id);
    if (!isExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'User not found !'
      );
    }
    const { name } = payload,
      UserData = __rest(payload, ['name']);
    const updatedUserData = Object.assign({}, UserData);
    //dynamic handling
    if (name && Object.keys(name).length > 0) {
      Object.keys(name).forEach(key => {
        const nameKey = `name.${key}`;
        updatedUserData[nameKey] = name[key];
      });
    }
    const result = yield user_model_1.User.findByIdAndUpdate(
      { _id: id },
      updatedUserData,
      {
        new: true,
      }
    );
    return result;
  });
// Delete User
const deleteUser = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(
      { _id: id },
      { new: true }
    );
    return result;
  });
// Get Profile Data
const getMyProfile = token =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log('Token => 🔖🔖', token);
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
    const { phone, role } = verifiedToken;
    console.log('PHONE 📞', phone);
    // if (role !== 'admin') {
    //   const result = await User.findOne({ phoneNumber: phone });
    //   return result;
    // } else {
    //   const result = await Admin.findOne({ phoneNumber: phone });
    //
    // }
    const result =
      role !== 'admin'
        ? yield user_model_1.User.findOne({ phoneNumber: phone })
        : yield admin_model_1.Admin.findOne({ phoneNumber: phone });
    return result;
  });
// update profile Data
const updateMyProfile = (payload, token) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log(payload);
    console.log('Token => 🔖🔖', token);
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
    const { phone, role } = verifiedToken;
    console.log('PHONE 📞', phone);
    const userDetails =
      role !== 'admin'
        ? yield user_model_1.User.findOne({ phoneNumber: phone })
        : yield admin_model_1.Admin.findOne({ phoneNumber: phone });
    console.log('userDetails', userDetails);
    if (!userDetails) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'This cow is invalid'
      );
    }
    if (
      (userDetails === null || userDetails === void 0
        ? void 0
        : userDetails.phoneNumber) !== phone ||
      (userDetails === null || userDetails === void 0
        ? void 0
        : userDetails.role) !== role
    ) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'You are UnAuthorized to update this profile'
      );
    }
    const result =
      role !== 'admin'
        ? yield user_model_1.User.findOneAndUpdate(
            { phoneNumber: phone },
            payload,
            {
              new: true,
            }
          )
        : yield admin_model_1.Admin.findOneAndUpdate(
            { phoneNumber: phone },
            payload,
            {
              new: true,
            }
          );
    console.log(result, 'updated result');
    return result;
  });
exports.UserService = {
  createUser,
  updatedUser,
  getSingleUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
};
