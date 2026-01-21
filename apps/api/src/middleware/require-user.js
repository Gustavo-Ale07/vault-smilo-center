const { clerkClient } = require('@clerk/clerk-sdk-node');
const { prisma } = require('db');

const DEFAULT_CATEGORIES = [
  { name: 'Moradia', type: 'EXPENSE' },
  { name: 'Alimentacao', type: 'EXPENSE' },
  { name: 'Transporte', type: 'EXPENSE' },
  { name: 'Saude', type: 'EXPENSE' },
  { name: 'Educacao', type: 'EXPENSE' },
  { name: 'Lazer', type: 'EXPENSE' },
  { name: 'Compras', type: 'EXPENSE' },
  { name: 'Contas', type: 'EXPENSE' },
  { name: 'Assinaturas', type: 'EXPENSE' },
  { name: 'Salario', type: 'INCOME' },
  { name: 'Freelancer', type: 'INCOME' },
  { name: 'Vendas', type: 'INCOME' },
  { name: 'Investimentos', type: 'INCOME' },
  { name: 'Renda Fixa', type: 'INVESTMENT' },
  { name: 'Acoes', type: 'INVESTMENT' },
  { name: 'Cripto', type: 'INVESTMENT' },
];

async function ensureDefaultCategories(userId) {
  const existing = await prisma.category.findMany({
    where: { userId },
    select: { name: true },
  });
  const existingNames = new Set(existing.map((item) => item.name));
  const missing = DEFAULT_CATEGORIES.filter((category) => !existingNames.has(category.name));

  if (missing.length === 0) {
    return;
  }

  await prisma.category.createMany({
    data: missing.map((category) => ({ ...category, userId })),
    skipDuplicates: true,
  });
}

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
    const normalizedEmail = email.toLowerCase();
    const name = [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(' ') || null;

    // First, try to find by clerkId.
    let user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      // If not found by clerkId, try by email (case-insensitive).
      const existingUserByEmail = await prisma.user.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      });
      if (existingUserByEmail) {
        // Email exists with another clerkId. Attach this clerkId to it.
        user = await prisma.user.update({
          where: { id: existingUserByEmail.id },
          data: { clerkId, email: normalizedEmail, name },
        });
      } else {
        // No user exists, create a new one.
        user = await prisma.user.create({
          data: { clerkId, email: normalizedEmail, name },
        });
      }
    } else if (user.email !== normalizedEmail || user.name !== name) {
      // User exists by clerkId, but email or name changed.
      try {
        user = await prisma.user.update({
          where: { clerkId },
          data: { email: normalizedEmail, name },
        });
      } catch (updateError) {
        if (updateError?.code === 'P2002') {
          const existingUserByEmail = await prisma.user.findFirst({
            where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
          });
          if (existingUserByEmail) {
            user = await prisma.user.update({
              where: { id: existingUserByEmail.id },
              data: { clerkId, email: normalizedEmail, name },
            });
          } else {
            throw updateError;
          }
        } else {
          throw updateError;
        }
      }
    }

    await ensureDefaultCategories(user.id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireUser };

