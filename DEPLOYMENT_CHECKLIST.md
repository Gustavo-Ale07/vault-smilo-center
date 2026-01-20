# Deployment Checklist - Vault Smilo Center

## Prerequisites
- [ ] VPS with Ubuntu 20.04+ or similar Linux distribution
- [ ] Domain name configured and pointing to VPS IP
- [ ] SSH access to VPS
- [ ] PostgreSQL database (can be on VPS or external service like Supabase, Railway, etc.)
- [ ] Clerk account with application configured
- [ ] Node.js 18+ and npm/pnpm installed on VPS

## 1. Server Setup

### 1.1 System Updates
```bash
sudo apt update && sudo apt upgrade -y
```
- [ ] Update system packages

### 1.2 Install Required Software
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git

# Install pnpm
npm install -g pnpm
```
- [ ] Install Node.js 18+
- [ ] Install PM2 globally
- [ ] Install Nginx
- [ ] Install Git
- [ ] Install pnpm

### 1.3 Configure Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```
- [ ] Configure UFW firewall

## 2. Application Setup

### 2.1 Clone Repository
```bash
cd /var/www
sudo git clone <your-repo-url> vault-smilo
sudo chown -R $USER:$USER vault-smilo
cd vault-smilo
```
- [ ] Clone repository to /var/www/vault-smilo
- [ ] Set proper ownership

### 2.2 Install Dependencies
```bash
pnpm install
```
- [ ] Install all dependencies

### 2.3 Environment Configuration
```bash
cp .env.example .env
nano .env
```
- [ ] Copy .env.example to .env
- [ ] Configure DATABASE_URL
- [ ] Configure CLERK_SECRET_KEY
- [ ] Configure CLERK_JWT_KEY
- [ ] Configure ENCRYPTION_KEY_BASE64 (use `node generate-key.js`)
- [ ] Configure CORS_ORIGIN with your domain
- [ ] Set NODE_ENV=production

### 2.4 Database Setup
```bash
cd packages/db
pnpm prisma migrate deploy
pnpm prisma generate
```
- [ ] Run database migrations
- [ ] Generate Prisma client

### 2.5 Build Frontend
```bash
cd ../../apps/web
pnpm build
```
- [ ] Build React frontend

## 3. SSL Certificate Setup

### 3.1 Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```
- [ ] Install Certbot

### 3.2 Obtain SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
- [ ] Obtain SSL certificate for your domain

## 4. Nginx Configuration

### 4.1 Configure Nginx
```bash
sudo cp nginx.conf /etc/nginx/sites-available/vault-smilo
sudo ln -s /etc/nginx/sites-available/vault-smilo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
- [ ] Copy nginx.conf to sites-available
- [ ] Create symbolic link to sites-enabled
- [ ] Test Nginx configuration
- [ ] Reload Nginx

### 4.2 Update Domain in Nginx Config
```bash
sudo nano /etc/nginx/sites-available/vault-smilo
```
- [ ] Update server_name to your domain
- [ ] Update root path if needed

## 5. PM2 Configuration

### 5.1 Start Application with PM2
```bash
cd /var/www/vault-smilo
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```
- [ ] Start API with PM2
- [ ] Save PM2 configuration
- [ ] Setup PM2 startup script

### 5.2 Monitor Application
```bash
pm2 logs vault-smilo-api
pm2 status
```
- [ ] Check application logs
- [ ] Verify application is running

## 6. Security Hardening

### 6.1 File Permissions
```bash
sudo chmod 600 /var/www/vault-smilo/.env
sudo chmod -R 755 /var/www/vault-smilo
```
- [ ] Set .env file permissions to 600
- [ ] Set proper directory permissions

### 6.2 Disable Root SSH Login
```bash
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd
```
- [ ] Disable root SSH login

### 6.3 Configure Automatic Security Updates
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```
- [ ] Install unattended-upgrades
- [ ] Configure automatic security updates

