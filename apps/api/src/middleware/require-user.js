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

    await ensureDefaultCategories(user.id);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireUser };
