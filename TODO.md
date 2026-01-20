# TODO - Fix Error and Deploy to VPS

## ✅ Completed

### 1. Fix 400 Bad Request Error
- [x] Add logging to validation middleware (apps/api/src/middleware/validation.js)
- [x] Add logging to error handler (apps/api/src/middleware/error.js)
- [x] Fix subscription schema to handle empty strings (apps/api/src/routes/subscriptions.js)
  - Fixed email field to convert empty strings to null
  - Fixed photoUrl field to convert empty strings to null
- [x] Fix vault-accounts schema to handle empty strings (apps/api/src/routes/vault-accounts.js)
  - Fixed email field to convert empty strings to null
  - Fixed platformPhotoUrl field to convert empty strings to null

## 📋 Pending Tasks

### 2. Test the Fix Locally
- [ ] Start the API server: `cd apps/api && npm start`
- [ ] Start the frontend: `cd apps/web && npm run dev`
- [ ] Test creating a subscription in the browser
- [ ] Check the console logs for validation errors
- [ ] Verify the subscription is created successfully

### 3. Prepare for Deployment
- [ ] Ensure .env file exists with all required variables:
  - DATABASE_URL (PostgreSQL connection string)
  - CLERK_SECRET_KEY (from Clerk dashboard)
  - CLERK_JWT_KEY (from Clerk dashboard)
  - ENCRYPTION_KEY_BASE64 (run `node generate-key.js`)
  - CORS_ORIGIN (your domain, e.g., https://yourdomain.com)
  - NODE_ENV=production
- [ ] Build the frontend: `cd apps/web && npm run build`
- [ ] Run database migrations: `cd packages/db && npx prisma migrate deploy`
- [ ] Generate Prisma client: `cd packages/db && npx prisma generate`

### 4. Deploy to VPS

#### 4.1 Server Setup
- [ ] SSH into your VPS
- [ ] Update system: `sudo apt update && sudo apt upgrade -y`
- [ ] Install Node.js 18+:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
  ```
- [ ] Install PM2: `sudo npm install -g pm2`
- [ ] Install Nginx: `sudo apt install -y nginx`
- [ ] Install Git: `sudo apt install -y git`
- [ ] Install pnpm: `npm install -g pnpm`
- [ ] Configure firewall:
  ```bash
  sudo ufw allow 22/tcp
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw enable
  ```

#### 4.2 Deploy Application
- [ ] Clone repository to VPS:
  ```bash
  cd /var/www
  sudo git clone <your-repo-url> vault-smilo
  sudo chown -R $USER:$USER vault-smilo
  cd vault-smilo
  ```
- [ ] Install dependencies: `pnpm install`
- [ ] Copy .env file to VPS (use scp or create manually)
- [ ] Set .env permissions: `chmod 600 .env`
- [ ] Run database migrations: `cd packages/db && pnpm prisma migrate deploy`
- [ ] Generate Prisma client: `cd packages/db && pnpm prisma generate`
- [ ] Build frontend: `cd apps/web && pnpm build`

#### 4.3 Configure Nginx
- [ ] Copy nginx.conf to sites-available:
  ```bash
  sudo cp nginx.conf /etc/nginx/sites-available/vault-smilo
  ```
- [ ] Edit the config to update your domain:
  ```bash
  sudo nano /etc/nginx/sites-available/vault-smilo
  # Update server_name to your domain
  ```
- [ ] Create symbolic link:
  ```bash
  sudo ln -s /etc/nginx/sites-available/vault-smilo /etc/nginx/sites-enabled/
  ```
- [ ] Test Nginx config: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`

#### 4.4 Setup SSL Certificate
- [ ] Install Certbot:
  ```bash
  sudo apt install -y certbot python3-certbot-nginx
  ```
- [ ] Obtain SSL certificate:
  ```bash
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
  ```

#### 4.5 Start Application with PM2
- [ ] Start API:
  ```bash
  cd /var/www/vault-smilo
  pm2 start ecosystem.config.js --env production
  ```
- [ ] Save PM2 config: `pm2 save`
- [ ] Setup PM2 startup: `pm2 startup`
- [ ] Check logs: `pm2 logs vault-smilo-api`
- [ ] Check status: `pm2 status`

### 5. Verify Deployment
- [ ] Test frontend: https://yourdomain.com
- [ ] Test API health: https://yourdomain.com/health
- [ ] Test API info: https://yourdomain.com/api/v1
- [ ] Test authentication flow
- [ ] Test creating a subscription
- [ ] Check Nginx logs: `sudo tail -f /var/log/nginx/vault-smilo-error.log`
- [ ] Check PM2 logs: `pm2 logs vault-smilo-api`

### 6. Setup Backups
- [ ] Create database backup script
- [ ] Setup cron job for daily backups
- [ ] Test backup restoration

### 7. Security Hardening
- [ ] Disable root SSH login
- [ ] Setup automatic security updates
- [ ] Configure log rotation
- [ ] Review security headers

## 📝 Notes

### Error Fix Details
The 400 Bad Request error was caused by validation failures when empty strings were sent for optional URL fields (photoUrl, platformPhotoUrl). The Zod schema was expecting either a valid URL or null, but the frontend was sending empty strings.

**Solution:** Added preprocessing to convert empty strings to null before validation:
```javascript
photoUrl: z.preprocess(
  (value) => (value === '' ? null : value),
  z.string().url('Invalid URL').optional().nullable()
)
```

### Deployment Resources
- Full deployment guide: DEPLOY.md
- Deployment checklist: DEPLOYMENT_CHECKLIST.md
- PM2 config: ecosystem.config.js
- Nginx config: nginx.conf

### Troubleshooting
- **Application won't start:** `pm2 logs vault-smilo-api --lines 100`
- **Database connection failed:** Check DATABASE_URL in .env
- **Nginx 502 Bad Gateway:** Check if PM2 process is running
- **SSL issues:** `sudo certbot renew --force-renewal`
