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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_constance_1 = require("./user.constance");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const UserSchema = new mongoose_1.Schema({
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: user_constance_1.role, required: true },
    password: { type: String, required: true },
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
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExit = yield exports.User.findOne({
            phoneNumber: this.phoneNumber,
            role: this.role,
        });
        if (isExit) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'This User is already Exist ❗❗');
        }
        next();
    });
});
exports.User = (0, mongoose_1.model)('User', UserSchema);
