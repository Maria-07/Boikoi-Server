import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMassage } from '../interfaces/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const error: IGenericErrorMassage[] = Object.values(err.errors).map(
    (e: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: e?.path,
        message: e?.message,
      };
    }
  );
  const statusCode = 400;
  return {
    statusCode,
    message: 'validation Error',
    errorMessages: error,
  };
};

export default handleValidationError;
