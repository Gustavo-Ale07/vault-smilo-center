/**
 * Security monitoring middleware
 * Logs security-related events for monitoring and auditing
 */

function logSecurityEvent(req, event, details = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    method: req.method,
    path: req.path,
    userId: req.auth?.userId || 'anonymous',
    ...details
  };

  // In production, you might want to send this to a logging service
  // For now, we'll log to console with a security prefix
  if (process.env.NODE_ENV === 'production') {
    console.log(`[SECURITY] ${JSON.stringify(logEntry)}`);
  } else {
    console.log(`[SECURITY] ${event}:`, logEntry);
  }
}

/**
 * Middleware to log authentication attempts
 */
function logAuthAttempt(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    if (req.path.includes('/me') || req.path.includes('/auth')) {
      const event = res.statusCode === 401 ? 'AUTH_FAILED' : 'AUTH_SUCCESS';
      logSecurityEvent(req, event, { statusCode: res.statusCode });
    }
    originalSend.call(this, data);
  };
  
  next();
}

/**
 * Middleware to log suspicious activity
 */
function logSuspiciousActivity(req, res, next) {
  // Log requests with suspicious patterns
  const suspiciousPatterns = [
    /\.\./,  // Path traversal attempts
    /<script>/i,  // XSS attempts
    /union.*select/i,  // SQL injection attempts
    /eval\(/i,  // Code injection attempts
  ];

  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);
  const combined = `${body} ${query}`;

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combined)) {
      logSecurityEvent(req, 'SUSPICIOUS_PATTERN', {
        pattern: pattern.toString(),
        body: req.body,
        query: req.query
      });
      break;
    }
  }

  next();
}

/**
 * Middleware to log rate limit hits
 */
function logRateLimit(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    if (res.statusCode === 429) {
      logSecurityEvent(req, 'RATE_LIMIT_EXCEEDED', {
        statusCode: res.statusCode
      });
    }
    originalSend.call(this, data);
  };
  
  next();
}

/**
 * Middleware to log failed requests
 */
function logFailedRequests(req, res, next) {
  const originalSend = res.send;
  
  res.send = function(data) {
    if (res.statusCode >= 400) {
      logSecurityEvent(req, 'REQUEST_FAILED', {
        statusCode: res.statusCode,
        error: data
      });
    }
    originalSend.call(this, data);
  };
  
  next();
}

module.exports = {
  logSecurityEvent,
  logAuthAttempt,
  logSuspiciousActivity,
  logRateLimit,
  logFailedRequests
};
