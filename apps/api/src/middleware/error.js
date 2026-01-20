const { ZodError } = require('zod');

class ApiError extends Error {
  constructor(status, message, details, code) {
    super(message);
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

function createError(status, message, details, code) {
  return new ApiError(status, message, details, code);
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error('Error Handler:', {
    path: req.path,
    method: req.method,
    error: err.message,
    stack: err.stack,
    status: err.status,
    code: err.code
  });

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS blocked' });
  }

  const status = err.status || 500;
  const payload = {
    error: err.message || 'Internal server error',
  };

  if (err.code) {
    payload.code = err.code;
  }

  if (process.env.NODE_ENV !== 'production' && err.details) {
    payload.details = err.details;
  }

  return res.status(status).json(payload);
}

module.exports = {
  ApiError,
  createError,
  errorHandler,
};
