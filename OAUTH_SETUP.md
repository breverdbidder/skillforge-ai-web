# OAuth Setup Quick Start Guide

## Overview

This guide provides step-by-step instructions to configure Google and GitHub OAuth for SkillForge AI. Complete both setups before deploying to production.

---

## Google OAuth Setup (15 minutes)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" dropdown → "New Project"
3. Enter project details:
   - **Project name:** SkillForge AI
   - **Organization:** (leave default or select your org)
4. Click "Create"
5. Wait for project creation (usually 10-30 seconds)

### Step 2: Enable Google+ API

1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on "Google+ API" from results
4. Click "Enable" button
5. Wait for API to be enabled

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select user type:
   - **External** (for public access)
   - **Internal** (if using Google Workspace)
3. Click "Create"
4. Fill in App information:
   - **App name:** SkillForge AI
   - **User support email:** your-email@example.com
   - **App logo:** (optional, upload if you have one)
5. Fill in App domain (optional for testing):
   - **Application home page:** https://your-domain.com
   - **Application privacy policy:** https://your-domain.com/privacy
   - **Application terms of service:** https://your-domain.com/terms
6. Fill in Developer contact information:
   - **Email addresses:** your-email@example.com
7. Click "Save and Continue"

8. **Scopes** (Step 2):
   - Click "Add or Remove Scopes"
   - Select these scopes:
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - Click "Update"
   - Click "Save and Continue"

9. **Test users** (Step 3):
   - Click "Add Users"
   - Add your email addresses for testing
   - Click "Add"
   - Click "Save and Continue"

10. **Summary** (Step 4):
    - Review your settings
    - Click "Back to Dashboard"

### Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. If prompted, configure consent screen (already done above)
4. Select application type:
   - **Application type:** Web application
5. Enter name:
   - **Name:** SkillForge AI Web
6. Add Authorized JavaScript origins:
   - Click "Add URI"
   - For local testing: `http://localhost:3000`
   - For production: `https://your-app-name.onrender.com`
   - For custom domain: `https://your-domain.com`
7. Add Authorized redirect URIs:
   - Click "Add URI"
   - For local testing: `http://localhost:3000/api/auth/google/callback`
   - For production: `https://your-app-name.onrender.com/api/auth/google/callback`
   - For custom domain: `https://your-domain.com/api/auth/google/callback`
8. Click "Create"

### Step 5: Save Credentials

A modal will appear with your credentials:

```
Client ID: 1234567890-abcdefghijklmnop.apps.googleusercontent.com
Client Secret: GOCSPX-abcdefghijklmnopqrstuvwx
```

**⚠️ IMPORTANT:** Copy both values immediately. You'll need them for environment variables.

### Step 6: Set Environment Variables

Add these to your `.env` file or Render.com environment variables:

```env
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwx
GOOGLE_CALLBACK_URL=https://your-app-name.onrender.com/api/auth/google/callback
```

---

## GitHub OAuth Setup (10 minutes)

### Step 1: Register OAuth App

