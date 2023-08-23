import express from 'express';
import uploader from '../../middlewares/uploader';
import { ImageUploadController } from './imageUpload.controller';
const router = express.Router();

// create a Blog
router.post('/', uploader.single('image'), ImageUploadController.imageUpload);

export const ImageRouter = router;
