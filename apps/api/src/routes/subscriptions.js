const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { requireUser } = require('../middleware/require-user');
const { validate } = require('../middleware/validation');
const { prisma } = require('db');
const { encrypt, decrypt } = require('../utils/crypto');

const router = express.Router();

const subscriptionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.preprocess(
    (value) => (value === '' ? null : value),
    z.string().email('Invalid email').optional().nullable()
  ),
  password: z.string().min(1, 'Password is required'),
  photoUrl: z.preprocess(
    (value) => (value === '' ? null : value),
    z.string().url('Invalid URL').optional().nullable()
  ),
  amount: z.coerce.number().positive('Amount must be positive').refine(Number.isFinite, 'Invalid amount'),
  recurrence: z.preprocess(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    z.enum(['MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL'])
  ),
  paymentDay: z.coerce.number().int().min(1).max(31),
  nextPaymentDate: z.preprocess(
    (value) => (value === '' ? null : value),
    z.coerce.date().refine((date) => !Number.isNaN(date.getTime()), 'Invalid date').optional().nullable()
  ),
});

const idParamsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * GET /subscriptions
 */
router.get('/', requireAuth, requireUser, async (req, res, next) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const sanitized = subscriptions.map((sub) => {
      const { passwordEncrypted, ...rest } = sub;
      return { ...rest, hasPassword: true };
    });

    res.json(sanitized);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /subscriptions/:id
 */
router.get('/:id', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const { passwordEncrypted, ...rest } = subscription;
    res.json({ ...rest, hasPassword: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /subscriptions/:id/password
 */
router.get('/:id/password', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    let password;
    try {
      password = decrypt(subscription.passwordEncrypted);
    } catch (error) {
      return res.status(400).json({ error: 'Password data invalid' });
    }
    res.json({ password });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /subscriptions
 */
router.post('/', requireAuth, requireUser, validate({ body: subscriptionSchema }), async (req, res, next) => {
  try {
    const { password, nextPaymentDate, ...data } = req.body;

    const passwordEncrypted = encrypt(password);

    const subscription = await prisma.subscription.create({
      data: {
        ...data,
        passwordEncrypted,
        nextPaymentDate: nextPaymentDate || null,
        userId: req.user.id,
      },
    });

    const { passwordEncrypted: _, ...rest } = subscription;
    res.status(201).json({ ...rest, hasPassword: true });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /subscriptions/:id
 */
router.put('/:id', requireAuth, requireUser, validate({ params: idParamsSchema, body: subscriptionSchema }), async (req, res, next) => {
  try {
    const { password, nextPaymentDate, ...data } = req.body;

    const passwordEncrypted = encrypt(password);

    const subscription = await prisma.subscription.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      data: {
        ...data,
        passwordEncrypted,
        nextPaymentDate: nextPaymentDate || null,
      },
    });

    if (subscription.count === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const updated = await prisma.subscription.findUnique({
      where: { id: req.params.id },
    });

    const { passwordEncrypted: _, ...rest } = updated;
    res.json({ ...rest, hasPassword: true });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /subscriptions/:id
 */
router.delete('/:id', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const result = await prisma.subscription.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ message: 'Subscription removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
