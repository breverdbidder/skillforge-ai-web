# SkillForge AI

**Multi-Provider Authentication Platform for ClawdBot Skills Management**

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-19.x-blue.svg)](https://react.dev/)

---

## 🚀 Overview

SkillForge AI is a production-ready web platform for managing ClawdBot AI skills with enterprise-grade authentication, real-time synchronization, team collaboration, and comprehensive analytics.

### Key Features

- **🔐 Multi-Provider Authentication**
  - Gmail OAuth integration
  - GitHub OAuth integration
  - Email/password authentication with bcrypt
  - Session management with JWT

- **📚 Skills Management**
  - Browse 100+ ClawdBot skills
  - Real-time skill execution
  - Usage tracking and analytics
  - Custom skill creation

- **🔄 Synchronization Engine**
  - Automatic GitHub sync
  - Manual trigger support
  - Sync history and metrics
  - Conflict resolution

- **📊 Analytics Dashboard**
  - Skill usage statistics
  - Sync success rates
  - Performance metrics
  - Visual charts with Recharts

- **👥 Team Collaboration**
  - Role-based access control (RBAC)
  - Team invitations
  - Shared skill libraries
  - Activity tracking

- **🔔 Notification System**
  - Real-time notifications
  - Unread count badges
  - Multiple notification types
  - Mark as read/delete

- **⏰ Scheduling System**
  - Cron-based task scheduling
  - Recurring executions
  - Schedule management
  - Execution history

- **🛒 Marketplace**
  - Publish custom skills
  - Browse community skills
  - Ratings and reviews
  - Monetization support

---

## 🏗️ Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **tRPC** - Type-safe API client
- **Wouter** - Routing
- **Recharts** - Data visualization
- **shadcn/ui** - Component library

### Backend
- **Node.js** - Runtime
- **Express 4** - Web server
- **tRPC 11** - API framework
- **Passport.js** - Authentication
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database

### DevOps
- **pnpm** - Package manager
- **Vitest** - Testing framework
- **tsx** - TypeScript execution
- **GitHub Actions** - CI/CD (optional)

---

## 📋 Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/breverdbidder/skillforge-ai-web.git
cd skillforge-ai-web
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

Create `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/skillforge_ai

# Authentication
JWT_SECRET=your-random-secret-key-min-32-chars
SESSION_SECRET=another-random-secret-key-min-32-chars

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
```

### 4. Setup Database

```bash
pnpm db:push
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit http://localhost:3000

---

## 📚 Documentation

- **[OAuth Setup Guide](OAUTH_SETUP.md)** - Configure Google and GitHub OAuth
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Render.com Quick Start](RENDER_DEPLOYMENT.md)** - Deploy to Render.com in 20 minutes
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference (80+ endpoints)

---

## 🔐 Authentication Setup

### Email/Password (Built-in)

No configuration needed. Users can register and login immediately.

### Google OAuth

1. Follow [OAUTH_SETUP.md](OAUTH_SETUP.md) for detailed instructions
2. Create OAuth credentials in Google Cloud Console
3. Add credentials to `.env` file
4. Restart server

### GitHub OAuth

1. Follow [OAUTH_SETUP.md](OAUTH_SETUP.md) for detailed instructions
2. Register OAuth app in GitHub Settings
3. Add credentials to `.env` file
4. Restart server

---

## 🧪 Testing

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
```

### Test Coverage

```bash
pnpm test:coverage
```

### Current Test Suite

- ✅ 18 tests passing
- ✅ Authentication tests (6)
- ✅ Notification tests (4)
- ✅ Skills management tests (7)
- ✅ Auth logout test (1)

---

## 🏗️ Project Structure

```
skillforge-web/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── lib/           # Utilities and tRPC client
│       ├── hooks/         # Custom React hooks
│       ├── contexts/      # React contexts
│       ├── App.tsx        # Routes and layout
│       └── main.tsx       # Entry point
├── server/                # Backend Express + tRPC
│   ├── _core/            # Framework infrastructure
│   ├── auth/             # Passport.js strategies
│   ├── routers.ts        # tRPC procedures
│   ├── db.ts             # Database helpers
│   └── *.test.ts         # Test files
├── drizzle/              # Database schema and migrations
│   └── schema.ts         # Database tables
├── shared/               # Shared types and constants
├── storage/              # S3 storage helpers
├── API_DOCUMENTATION.md  # Complete API reference
├── OAUTH_SETUP.md        # OAuth configuration guide
├── DEPLOYMENT_GUIDE.md   # Full deployment guide
├── RENDER_DEPLOYMENT.md  # Render.com quick start
├── render.yaml           # Render.com configuration
└── package.json          # Dependencies and scripts
```

---

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio (database GUI)

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate test coverage report

# Code Quality
pnpm lint             # Lint code with ESLint
pnpm type-check       # Check TypeScript types
```

---

## 🚀 Deployment

### Option 1: Render.com (Recommended)

Follow [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for step-by-step instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy automatically

**Cost:** $14/month (Starter plan)

### Option 2: Manual Deployment

Follow [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions covering:
- Render.com
- Railway
- Vercel
- AWS
- DigitalOcean
- Self-hosted

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) |
| `SESSION_SECRET` | Yes | Session signing secret (min 32 chars) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | No | Google OAuth callback URL |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth client secret |
| `GITHUB_CALLBACK_URL` | No | GitHub OAuth callback URL |
| `NODE_ENV` | Yes | Environment (development/production) |
| `PORT` | No | Server port (default: 3000) |
| `FRONTEND_URL` | Yes | Frontend URL for CORS |

### Generate Secrets

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript best practices
- Use conventional commit messages
- Update documentation as needed

---

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

**Apache 2.0 License** allows:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Patent use
- ✅ Private use

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

**OAuth Redirect Mismatch**
- Verify callback URLs match exactly in OAuth provider settings
- Check environment variables are loaded correctly

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📞 Support

- **Issues:** https://github.com/breverdbidder/skillforge-ai-web/issues
- **Discussions:** https://github.com/breverdbidder/skillforge-ai-web/discussions
- **Email:** support@skillforge.ai

---

## 🎯 Roadmap

### Version 1.1 (Q2 2026)
- [ ] Real-time collaboration with WebSockets
- [ ] Advanced skill versioning
- [ ] Skill dependency management
- [ ] Enhanced marketplace features

### Version 1.2 (Q3 2026)
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] CLI tool for skill management
- [ ] GraphQL API option

### Version 2.0 (Q4 2026)
- [ ] AI-powered skill recommendations
- [ ] Automated skill testing
- [ ] Performance optimization
- [ ] Multi-language support

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **tRPC** - End-to-end type safety
- **Drizzle ORM** - Lightweight and fast ORM
- **Tailwind CSS** - Utility-first CSS framework
- **Passport.js** - Authentication middleware
- **Render.com** - Simple deployment platform

---

## 📊 Project Stats

- **Lines of Code:** ~15,000
- **Files:** 275+
- **Tests:** 18 (100% passing)
- **API Endpoints:** 80+
- **Database Tables:** 12
- **UI Components:** 50+

---

## 🌟 Star History

If you find this project useful, please consider giving it a star on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=breverdbidder/skillforge-ai-web&type=Date)](https://star-history.com/#breverdbidder/skillforge-ai-web&Date)

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Skills Library
![Skills Library](docs/screenshots/skills-library.png)

### Authentication
![Login](docs/screenshots/login.png)

### Analytics
![Analytics](docs/screenshots/analytics.png)

---

**Built with ❤️ by the SkillForge AI Team**

*Last Updated: January 29, 2026*