## 7. Monitoring & Logging

### 7.1 Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/vault-smilo
```
Content:
```
/var/www/vault-smilo/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```
- [ ] Configure log rotation for application logs

### 7.2 Monitor Nginx Logs
```bash
sudo tail -f /var/log/nginx/vault-smilo-access.log
sudo tail -f /var/log/nginx/vault-smilo-error.log
```
- [ ] Monitor access logs
- [ ] Monitor error logs

## 8. Testing

### 8.1 Test Application
- [ ] Test frontend loads at https://yourdomain.com
- [ ] Test API health endpoint: https://yourdomain.com/health
- [ ] Test API info endpoint: https://yourdomain.com/api/v1
- [ ] Test authentication flow
- [ ] Test creating a transaction
- [ ] Test encryption/decryption
- [ ] Test rate limiting (make multiple rapid requests)

### 8.2 Test SSL Certificate
```bash
sudo certbot renew --dry-run
```
- [ ] Test SSL certificate renewal

## 9. Backup Strategy

### 9.1 Database Backup
```bash
# Create backup script
nano /var/www/vault-smilo/backup-db.sh
```
Content:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/www/vault-smilo/backups"
mkdir -p $BACKUP_DIR

# Backup database
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

```bash
chmod +x /var/www/vault-smilo/backup-db.sh
```

- [ ] Create database backup script
- [ ] Set up cron job for daily backups:
  ```bash
  crontab -e
  # Add: 0 2 * * * /var/www/vault-smilo/backup-db.sh
  ```

### 9.2 Application Backup
- [ ] Set up Git repository backup
- [ ] Backup .env file securely
- [ ] Document backup restoration process

## 10. Post-Deployment

### 10.1 Performance Optimization
- [ ] Enable Nginx gzip compression
- [ ] Configure browser caching headers
- [ ] Optimize database queries if needed
- [ ] Monitor resource usage

### 10.2 Documentation
- [ ] Document all credentials securely
- [ ] Document deployment process
- [ ] Document troubleshooting steps
- [ ] Create runbook for common issues

### 10.3 Maintenance
- [ ] Set up monitoring alerts (optional: UptimeRobot, Pingdom, etc.)
- [ ] Schedule regular security updates
- [ ] Plan for scaling if needed
- [ ] Document rollback procedure

## Troubleshooting

### Common Issues

**Application won't start:**
```bash
pm2 logs vault-smilo-api --lines 100
```

**Database connection failed:**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running
- Check firewall rules

**Nginx 502 Bad Gateway:**
- Check if PM2 process is running: `pm2 status`
- Check if backend is listening on port 3001
- Check Nginx error logs

**SSL Certificate issues:**
```bash
sudo certbot renew --force-renewal
```

**Rate limiting too strict:**
- Adjust rate limit values in .env
- Restart PM2: `pm2 restart vault-smilo-api`

## Emergency Contacts
- [ ] Document emergency contacts
- [ ] Document escalation procedures
- [ ] Document disaster recovery plan

---

## Deployment Verification Checklist

After completing deployment, verify:

- [ ] Frontend loads correctly at https://yourdomain.com
- [ ] API responds at https://yourdomain.com/api/v1
- [ ] Health check returns 200 OK
- [ ] Authentication works with Clerk
- [ ] Database operations work correctly
- [ ] SSL certificate is valid
- [ ] Security headers are present
- [ ] Rate limiting is active
- [ ] Logs are being written
- [ ] PM2 process is running and stable
- [ ] Nginx is serving static files correctly
- [ ] CORS is configured correctly
- [ ] Environment variables are set correctly
- [ ] Backup system is working

---

## Notes

- Keep your .env file secure and never commit it to version control
- Regularly update dependencies: `pnpm update`
- Monitor security advisories for dependencies
- Keep backups of your database and configuration
- Test disaster recovery procedures periodically
- Document any custom configurations or changes