1. Go to [GitHub Settings](https://github.com/settings/profile)
2. In left sidebar, scroll down to "Developer settings"
3. Click "OAuth Apps"
4. Click "New OAuth App" button

### Step 2: Configure Application

Fill in the application details:

1. **Application name:** SkillForge AI
2. **Homepage URL:** 
   - For local testing: `http://localhost:3000`
   - For production: `https://your-app-name.onrender.com`
   - For custom domain: `https://your-domain.com`
3. **Application description:** (optional)
   ```
   SkillForge AI - Multi-provider authentication platform for ClawdBot skills management
   ```
4. **Authorization callback URL:**
   - For local testing: `http://localhost:3000/api/auth/github/callback`
   - For production: `https://your-app-name.onrender.com/api/auth/github/callback`
   - For custom domain: `https://your-domain.com/api/auth/github/callback`
5. **Enable Device Flow:** (leave unchecked)

6. Click "Register application"

### Step 3: Generate Client Secret

1. After registration, you'll see your **Client ID** displayed
2. Click "Generate a new client secret"
3. Confirm your password if prompted
4. **⚠️ IMPORTANT:** Copy the client secret immediately - it won't be shown again!

Your credentials will look like:

```
Client ID: Iv1.1234567890abcdef
Client Secret: 1234567890abcdef1234567890abcdef12345678
```

### Step 4: Set Environment Variables

Add these to your `.env` file or Render.com environment variables:

```env
GITHUB_CLIENT_ID=Iv1.1234567890abcdef
GITHUB_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
GITHUB_CALLBACK_URL=https://your-app-name.onrender.com/api/auth/github/callback
```

---

## Complete Environment Variables Template

Create a `.env` file in your project root with all required variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication Secrets
JWT_SECRET=your-random-secret-key-min-32-chars
SESSION_SECRET=another-random-secret-key-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwx
GOOGLE_CALLBACK_URL=https://your-app-name.onrender.com/api/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.1234567890abcdef
GITHUB_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
GITHUB_CALLBACK_URL=https://your-app-name.onrender.com/api/auth/github/callback

# Application
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-app-name.onrender.com
```

---

## Generate Secure Secrets

To generate secure random secrets for JWT_SECRET and SESSION_SECRET:

### Using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using OpenSSL:
```bash
openssl rand -hex 32
```

### Using Python:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Run the command twice to generate two different secrets.

---

## Testing OAuth Configuration

### Local Testing

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Visit `http://localhost:3000/login`

3. Click "Sign in with Google" or "Sign in with GitHub"

4. You should be redirected to the OAuth provider

5. After authorization, you should be redirected back to your app

### Production Testing

1. Deploy to Render.com (see DEPLOYMENT_GUIDE.md)

2. Visit your production URL

3. Test all three authentication methods:
   - Email/Password registration
   - Google OAuth
   - GitHub OAuth

---

## Troubleshooting

### Google OAuth Errors

**Error: `redirect_uri_mismatch`**
- **Cause:** Callback URL doesn't match configured redirect URI
- **Solution:** Ensure GOOGLE_CALLBACK_URL exactly matches the URI in Google Cloud Console

**Error: `access_denied`**
- **Cause:** User denied permission or app not verified
- **Solution:** Add user to test users list in OAuth consent screen

**Error: `invalid_client`**
- **Cause:** Incorrect Client ID or Client Secret
- **Solution:** Verify credentials match exactly (no extra spaces)

### GitHub OAuth Errors

**Error: `redirect_uri_mismatch`**
- **Cause:** Callback URL doesn't match configured callback
- **Solution:** Ensure GITHUB_CALLBACK_URL exactly matches the callback URL in GitHub OAuth App settings

**Error: `bad_verification_code`**
- **Cause:** OAuth flow interrupted or expired
- **Solution:** Try authentication again

**Error: `incorrect_client_credentials`**
- **Cause:** Invalid Client ID or Client Secret
- **Solution:** Regenerate client secret and update environment variables

### General Issues

**OAuth buttons don't work**
- Check browser console for JavaScript errors
- Verify environment variables are loaded
- Ensure Passport.js is properly initialized

**Session not persisting**
- Check JWT_SECRET is set
- Verify cookies are enabled in browser
- Check SESSION_SECRET is configured

**Database connection errors**
- Verify DATABASE_URL format
- Ensure database is running and accessible
- Check database credentials

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables for all secrets

2. **Use strong secrets**
   - Minimum 32 characters for JWT_SECRET
   - Use cryptographically secure random generators

3. **Restrict OAuth redirect URIs**
   - Only add URIs you control
   - Use HTTPS in production
   - Don't use wildcards

4. **Rotate secrets regularly**
   - Change JWT_SECRET every 90 days
   - Regenerate OAuth secrets if compromised

5. **Monitor OAuth usage**
   - Check Google Cloud Console quotas
   - Review GitHub OAuth app access logs

---

## Next Steps

After completing OAuth setup:

1. ✅ Test authentication locally
2. ✅ Deploy to Render.com (see DEPLOYMENT_GUIDE.md)
3. ✅ Update OAuth redirect URIs with production URL
4. ✅ Test all authentication methods in production
5. ✅ Monitor logs for any errors

---

## Support

For OAuth setup support:
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- GitHub OAuth: https://docs.github.com/en/apps/oauth-apps
- SkillForge AI: https://github.com/breverdbidder/skillforge-ai-web/issues

---

*Last Updated: January 29, 2026*
