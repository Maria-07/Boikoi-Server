import catchAsync from '../../../shared/catchAsync';
import { Request, RequestHandler, Response } from 'express';

const imageUpload: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    try {
      res.json({
        status: 'success',
        url: `${process.env.multer_url}/${req?.file?.filename}`,
      });
    } catch (err) {
      // Handle errors here
      console.error(err);
      res.status(500).json({ status: 'error' });
    }
  }
);

export const ImageUploadController = {
  imageUpload,
};
