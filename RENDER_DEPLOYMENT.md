# Render.com Deployment Quick Start

## Prerequisites

- ✅ GitHub repository created: https://github.com/breverdbidder/skillforge-ai-web
- ✅ Google OAuth credentials configured (see OAUTH_SETUP.md)
- ✅ GitHub OAuth credentials configured (see OAUTH_SETUP.md)
- ✅ Render.com account: https://dashboard.render.com/

---

## Deployment Steps (20 minutes)

### Step 1: Create PostgreSQL Database

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com/
   - Click "New +" button in top right
   - Select "PostgreSQL"

2. **Configure Database**
   - **Name:** `skillforge-ai-db`
   - **Database:** `skillforge_ai`
   - **User:** `skillforge_user`
   - **Region:** Oregon (US West) - or closest to your users
   - **PostgreSQL Version:** 16 (latest)
   - **Plan:** Starter ($7/month) or Free (limited)

3. **Create Database**
   - Click "Create Database"
   - Wait 2-3 minutes for provisioning
   - Database will show "Available" status when ready

4. **Copy Connection String**
   - Go to database "Info" tab
   - Find "External Database URL"
   - Click "Copy" button
   - Format: `postgresql://user:password@host:port/database`
   - **Save this** - you'll need it in Step 3

---

### Step 2: Create Web Service

1. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

2. **Connect GitHub Repository**
   - Click "Connect account" if not connected
   - Authorize Render to access GitHub
   - Select repository: `breverdbidder/skillforge-ai-web`
   - Click "Connect"

3. **Configure Service**
   - **Name:** `skillforge-ai`
   - **Region:** Oregon (US West) - same as database
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Runtime:** Node
   - **Build Command:** `pnpm install && pnpm db:push`
   - **Start Command:** `pnpm start`
   - **Plan:** Starter ($7/month) or Free (limited)

---

### Step 3: Configure Environment Variables

Click "Advanced" → Scroll to "Environment Variables" section.

Add the following variables one by one:

#### Database Configuration
```
DATABASE_URL = postgresql://skillforge_user:password@host:port/skillforge_ai
```
*(Paste the connection string from Step 1)*

#### Authentication Secrets
Generate two random secrets using this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add them as:
```
JWT_SECRET = [generated-secret-1]
SESSION_SECRET = [generated-secret-2]
```

#### Google OAuth
```
GOOGLE_CLIENT_ID = 1234567890-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = GOCSPX-abcdefghijklmnopqrstuvwx
GOOGLE_CALLBACK_URL = https://skillforge-ai.onrender.com/api/auth/google/callback
```
*(Replace with your actual Google OAuth credentials from OAUTH_SETUP.md)*

#### GitHub OAuth
```
GITHUB_CLIENT_ID = Iv1.1234567890abcdef
GITHUB_CLIENT_SECRET = 1234567890abcdef1234567890abcdef12345678
GITHUB_CALLBACK_URL = https://skillforge-ai.onrender.com/api/auth/github/callback
```
*(Replace with your actual GitHub OAuth credentials from OAUTH_SETUP.md)*

#### Application Settings
```
NODE_ENV = production
PORT = 3000
FRONTEND_URL = https://skillforge-ai.onrender.com
```

---

### Step 4: Deploy

1. **Review Configuration**
   - Scroll to bottom of page
   - Review all settings

2. **Create Web Service**
   - Click "Create Web Service" button
   - Deployment will start automatically

3. **Monitor Deployment**
   - You'll be redirected to the service dashboard
   - Click "Logs" tab to watch deployment progress
   - Deployment typically takes 5-10 minutes

4. **Wait for "Live" Status**
   - Service status will change from "Building" → "Deploying" → "Live"
   - Once "Live", your app is ready!

---

### Step 5: Update OAuth Redirect URIs

Now that you have your Render URL, update OAuth settings:

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   ```
   https://skillforge-ai.onrender.com/api/auth/google/callback
   ```
5. Click "Save"

