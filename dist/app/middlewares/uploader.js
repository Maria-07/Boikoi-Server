"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: 'image/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});
const uploader = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const supportedImage = /\.(jpg|jpeg|png)$/;
        const extension = path_1.default.extname(file.originalname);
        if (supportedImage.test(extension)) {
            cb(null, true);
        }
        else {
            cb(new Error('Must be a png/jpg/jpeg image'));
        }
    },
    limits: {
        fileSize: 2000000,
    },
});
exports.default = uploader;
