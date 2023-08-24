"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRouter = void 0;
const express_1 = __importDefault(require("express"));
const uploader_1 = __importDefault(require("../../middlewares/uploader"));
const imageUpload_controller_1 = require("./imageUpload.controller");
const router = express_1.default.Router();
// create a Blog
router.post('/', uploader_1.default.single('image'), imageUpload_controller_1.ImageUploadController.imageUpload);
exports.ImageRouter = router;
