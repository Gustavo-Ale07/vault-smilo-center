const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware to prevent DDoS and brute force attacks
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health';
    },
  });
};

// General API rate limiter (100 requests per 15 minutes)
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100,
  'Too many requests from this IP, please try again later'
);

// Strict rate limiter for authentication endpoints (5 requests per 15 minutes)
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5,
  'Too many authentication attempts, please try again later'
);

// Rate limiter for data modification endpoints (20 requests per 15 minutes)
const writeLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  20,
  'Too many write operations, please try again later'
);

module.exports = {
  apiLimiter,
  authLimiter,
  writeLimiter,
};
