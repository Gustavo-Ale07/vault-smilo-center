const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { requireUser } = require('../middleware/require-user');
const { validate } = require('../middleware/validation');
const { prisma } = require('db');
const { encrypt, decrypt } = require('../utils/crypto');

const router = express.Router();

const vaultAccountSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.preprocess(
    (value) => (value === '' ? null : value),
    z.string().email('Invalid email').optional().nullable()
  ),
  password: z.string().min(1, 'Password is required'),
  platformPhotoUrl: z.preprocess(
    (value) => (value === '' ? null : value),
    z.string().url('Invalid URL').optional().nullable()
  ),
  notes: z.string().optional().nullable(),
});

const idParamsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * GET /vault-accounts
 */
router.get('/', requireAuth, requireUser, async (req, res, next) => {
  try {
    const accounts = await prisma.vaultAccount.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const sanitized = accounts.map((acc) => {
      const { passwordEncrypted, ...rest } = acc;
      return { ...rest, hasPassword: true };
    });

    res.json(sanitized);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /vault-accounts/:id
 */
router.get('/:id', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const account = await prisma.vaultAccount.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const { passwordEncrypted, ...rest } = account;
    res.json({ ...rest, hasPassword: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /vault-accounts/:id/password
 */
router.get('/:id/password', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const account = await prisma.vaultAccount.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    let password;
    try {
      password = decrypt(account.passwordEncrypted);
    } catch (error) {
      return res.status(400).json({ error: 'Password data invalid' });
    }
    res.json({ password });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /vault-accounts
 */
router.post('/', requireAuth, requireUser, validate({ body: vaultAccountSchema }), async (req, res, next) => {
  try {
    const { password, ...data } = req.body;

    const passwordEncrypted = encrypt(password);

    const account = await prisma.vaultAccount.create({
      data: {
        ...data,
        passwordEncrypted,
        userId: req.user.id,
      },
    });

    const { passwordEncrypted: _, ...rest } = account;
    res.status(201).json({ ...rest, hasPassword: true });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /vault-accounts/:id
 */
router.put('/:id', requireAuth, requireUser, validate({ params: idParamsSchema, body: vaultAccountSchema }), async (req, res, next) => {
  try {
    const { password, ...data } = req.body;
    const passwordEncrypted = encrypt(password);

    const result = await prisma.vaultAccount.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      data: {
        ...data,
        passwordEncrypted,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const updated = await prisma.vaultAccount.findUnique({
      where: { id: req.params.id },
    });

    const { passwordEncrypted: _, ...rest } = updated;
    res.json({ ...rest, hasPassword: true });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /vault-accounts/:id
 */
router.delete('/:id', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const result = await prisma.vaultAccount.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ message: 'Account removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
