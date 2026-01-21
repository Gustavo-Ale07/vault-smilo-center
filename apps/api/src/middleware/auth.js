const { clerkClient } = require('@clerk/clerk-sdk-node');
const { importSPKI, jwtVerify } = require('jose');

/**
 * Clerk JWT auth middleware. Validates Bearer token and sets req.auth.userId.
 */
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authentication token' });
    }

    const token = authHeader.substring(7).trim();

    if (typeof clerkClient.verifyToken !== 'function') {
      return res.status(500).json({ error: 'Auth provider not configured' });
    }

    const jwtKeyRaw = process.env.CLERK_JWT_KEY;
    const jwtKey = jwtKeyRaw?.includes('\\n')
      ? jwtKeyRaw.replace(/\\n/g, '\n')
      : jwtKeyRaw;

    if (jwtKey) {
      const key = await importSPKI(jwtKey, 'RS256');
      const issuer = process.env.CLERK_JWT_ISSUER;
      const audience = process.env.CLERK_JWT_AUDIENCE;
      const verifyOptions = {};
      if (issuer) {
        verifyOptions.issuer = issuer;
      }
      if (audience) {
        verifyOptions.audience = audience;
      }

      const { payload } = await jwtVerify(token, key, verifyOptions);

      if (!payload || !payload.sub) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      req.auth = { userId: payload.sub };
      return next();
    }

    const sessionClaims = await clerkClient.verifyToken(token);

    if (!sessionClaims || !sessionClaims.sub) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.auth = { userId: sessionClaims.sub };
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = { requireAuth };
