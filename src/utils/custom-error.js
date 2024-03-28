export class CustomError extends Error {
  constructor(error, isOperational = true, stack = '') {
    super(error.message);
    this.code = error.code;
    this.message = error.message;
    this.data = error.data;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else Error.captureStackTrace(this, this.constructor);
  }
}