#### GitHub OAuth
1. Go to [GitHub OAuth Apps](https://github.com/settings/developers)
2. Click on your "SkillForge AI" app
3. Update "Authorization callback URL" to:
   ```
   https://skillforge-ai.onrender.com/api/auth/github/callback
   ```
4. Click "Update application"

---

### Step 6: Test Your Deployment

1. **Visit Your App**
   - URL: https://skillforge-ai.onrender.com
   - Should see SkillForge AI login page

2. **Test Email/Password Authentication**
   - Click "Email/Password" tab
   - Register a new account
   - Verify you can log in

3. **Test Google OAuth**
   - Click "Sign in with Google"
   - Should redirect to Google
   - Authorize the app
   - Should redirect back to dashboard

4. **Test GitHub OAuth**
   - Log out
   - Click "Sign in with GitHub"
   - Should redirect to GitHub
   - Authorize the app
   - Should redirect back to dashboard

5. **Verify Database**
   - Check that user was created
   - Go to Render Dashboard → Database → "Connect"
   - Use provided connection command to verify data

---

## Post-Deployment Configuration

### Enable Auto-Deploy

1. Go to your web service settings
2. Scroll to "Auto-Deploy"
3. Toggle "Auto-Deploy" to ON
4. Now every push to `main` branch will trigger deployment

### Configure Custom Domain (Optional)

1. **Add Domain in Render**
   - Go to service settings
   - Click "Custom Domains"
   - Click "Add Custom Domain"
   - Enter: `skillforge.yourdomain.com`

2. **Update DNS**
   - Add CNAME record in your DNS provider:
     - **Name:** `skillforge`
     - **Value:** `skillforge-ai.onrender.com`
     - **TTL:** 3600

3. **Update Environment Variables**
   - Change `FRONTEND_URL` to your custom domain
   - Update OAuth callback URLs

4. **Update OAuth Redirect URIs**
   - Update Google OAuth redirect URI
   - Update GitHub OAuth callback URL

### Enable Health Checks

1. Go to service settings
2. Scroll to "Health Check Path"
3. Set to: `/` (or create a `/health` endpoint)
4. Save changes

---

## Monitoring and Maintenance

### View Logs

1. Go to your service dashboard
2. Click "Logs" tab
3. Monitor for errors or warnings
4. Use search to filter logs

### View Metrics

1. Click "Metrics" tab
2. Monitor:
   - CPU usage
   - Memory usage
   - Response times
   - Request count

### Database Backups

Render automatically backs up your database:
- **Free Plan:** No backups
- **Starter Plan:** Daily backups (7-day retention)
- **Standard Plan:** Daily backups (30-day retention)

To create manual backup:
1. Go to database dashboard
2. Click "Backups" tab
3. Click "Create Backup"

---

## Troubleshooting

### Build Failed

**Error: `pnpm: command not found`**
- Render should auto-detect pnpm from package.json
- If not, change build command to: `npm install -g pnpm && pnpm install && pnpm db:push`

**Error: `Database connection failed`**
- Verify DATABASE_URL is correct
- Check database is "Available" status
- Ensure database and web service are in same region

### Deployment Failed

**Error: `Port already in use`**
- Don't set PORT in code - Render provides it automatically
- Remove any hardcoded port numbers

**Error: `Module not found`**
- Ensure all dependencies are in package.json
- Clear build cache and redeploy

### OAuth Not Working

**Error: `redirect_uri_mismatch`**
- Verify callback URLs match exactly in OAuth provider settings
- Check GOOGLE_CALLBACK_URL and GITHUB_CALLBACK_URL environment variables

**Error: `Session not persisting`**
- Verify JWT_SECRET is set
- Check cookies are enabled
- Ensure SESSION_SECRET is configured

### Database Issues

**Error: `Connection timeout`**
- Database may be sleeping (free tier)
- Wait 30 seconds and try again
- Consider upgrading to paid plan

**Error: `Too many connections`**
- Free tier has connection limits
- Upgrade to Starter plan for more connections

---

## Scaling

### Horizontal Scaling

1. Go to service settings
2. Scroll to "Scaling"
3. Increase "Instance Count"
4. Click "Save Changes"

### Vertical Scaling

1. Go to service settings
2. Change "Plan" to higher tier:
   - Starter: 512 MB RAM
   - Standard: 2 GB RAM
   - Pro: 4 GB RAM

### Database Scaling

1. Go to database settings
2. Change plan to higher tier
3. Render will handle migration automatically

---

## Cost Estimate

### Minimal Setup (Free Tier)
- Web Service: Free (limited hours)
- Database: Free (limited storage)
- **Total: $0/month**

### Production Setup (Recommended)
- Web Service: Starter ($7/month)
- Database: Starter ($7/month)
- **Total: $14/month**

### High-Traffic Setup
- Web Service: Standard ($25/month)
- Database: Standard ($20/month)
- **Total: $45/month**

---

## Security Checklist

- [ ] All secrets are in environment variables
- [ ] DATABASE_URL uses SSL connection
- [ ] OAuth redirect URIs are restricted
- [ ] JWT_SECRET is at least 32 characters
- [ ] Auto-deploy is enabled
- [ ] Health checks are configured
- [ ] Database backups are enabled
- [ ] Logs are monitored regularly

---

## Next Steps

After successful deployment:

1. ✅ Test all authentication methods
2. ✅ Verify database connectivity
3. ✅ Monitor logs for errors
4. ✅ Set up custom domain (optional)
5. ✅ Configure monitoring alerts
6. ✅ Document any custom configurations

---

## Support

- **Render Documentation:** https://render.com/docs
- **Render Community:** https://community.render.com/
- **SkillForge AI Issues:** https://github.com/breverdbidder/skillforge-ai-web/issues

---

## Quick Reference

### Essential URLs

- **Render Dashboard:** https://dashboard.render.com/
- **Your App:** https://skillforge-ai.onrender.com
- **GitHub Repo:** https://github.com/breverdbidder/skillforge-ai-web

### Essential Commands

```bash
# View logs
render logs -s skillforge-ai

# Trigger manual deploy
render deploy -s skillforge-ai

# Open shell
render shell -s skillforge-ai

# View database
render psql -d skillforge-ai-db
```

---

*Last Updated: January 29, 2026*
