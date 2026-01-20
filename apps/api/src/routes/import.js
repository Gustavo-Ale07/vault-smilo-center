const express = require('express');
const fileUpload = require('express-fileupload');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const { requireUser } = require('../middleware/require-user');
const { prisma } = require('db');

const router = express.Router();

router.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

const csvRowSchema = z.object({
  date: z.coerce.date().refine((value) => !Number.isNaN(value.getTime()), 'Invalid date'),
  title: z.string().trim().min(1),
  amount: z.coerce.number().refine(Number.isFinite, 'Invalid amount'),
  type: z.preprocess(
    (value) => (typeof value === 'string' ? value.toUpperCase() : value),
    z.enum(['EXPENSE', 'INCOME'])
  ),
  category: z.string().trim().optional().nullable(),
});

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      const nextChar = line[i + 1];
      if (inQuotes && nextChar === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    return { header: [], rows: [] };
  }

  const header = parseCsvLine(lines[0]).map((item) => item.toLowerCase());
  const rows = lines.slice(1).map(parseCsvLine);

  return { header, rows };
}

router.post('/csv', requireAuth, requireUser, async (req, res, next) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return res.status(400).json({ error: 'File must be CSV' });
    }

    const content = file.data.toString('utf-8');
    const { header, rows } = parseCsv(content);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'CSV is empty or invalid' });
    }

    const columnIndex = {
      date: header.indexOf('date'),
      title: header.indexOf('title'),
      amount: header.indexOf('amount'),
      type: header.indexOf('type'),
      category: header.indexOf('category'),
    };

    if (columnIndex.date === -1 || columnIndex.title === -1 || columnIndex.amount === -1 || columnIndex.type === -1) {
      return res.status(400).json({ error: 'CSV header must include date,title,amount,type' });
    }

    const imported = [];
    const errors = [];
    let skipped = 0;

    for (let i = 0; i < rows.length; i++) {
      const lineNum = i + 2;
      const parts = rows[i];

      try {
        const rawRow = {
          date: parts[columnIndex.date],
          title: parts[columnIndex.title],
          amount: parts[columnIndex.amount],
          type: parts[columnIndex.type],
          category: columnIndex.category !== -1 ? parts[columnIndex.category] : null,
        };

        const parsed = csvRowSchema.parse(rawRow);
        const normalizedType = parsed.type.toUpperCase();

        let categoryId = null;
        if (parsed.category) {
          let category = await prisma.category.findFirst({
            where: {
              userId: req.user.id,
              name: parsed.category,
            },
          });

          if (!category) {
            category = await prisma.category.create({
              data: {
                name: parsed.category,
                type: normalizedType,
                userId: req.user.id,
              },
            });
          }

          categoryId = category.id;
        }

        const existing = await prisma.transaction.findFirst({
          where: {
            userId: req.user.id,
            type: normalizedType,
            title: parsed.title,
            amount: parsed.amount,
            date: parsed.date,
            categoryId,
          },
        });

        if (existing) {
          skipped += 1;
          continue;
        }

        const transaction = await prisma.transaction.create({
          data: {
            userId: req.user.id,
            type: normalizedType,
            title: parsed.title,
            amount: parsed.amount,
            date: parsed.date,
            categoryId,
            isFixed: false,
          },
        });

        imported.push(transaction);
      } catch (error) {
        errors.push({
          line: lineNum,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      imported: imported.length,
      skipped,
      errors: errors.length,
      preview: imported.slice(0, 5),
      details: {
        transactions: imported,
        errors,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
