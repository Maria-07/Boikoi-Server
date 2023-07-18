'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const handleValidationError = err => {
  const error = Object.values(err.errors).map(e => {
    return {
      path: e === null || e === void 0 ? void 0 : e.path,
      message: e === null || e === void 0 ? void 0 : e.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: 'validation Error',
    errorMessages: error,
  };
};
exports.default = handleValidationError;
