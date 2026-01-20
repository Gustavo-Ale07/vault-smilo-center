const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
dotenv.config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { errorHandler } = require('./middleware/error');
const { apiLimiter, authLimiter, writeLimiter } = require('./middleware/rateLimit');
const { testConnection } = require('db');
const { 
  logAuthAttempt, 
  logSuspiciousActivity, 
  logRateLimit, 
  logFailedRequests 
} = require('./middleware/security');

// Routes
const healthRoutes = require('./routes/health');
const userRoutes = require('./routes/user');
const subscriptionRoutes = require('./routes/subscriptions');
const vaultAccountRoutes = require('./routes/vault-accounts');
const categoryRoutes = require('./routes/categories');
const transactionRoutes = require('./routes/transactions');
const investmentRoutes = require('./routes/investments');
const importRoutes = require('./routes/import');

const app = express();
const PORT = process.env.PORT || 3001;
const API_VERSION = 'v1';

function ensureRequiredEnv() {
  const required = ['DATABASE_URL', 'CLERK_SECRET_KEY', 'ENCRYPTION_KEY_BASE64'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
}

function getCorsOptions() {
  const raw = process.env.CORS_ORIGIN;
  if (!raw || !raw.trim()) {
    return { origin: ['http://localhost:5173'], credentials: true };
  }

  if (raw.trim() === '*') {
    return { origin: true, credentials: false };
  }

  const allowList = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowList.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  };
}

ensureRequiredEnv();

// Test database connection
testConnection().catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

app.set('trust proxy', 1);

// Request timeout configuration
app.use((req, res, next) => {
  res.setTimeout(60000, () => {
    res.status(504).json({ error: 'Request timeout' });
  });
  next();
});

// Security headers with enhanced configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
}));

// CORS
app.use(cors(getCorsOptions()));

// Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Security monitoring
app.use(logAuthAttempt);
app.use(logSuspiciousActivity);
app.use(logRateLimit);
app.use(logFailedRequests);

// Apply rate limiting to all API routes
app.use(`/api/${API_VERSION}`, apiLimiter);

// Routes with API versioning
app.use('/health', healthRoutes);
app.use(`/api/${API_VERSION}/me`, userRoutes);
app.use(`/api/${API_VERSION}/subscriptions`, subscriptionRoutes);
app.use(`/api/${API_VERSION}/vault-accounts`, vaultAccountRoutes);
app.use(`/api/${API_VERSION}/categories`, categoryRoutes);
app.use(`/api/${API_VERSION}/transactions`, transactionRoutes);
app.use(`/api/${API_VERSION}/investments`, investmentRoutes);
app.use(`/api/${API_VERSION}/import`, importRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Vault Smilo Center API',
    version: '1.0.0',
    apiVersion: API_VERSION,
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get(`/api/${API_VERSION}`, (req, res) => {
  res.json({
    message: 'Vault Smilo Center API',
    version: '1.0.0',
    apiVersion: API_VERSION,
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      user: `/api/${API_VERSION}/me`,
      subscriptions: `/api/${API_VERSION}/subscriptions`,
      vaultAccounts: `/api/${API_VERSION}/vault-accounts`,
      categories: `/api/${API_VERSION}/categories`,
      transactions: `/api/${API_VERSION}/transactions`,
      investments: `/api/${API_VERSION}/investments`,
      import: `/api/${API_VERSION}/import`,
    },
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Vault Smilo Center API running');
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});

module.exports = app;
