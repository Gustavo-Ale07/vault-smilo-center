const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { requireUser } = require('../middleware/require-user');
const { validate } = require('../middleware/validation');
const { prisma } = require('db');

const router = express.Router();

const transactionSchema = z.object({
  type: z.preprocess(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    z.enum(['EXPENSE', 'INCOME'])
  ),
  title: z.string().trim().min(1, 'Title is required'),
  amount: z.coerce.number().positive('Amount must be positive').refine(Number.isFinite, 'Invalid amount'),
  date: z.coerce.date().refine((value) => !Number.isNaN(value.getTime()), 'Invalid date'),
  categoryId: z.string().uuid().optional().nullable(),
  isFixed: z.coerce.boolean().optional().default(false),
  notes: z.string().optional().nullable(),
});

const listQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(1970).max(2100).optional(),
  type: z.preprocess(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    z.enum(['EXPENSE', 'INCOME'])
  ).optional(),
});

const idParamsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * GET /transactions
 */
router.get('/', requireAuth, requireUser, validate({ query: listQuerySchema }), async (req, res, next) => {
  try {
    const { month, year, type } = req.query;

    const where = { userId: req.user.id };

    if (type) {
      where.type = type;
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /transactions/summary
 */
router.get('/summary', requireAuth, requireUser, validate({ query: listQuerySchema }), async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month || new Date().getMonth() + 1;
    const currentYear = year || new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const fixedExpenses = transactions
      .filter((t) => t.type === 'EXPENSE' && t.isFixed)
      .reduce((sum, t) => sum + t.amount, 0);

    const variableExpenses = transactions
      .filter((t) => t.type === 'EXPENSE' && !t.isFixed)
      .reduce((sum, t) => sum + t.amount, 0);

    const expensesByCategory = {};
    transactions
      .filter((t) => t.type === 'EXPENSE' && t.category)
      .forEach((t) => {
        const categoryName = t.category.name;
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = 0;
        }
        expensesByCategory[categoryName] += t.amount;
      });

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      fixedExpenses,
      variableExpenses,
      expensesByCategory,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /transactions
 */
router.post('/', requireAuth, requireUser, validate({ body: transactionSchema }), async (req, res, next) => {
  try {
    const { date, ...data } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        date,
        userId: req.user.id,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /transactions/:id
 */
router.put('/:id', requireAuth, requireUser, validate({ params: idParamsSchema, body: transactionSchema }), async (req, res, next) => {
  try {
    const { date, ...data } = req.body;

    const result = await prisma.transaction.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      data: {
        ...data,
        date,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updated = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /transactions/:id
 */
router.delete('/:id', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const result = await prisma.transaction.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
