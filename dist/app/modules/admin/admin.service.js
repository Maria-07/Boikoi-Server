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
exports.AdminService = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const admin_model_1 = require('./admin.model');
const http_status_1 = __importDefault(require('http-status'));
const ApiError_1 = __importDefault(require('../../../errors/ApiError'));
const jwtHelpers_1 = require('../../../helpers/jwtHelpers');
const config_1 = __importDefault(require('../../../config'));
const createAdmin = admin =>
  __awaiter(void 0, void 0, void 0, function* () {
    let newAdminAllData = null;
    const session = yield mongoose_1.default.startSession();
    try {
      session.startTransaction();
      const newAdmin = yield admin_model_1.Admin.create([admin], { session });
      if (!newAdmin.length) {
        throw new ApiError_1.default(
          http_status_1.default.BAD_REQUEST,
          'Failed to create student'
        );
      }
      newAdminAllData = newAdmin[0];
      yield session.commitTransaction();
      yield session.endSession();
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw error;
    }
    return newAdminAllData;
  });
const loginUser = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    // console.log(payload);
    const isUserExist = yield admin_model_1.Admin.isUserExist(phoneNumber);
    // console.log('isisUserExist', isUserExist);
    if (!isUserExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'User does not exist'
      );
    }
    // match password
    if (
      isUserExist.password &&
      !(yield admin_model_1.Admin.isPasswordMatch(
        password,
        isUserExist.password
      ))
    ) {
      throw new ApiError_1.default(
        http_status_1.default.UNAUTHORIZED,
        'password is incorrect'
      );
    }
    // create accessToken and refreshToken
    const { phoneNumber: phone, role } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(
      {
        phone,
        role,
      },
      config_1.default.jwt.secret,
      config_1.default.jwt.expire_in
    );
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken(
      {
        phone,
        role,
      },
      config_1.default.jwt.refresh_secret,
      config_1.default.jwt.refresh_expire_in
    );
    // console.log({ accessToken, refreshToken, needsPasswordChange });
    return { accessToken, refreshToken };
  });
const refreshToken = token =>
  __awaiter(void 0, void 0, void 0, function* () {
    // console.log(token, 'token 🚩🗃️👉🔰');
    let verifiedToken = null;
    try {
      verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(
        token,
        config_1.default.jwt.refresh_secret
      );
    } catch (err) {
      throw new ApiError_1.default(
        http_status_1.default.FORBIDDEN,
        'Invalid Refresh Token'
      );
    }
    const { phone } = verifiedToken;
    // console.log('verifiedToken', verifiedToken);
    const isUserExist = yield admin_model_1.Admin.isUserExist(phone);
    // console.log('isUserExist', isUserExist);
    if (!isUserExist) {
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        'User does not exist'
      );
    }
    // generate new token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken(
      { phoneNumber: isUserExist.phoneNumber, role: isUserExist.role },
      config_1.default.jwt.secret,
      config_1.default.jwt.expire_in
    );
    return { accessToken: newAccessToken };
  });
exports.AdminService = {
  createAdmin,
  loginUser,
  refreshToken,
};
