const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { requireUser } = require('../middleware/require-user');
const { validate } = require('../middleware/validation');
const { prisma } = require('db');

const router = express.Router();

const updateUserSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().email().optional(),
});

/**
 * GET /me
 * Ensures the user exists and returns the record.
 */
router.get('/', requireAuth, requireUser, async (req, res) => {
  res.json(req.user);
});

/**
 * PUT /me
 * Updates user profile fields.
 */
router.put('/', requireAuth, requireUser, validate({ body: updateUserSchema }), async (req, res, next) => {
  try {
    const clerkId = req.auth.userId;
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { clerkId },
      data: { name, email },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
