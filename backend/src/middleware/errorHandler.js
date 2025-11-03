const { CustomError } = require('../errors/customErrors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
    });
  }

  console.error('❌ Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
};

module.exports = errorHandler;
