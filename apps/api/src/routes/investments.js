const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { requireUser } = require('../middleware/require-user');
const { validate } = require('../middleware/validation');
const { prisma } = require('db');

const router = express.Router();

const investmentSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  type: z.enum(['CDI', 'FIXED', 'STOCKS', 'CRYPTO', 'OTHER']),
  principal: z.coerce.number().nonnegative('Principal must be non-negative').refine(Number.isFinite, 'Invalid principal'),
  monthlyContribution: z.coerce.number().nonnegative().refine(Number.isFinite, 'Invalid monthly contribution').default(0),
  annualRateBps: z.coerce.number().int().nonnegative('Rate must be non-negative').refine(Number.isFinite, 'Invalid rate'),
  startDate: z.coerce.date().refine((value) => !Number.isNaN(value.getTime()), 'Invalid start date'),
});

const idParamsSchema = z.object({
  id: z.string().uuid(),
});

function calculateCompoundInterest(principal, monthlyContribution, annualRateBps, months) {
  const monthlyRate = (annualRateBps / 10000) / 12;
  let balance = principal;

  for (let i = 0; i < months; i++) {
    balance = balance * (1 + monthlyRate);
    balance += monthlyContribution;
  }

  return balance;
}

/**
 * GET /investments
 */
router.get('/', requireAuth, requireUser, async (req, res, next) => {
  try {
    const investments = await prisma.investment.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const enriched = investments.map((inv) => {
      const monthsSinceStart = Math.max(
        0,
        Math.floor((new Date() - new Date(inv.startDate)) / (1000 * 60 * 60 * 24 * 30))
      );

      const estimatedValue = calculateCompoundInterest(
        inv.principal,
        inv.monthlyContribution,
        inv.annualRateBps,
        monthsSinceStart
      );

      return {
        ...inv,
        estimatedValue: Math.round(estimatedValue * 100) / 100,
        monthsSinceStart,
      };
    });

    res.json(enriched);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /investments/:id
 */
router.get('/:id', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const investment = await prisma.investment.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    res.json(investment);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /investments/:id/projection
 */
router.get('/:id/projection', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const investment = await prisma.investment.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!investment) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    const monthsSinceStart = Math.max(
      0,
      Math.floor((new Date() - new Date(investment.startDate)) / (1000 * 60 * 60 * 24 * 30))
    );

    const projection = [];

    for (let i = 0; i <= 12; i++) {
      const totalMonths = monthsSinceStart + i;
      const value = calculateCompoundInterest(
        investment.principal,
        investment.monthlyContribution,
        investment.annualRateBps,
        totalMonths
      );

      const date = new Date();
      date.setMonth(date.getMonth() + i);

      projection.push({
        month: i,
        date: date.toISOString().slice(0, 7),
        value: Math.round(value * 100) / 100,
        totalMonths,
      });
    }

    res.json({
      investment,
      projection,
      formula: 'FV = PV * (1 + r)^n + PMT * [((1 + r)^n - 1) / r]',
      note: 'r = monthly rate, n = months, PV = principal, PMT = monthly contribution',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /investments
 */
router.post('/', requireAuth, requireUser, validate({ body: investmentSchema }), async (req, res, next) => {
  try {
    const { startDate, ...data } = req.body;

    const investment = await prisma.investment.create({
      data: {
        ...data,
        startDate,
        userId: req.user.id,
      },
    });

    res.status(201).json(investment);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /investments/:id
 */
router.put('/:id', requireAuth, requireUser, validate({ params: idParamsSchema, body: investmentSchema }), async (req, res, next) => {
  try {
    const { startDate, ...data } = req.body;

    const result = await prisma.investment.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      data: {
        ...data,
        startDate,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    const updated = await prisma.investment.findUnique({
      where: { id: req.params.id },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /investments/:id
 */
router.delete('/:id', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const result = await prisma.investment.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    res.json({ message: 'Investment removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
