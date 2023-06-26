"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const user_constance_1 = require("./user.constance");
const bcrypt_1 = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const UserSchema = new mongoose_1.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: user_constance_1.role, required: true },
    password: { type: String, required: true, select: 0 },
    name: {
        required: true,
        type: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
        },
    },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    income: { type: Number, required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
UserSchema.statics.isUserExist = function (phoneNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ phoneNumber }, { _id: 1, phoneNumber: 1, role: 1, password: 1 });
    });
};
UserSchema.statics.isPasswordMatch = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        //hash password
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        console.log('password  and Hash 💡', this.password, bcrypt_1.hash);
        next();
    });
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
