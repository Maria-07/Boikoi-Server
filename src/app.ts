import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import ApiError from './errors/ApiError';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();

app.use(cors());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', () => {
  //   console.log('this is cow hut');
  throw new ApiError(httpStatus.BAD_REQUEST, 'User not found throw error');
});

// global error handler
app.use(globalErrorHandler);

// Handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Api not found',
      },
    ],
  });
  next();
});

export default app;
