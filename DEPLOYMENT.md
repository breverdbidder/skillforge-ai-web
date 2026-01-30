# SkillForgeAI Deployment Guide

Complete guide for deploying SkillForgeAI to production.

---

## 🚀 Quick Start (Docker)

The fastest way to deploy SkillForgeAI is using Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/breverdbidder/skillforge-ai-web.git
cd skillforge-ai-web

# 2. Create environment file
cp .env.example .env
# Edit .env with your configuration

# 3. Start services
docker-compose up -d

# 4. Run migrations
docker-compose exec web pnpm db:push

# 5. Access the application
open http://localhost:3000
```

---

## 📋 Prerequisites

- **Node.js** 22+ (for local development)
- **PostgreSQL** 16+ (or use Docker)
- **Redis** 7+ (optional, for session storage)
- **Docker** & **Docker Compose** (recommended)
- **Domain name** (for production)
- **SSL certificate** (for HTTPS)

---

## 🔧 Environment Configuration

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# OAuth (configure your provider)
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_CALLBACK_URL=https://yourdomain.com/api/oauth/callback

# Session
SESSION_SECRET=generate_random_32_char_string
```

### Optional Variables

```bash
# Redis (recommended for production)
REDIS_URL=redis://localhost:6379

# File Storage (AWS S3)
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=your_key
S3_SECRET_ACCESS_KEY=your_secret

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Monitoring
SENTRY_DSN=https://...
```

---

## 🐳 Docker Deployment

### Production with Docker Compose

```bash
# Start all services (web, postgres, redis, nginx)
docker-compose --profile production up -d

# View logs
docker-compose logs -f web

# Stop services
docker-compose down

# Update to latest version
git pull origin main
docker-compose build
docker-compose up -d
```

### Docker Compose Services

- **web**: SkillForgeAI application (port 3000)
- **postgres**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)
- **nginx**: Reverse proxy (ports 80, 443) - production profile only

---

## ☁️ Cloud Provider Deployment

### AWS (EC2 + RDS + S3)

**1. Set up infrastructure:**

```bash
# Launch EC2 instance (t3.medium or larger)
# Create RDS PostgreSQL instance
# Create S3 bucket for file storage
# Configure security groups (ports 80, 443, 22)
```

**2. Install dependencies:**

```bash
# SSH into EC2
ssh ubuntu@your-ec2-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**3. Deploy application:**

```bash
# Clone repository
git clone https://github.com/breverdbidder/skillforge-ai-web.git
cd skillforge-ai-web

# Configure environment
cp .env.example .env
nano .env  # Edit with RDS and S3 credentials

# Start services
docker-compose up -d

# Run migrations
docker-compose exec web pnpm db:push
```

**4. Set up domain and SSL:**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d skillforgeai.com -d www.skillforgeai.com

# Auto-renewal is configured automatically
```

---

### DigitalOcean (Droplet + Managed PostgreSQL)

**1. Create resources:**

- Droplet (4GB RAM, 2 vCPUs minimum)
- Managed PostgreSQL database
- Spaces (S3-compatible storage)

**2. Deploy:**

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Install Docker (same as AWS)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone and configure
git clone https://github.com/breverdbidder/skillforge-ai-web.git
cd skillforge-ai-web
cp .env.example .env
nano .env  # Add Managed DB connection string

# Start services (no need for postgres in docker-compose)
docker-compose up -d web redis nginx
```

---

### Render.com

**1. Create services:**

- **Web Service**: Connect GitHub repo
- **PostgreSQL**: Managed database
- **Redis**: Managed Redis (optional)

**2. Configure Web Service:**

```yaml
# Build Command
pnpm install && pnpm build

# Start Command
node dist/index.js

# Environment Variables
DATABASE_URL: [from PostgreSQL service]
OAUTH_CLIENT_ID: [your value]
OAUTH_CLIENT_SECRET: [your value]
OAUTH_CALLBACK_URL: https://your-app.onrender.com/api/oauth/callback
SESSION_SECRET: [generate random]
```

**3. Run migrations:**

```bash
# From Render dashboard, open shell and run:
pnpm db:push
```

---

### Railway

**1. Deploy from GitHub:**

- Connect repository
- Railway auto-detects Node.js
- Add PostgreSQL plugin

**2. Configure environment variables:**

```bash
DATABASE_URL: ${{Postgres.DATABASE_URL}}
OAUTH_CLIENT_ID: your_value
OAUTH_CLIENT_SECRET: your_value
OAUTH_CALLBACK_URL: https://${{RAILWAY_PUBLIC_DOMAIN}}/api/oauth/callback
SESSION_SECRET: generate_random
```

**3. Run migrations:**

```bash
# Railway CLI
railway run pnpm db:push
```

---

### Fly.io

**1. Install Fly CLI:**

```bash
curl -L https://fly.io/install.sh | sh
```

**2. Launch app:**

```bash
fly launch --name skillforgeai

