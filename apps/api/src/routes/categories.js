const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { requireUser } = require('../middleware/require-user');
const { validate } = require('../middleware/validation');
const { prisma } = require('db');

const router = express.Router();

const categorySchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  type: z.preprocess(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    z.enum(['EXPENSE', 'INCOME', 'INVESTMENT'])
  ),
});

const idParamsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * GET /categories
 */
router.get('/', requireAuth, requireUser, async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /categories
 */
router.post('/', requireAuth, requireUser, validate({ body: categorySchema }), async (req, res, next) => {
  try {
    const category = await prisma.category.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    next(error);
  }
});

/**
 * PUT /categories/:id
 */
router.put('/:id', requireAuth, requireUser, validate({ params: idParamsSchema, body: categorySchema }), async (req, res, next) => {
  try {
    const result = await prisma.category.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
      data: req.body,
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updated = await prisma.category.findUnique({
      where: { id: req.params.id },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /categories/:id
 */
router.delete('/:id', requireAuth, requireUser, validate({ params: idParamsSchema }), async (req, res, next) => {
  try {
    const result = await prisma.category.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
