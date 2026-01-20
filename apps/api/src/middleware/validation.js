const { z } = require('zod');

/**
 * Validate request segments with Zod.
 * @param {{ body?: z.ZodSchema, params?: z.ZodSchema, query?: z.ZodSchema }} schema
 * @returns {Function} Express middleware
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation Error:', {
          path: req.path,
          method: req.method,
          body: req.body,
          errors: error.errors
        });
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      console.error('Validation middleware error:', error);
      next(error);
    }
  };
}

module.exports = { validate };
