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
exports.ImageUploadController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const imageUpload = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        res.json({
            status: 'success',
            url: `${process.env.multer_url}/${(_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename}`,
        });
    }
    catch (err) {
        // Handle errors here
        console.error(err);
        res.status(500).json({ status: 'error' });
    }
}));
exports.ImageUploadController = {
    imageUpload,
};
