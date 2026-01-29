# SkillForge AI - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying SkillForge AI to Render.com with full OAuth configuration and production setup.

---

## Prerequisites

- GitHub account
- Render.com account
- Google Cloud Console account (for Google OAuth)
- GitHub Developer account (for GitHub OAuth)
- Domain name (optional, for custom domain)

---

## Part 1: OAuth Configuration

### Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "Select a project" → "New Project"
   - Enter project name: "SkillForge AI"
   - Click "Create"

2. **Enable Google+ API**
   - In the project dashboard, go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" user type
   - Click "Create"
   - Fill in required fields:
     - App name: SkillForge AI
     - User support email: your-email@example.com
     - Developer contact: your-email@example.com
   - Click "Save and Continue"
   - Skip scopes (default is fine)
   - Add test users if needed
   - Click "Save and Continue"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "SkillForge AI Web"
   - Authorized JavaScript origins:
     - `https://your-app-name.onrender.com`
     - `https://your-custom-domain.com` (if using custom domain)
   - Authorized redirect URIs:
     - `https://your-app-name.onrender.com/api/auth/google/callback`
     - `https://your-custom-domain.com/api/auth/google/callback`
   - Click "Create"
   - **Save the Client ID and Client Secret** - you'll need these later

### GitHub OAuth Setup

1. **Register New OAuth App**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in application details:
     - Application name: SkillForge AI
     - Homepage URL: `https://your-app-name.onrender.com`
     - Authorization callback URL: `https://your-app-name.onrender.com/api/auth/github/callback`
   - Click "Register application"

2. **Generate Client Secret**
   - Click "Generate a new client secret"
   - **Save the Client ID and Client Secret** - you'll need these later

---

## Part 2: GitHub Repository Setup

1. **Push Code to GitHub**
   ```bash
   cd /path/to/skillforge-web
   git init
   git add .
   git commit -m "Initial commit: SkillForge AI complete platform"
   git branch -M main
   git remote add origin https://github.com/your-username/skillforge-ai-web.git
   git push -u origin main
   ```

2. **Verify Repository**
   - Go to your GitHub repository
   - Ensure all files are present
   - Check that `.env` is NOT committed (should be in `.gitignore`)

---

## Part 3: Database Setup

### Option A: Render PostgreSQL (Recommended)

1. **Create PostgreSQL Database**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "PostgreSQL"
   - Fill in details:
     - Name: skillforge-ai-db
     - Database: skillforge_ai
     - User: skillforge_user
     - Region: Choose closest to your users
     - Plan: Select appropriate plan (Free tier available)
   - Click "Create Database"

2. **Get Connection String**
   - Once database is created, go to "Info" tab
   - Copy "External Database URL"
   - Format: `postgresql://user:password@host:port/database`

### Option B: External PostgreSQL

You can use any PostgreSQL provider:
- Supabase
- Railway
- Neon
- AWS RDS
- DigitalOcean Managed Databases

---

## Part 4: Render.com Deployment

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `skillforge-ai-web` repository

2. **Configure Service**
   - **Name:** `skillforge-ai`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** Leave empty (or `.` if needed)
   - **Runtime:** `Node`
   - **Build Command:** `pnpm install && pnpm db:push`
   - **Start Command:** `pnpm start`
   - **Plan:** Select appropriate plan

