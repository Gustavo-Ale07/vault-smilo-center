const { clerkClient } = require('@clerk/clerk-sdk-node');
const { prisma } = require('db');

function getPrimaryEmail(clerkUser) {
  if (!clerkUser || !clerkUser.emailAddresses) {
    return null;
  }
  const primary = clerkUser.emailAddresses.find(
    (email) => email.id === clerkUser.primaryEmailAddressId
  );
  return (primary || clerkUser.emailAddresses[0])?.emailAddress || null;
}

async function requireUser(req, res, next) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const clerkUser = await clerkClient.users.getUser(clerkId);
    const email = getPrimaryEmail(clerkUser) || `user_${clerkId}@clerk.local`;
    const name = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(' ') || null;

    let user = await prisma.user.findUnique({ where: { clerkId } });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId, email, name },
      });
    } else if (user.email !== email || user.name !== name) {
      user = await prisma.user.update({
        where: { clerkId },
        data: { email, name },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireUser };
