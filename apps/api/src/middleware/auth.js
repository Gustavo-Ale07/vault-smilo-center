const { clerkClient } = require('@clerk/clerk-sdk-node');

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

    const jwtKey = process.env.CLERK_JWT_KEY;
    const sessionClaims = await clerkClient.verifyToken(
      token,
      jwtKey ? { jwtKey } : undefined
    );

    if (!sessionClaims || !sessionClaims.sub) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.auth = { userId: sessionClaims.sub };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

module.exports = { requireAuth };
