import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMassage } from '../interfaces/error';

const handleZodErrorHandler = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMassage[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;
  return {
    statusCode,
    message: 'validation Error',
    errorMessages: errors,
  };
};

export default handleZodErrorHandler;