# Follow prompts to:
# - Create Postgres cluster
# - Set region
# - Configure resources
```

**3. Set secrets:**

```bash
fly secrets set \
  OAUTH_CLIENT_ID=your_value \
  OAUTH_CLIENT_SECRET=your_value \
  SESSION_SECRET=your_random_secret
```

**4. Deploy:**

```bash
fly deploy
```

---

## 🗄️ Database Migrations

### Initial Setup

```bash
# Generate migration
pnpm drizzle-kit generate

# Apply migration
pnpm drizzle-kit migrate
```

### Schema Changes

```bash
# 1. Update drizzle/schema.ts
# 2. Generate migration
pnpm drizzle-kit generate

# 3. Review migration in drizzle/migrations/
# 4. Apply migration
pnpm drizzle-kit migrate

# Or use shortcut
pnpm db:push
```

---

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong SESSION_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure CSP headers
- [ ] Set up monitoring (Sentry, DataDog, etc.)
- [ ] Enable database backups
- [ ] Restrict database access (whitelist IPs)
- [ ] Use environment variables (never commit secrets)
- [ ] Enable 2FA for admin accounts

---

## 📊 Monitoring & Logging

### Application Logs

```bash
# Docker
docker-compose logs -f web

# PM2 (if using PM2)
pm2 logs skillforgeai

# System logs
tail -f /var/log/skillforgeai/app.log
```

### Health Checks

```bash
# Application health
curl http://localhost:3000/health

# Database connection
curl http://localhost:3000/api/health/db

# Redis connection
curl http://localhost:3000/api/health/redis
```

### Monitoring Tools

- **Sentry**: Error tracking
- **DataDog**: APM and infrastructure monitoring
- **Grafana**: Custom dashboards
- **Prometheus**: Metrics collection
- **Uptime Robot**: Uptime monitoring

---

## 🔄 Backup & Recovery

### Database Backups

```bash
# Manual backup
docker-compose exec postgres pg_dump -U skillforgeai skillforgeai > backup.sql

# Automated daily backups (cron)
0 2 * * * docker-compose exec postgres pg_dump -U skillforgeai skillforgeai > /backups/skillforgeai-$(date +\%Y\%m\%d).sql
```

### Restore from Backup

```bash
# Stop application
docker-compose stop web

# Restore database
docker-compose exec -T postgres psql -U skillforgeai skillforgeai < backup.sql

# Start application
docker-compose start web
```

---

## 🚦 Performance Optimization

### Database

- Enable connection pooling
- Add indexes for frequent queries
- Use read replicas for analytics
- Configure `pg_stat_statements` for query analysis

### Application

- Enable Redis for session storage
- Configure CDN for static assets
- Enable gzip compression
- Use PM2 cluster mode (multi-core)

### Frontend

- Enable service worker caching
- Optimize images (WebP format)
- Code splitting
- Lazy loading

---

## 🔧 Troubleshooting

### Application won't start

```bash
# Check logs
docker-compose logs web

# Verify environment variables
docker-compose exec web env | grep DATABASE_URL

# Test database connection
docker-compose exec web node -e "require('./dist/server/db').testConnection()"
```

### Database connection errors

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U skillforgeai -d skillforgeai -c "SELECT 1"

# Check DATABASE_URL format
postgresql://user:password@host:5432/database
```

### OAuth errors

```bash
# Verify callback URL matches OAuth provider
echo $OAUTH_CALLBACK_URL

# Check OAuth credentials
# - Client ID and Secret are correct
# - Callback URL is whitelisted in OAuth provider
```

---

## 📞 Support

- **GitHub Issues**: https://github.com/breverdbidder/skillforge-ai-web/issues
- **Documentation**: https://skillforgeai.com/docs
- **Email**: support@skillforgeai.com

---

## 📝 License

MIT License - see LICENSE file for details

---

*Last Updated: 2026-01-30*
