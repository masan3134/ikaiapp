class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

class AuthorizationError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 403);
  }
}

class ValidationError extends CustomError {
  constructor(message = 'Invalid Input') {
    super(message, 400);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  AuthorizationError,
  ValidationError,
};