3. **Environment Variables**

   Click "Advanced" → "Add Environment Variable" and add the following:

   **Database:**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

   **Authentication:**
   ```
   JWT_SECRET=your-random-secret-key-min-32-chars
   SESSION_SECRET=another-random-secret-key-min-32-chars
   ```

   **Google OAuth:**
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=https://your-app-name.onrender.com/api/auth/google/callback
   ```

   **GitHub OAuth:**
   ```
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=https://your-app-name.onrender.com/api/auth/github/callback
   ```

   **Application:**
   ```
   NODE_ENV=production
   PORT=3000
   FRONTEND_URL=https://your-app-name.onrender.com
   ```

   **Optional - GitHub Integration:**
   ```
   GITHUB_TOKEN=your-personal-access-token
   GITHUB_WEBHOOK_SECRET=your-webhook-secret
   ```

4. **Generate Secrets**

   To generate secure random secrets, run:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Monitor the deployment logs for any errors

---

## Part 5: Post-Deployment Configuration

### 1. Database Migration

After deployment, verify database tables are created:
```bash
# SSH into Render shell (if available) or use Render's shell
pnpm db:push
```

### 2. Update OAuth Redirect URIs

Once you have your Render URL:

**Google:**
- Go back to Google Cloud Console
- Update authorized redirect URIs with actual Render URL

**GitHub:**
- Go back to GitHub OAuth App settings
- Update authorization callback URL with actual Render URL

### 3. Test Authentication

1. Visit your deployed application
2. Click "Sign in with Google" - should redirect to Google
3. Click "Sign in with GitHub" - should redirect to GitHub
4. Try email/password registration and login

### 4. Seed Initial Data (Optional)

If you want to seed the database with sample skills:
```bash
# Create a seed script or manually insert via database client
```

---

## Part 6: Custom Domain Setup (Optional)

1. **Add Custom Domain in Render**
   - Go to your web service settings
   - Click "Custom Domains"
   - Click "Add Custom Domain"
   - Enter your domain: `skillforge.yourdomain.com`

2. **Configure DNS**
   - Add CNAME record in your DNS provider:
     - Name: `skillforge`
     - Value: `your-app-name.onrender.com`
     - TTL: 3600

3. **Update OAuth Redirect URIs**
   - Update Google OAuth authorized redirect URIs
   - Update GitHub OAuth callback URL
   - Update environment variables:
     ```
     GOOGLE_CALLBACK_URL=https://skillforge.yourdomain.com/api/auth/google/callback
     GITHUB_CALLBACK_URL=https://skillforge.yourdomain.com/api/auth/github/callback
     FRONTEND_URL=https://skillforge.yourdomain.com
     ```

4. **SSL Certificate**
   - Render automatically provisions SSL certificates
   - Wait for certificate to be issued (usually 1-5 minutes)

---

## Part 7: Monitoring and Maintenance

### Logs

View application logs in Render Dashboard:
- Go to your web service
- Click "Logs" tab
- Monitor for errors or warnings

### Health Checks

Render automatically performs health checks. Configure custom health check:
- Go to service settings
- Set "Health Check Path" to `/api/health` (if you have a health endpoint)

### Auto-Deploy

Enable auto-deploy from GitHub:
- Go to service settings
- Enable "Auto-Deploy"
- Every push to `main` branch will trigger a new deployment

### Scaling

Adjust resources as needed:
- Go to service settings
- Change instance type
- Add more instances for horizontal scaling

---

## Part 8: Environment-Specific Configuration

### Development
```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/skillforge_dev
FRONTEND_URL=http://localhost:3000
```

### Staging
```env
NODE_ENV=staging
DATABASE_URL=postgresql://staging-host/skillforge_staging
FRONTEND_URL=https://staging.skillforge.com
```

### Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://prod-host/skillforge_prod
FRONTEND_URL=https://skillforge.com
```

---

## Part 9: Security Checklist

- [ ] All secrets are stored in environment variables (not in code)
- [ ] JWT_SECRET is at least 32 characters
- [ ] DATABASE_URL uses SSL connection
- [ ] OAuth redirect URIs are restricted to your domains
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] SQL injection prevention (using Drizzle ORM)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled

---

## Part 10: Troubleshooting

### Common Issues

**1. OAuth Redirect Mismatch**
```
Error: redirect_uri_mismatch
```
Solution: Ensure OAuth redirect URIs exactly match in provider settings and environment variables

**2. Database Connection Failed**
```
Error: Connection refused
```
Solution: Check DATABASE_URL format and ensure database is running

**3. Build Failed**
```
Error: Module not found
```
Solution: Ensure all dependencies are in `package.json` and run `pnpm install`

**4. Session Not Persisting**
```
Error: User logged out immediately
```
Solution: Check JWT_SECRET is set and cookies are enabled

**5. CORS Errors**
```
Error: CORS policy blocked
```
Solution: Configure CORS to allow your frontend domain

### Debug Mode

Enable debug logging:
```env
DEBUG=trpc:*,express:*
LOG_LEVEL=debug
```

---

## Part 11: Performance Optimization

### Database Optimization

1. **Add Indexes**
   ```sql
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_skills_category ON skills(category);
   CREATE INDEX idx_notifications_user_read ON notifications(userId, read);
   ```

2. **Connection Pooling**
   - Render PostgreSQL includes connection pooling
   - Configure max connections in DATABASE_URL if needed

### Caching

Consider adding Redis for caching:
```env
REDIS_URL=redis://your-redis-host:6379
```

### CDN

Use Render's CDN or configure Cloudflare:
- Static assets are automatically cached
- Configure cache headers for optimal performance

---

## Part 12: Backup and Recovery

### Database Backups

**Render PostgreSQL:**
- Automatic daily backups (retained for 7 days on free plan)
- Manual backups available in dashboard

**Manual Backup:**
```bash
pg_dump $DATABASE_URL > backup.sql
```

**Restore:**
```bash
psql $DATABASE_URL < backup.sql
```

### Application Backup

- Code is backed up in GitHub
- Environment variables should be documented securely
- Database schema is version controlled with Drizzle migrations

---

## Part 13: Continuous Integration/Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
      - name: Build
        run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## Support

For deployment support:
- Render Documentation: https://render.com/docs
- SkillForge AI Issues: https://github.com/breverdbidder/skillforge-ai-web/issues
- Email: support@skillforge.ai

---

## Quick Reference

### Essential URLs

- **Render Dashboard:** https://dashboard.render.com/
- **Google Cloud Console:** https://console.cloud.google.com/
- **GitHub OAuth Apps:** https://github.com/settings/developers
- **Application URL:** https://your-app-name.onrender.com

### Essential Commands

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:push

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

---

*Last Updated: January 29, 2026*
