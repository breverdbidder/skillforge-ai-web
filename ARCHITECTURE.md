# SkillForge AI - Architecture Overview

## System Architecture

The application follows a modern three-tier architecture with clear separation of concerns between the presentation layer (React frontend), business logic layer (tRPC API), and data layer (PostgreSQL database). The authentication system uses Passport.js with multiple strategies (Google OAuth, GitHub OAuth, and local email/password), while the API layer leverages tRPC for end-to-end type safety between frontend and backend.

## Technology Stack

### Frontend Technologies

The client application is built with **React 19**, utilizing the latest concurrent features and improved performance characteristics. **TypeScript 5.x** provides comprehensive type safety across the codebase, catching errors at compile time rather than runtime. **Tailwind CSS 4** handles all styling with its utility-first approach and just-in-time compilation. **tRPC 11** enables type-safe API calls without code generation, ensuring frontend and backend types stay synchronized. **Wouter** provides lightweight routing at only 2KB, while **Recharts** delivers composable charting capabilities. The **shadcn/ui** component library offers accessible, customizable UI components.

### Backend Technologies

The server runs on **Node.js 18+** LTS for stability and long-term support. **Express 4** serves as the web framework, handling HTTP requests and middleware. **tRPC 11** creates the type-safe API layer, eliminating the need for REST or GraphQL boilerplate. **Passport.js** manages authentication with support for multiple strategies. **Drizzle ORM** provides a TypeScript-first database interface with excellent performance. **PostgreSQL 14+** serves as the relational database, offering ACID compliance and advanced features. **bcryptjs** handles password hashing with configurable rounds for security.

### DevOps and Tooling

**pnpm** manages packages efficiently with hard links and content-addressable storage. **Vitest** provides fast unit testing with native ESM support. **tsx** enables direct TypeScript execution during development. **Render.com** hosts the application with automatic SSL, scaling, and database backups. **GitHub Actions** can optionally handle CI/CD workflows.

## Authentication Flow

The authentication system supports three methods: Google OAuth, GitHub OAuth, and email/password. When a user clicks "Sign in with Google," the client redirects to Google's OAuth consent screen. After the user authorizes the application, Google redirects back with an authorization code. The server exchanges this code for access tokens, retrieves user profile information, creates or updates the user record in the database, generates a JWT token, sets it as an httpOnly cookie, and redirects to the dashboard. GitHub OAuth follows an identical flow with GitHub as the provider. Email/password authentication involves the user submitting credentials, the server verifying the email exists and the password matches using bcrypt, generating a JWT token, setting the cookie, and returning the user object.

## Database Schema

The **users** table stores authentication and profile information with fields for id (primary key), openId (OAuth identifier), email (unique), name, passwordHash (for email/password auth), loginMethod (email/google/github/manus), googleId, githubId, role (user/admin), createdAt, updatedAt, and lastSignedIn. The **notifications** table has a foreign key to users and includes id, userId, type (enum of notification types), title, message, link, read status, and createdAt. The **skills** table contains id, skillId (unique), name, description, category, source (clawdbot/kilo/custom), enabled status, parameters (JSON), usageExample, tags (JSON array), usageCount, lastUsed, createdAt, and updatedAt. Additional tables include teams, teamMembers, scheduledTasks, executionHistory, syncHistory, githubRepos, and marketplaceSkills, all following similar patterns with appropriate foreign keys and indexes.

## Request Flow

A typical API request begins when the client makes a type-safe call using the tRPC client. This generates an HTTP request with JSON payload that reaches the Express server. Express middleware processes the request, then tRPC context creation runs, checking authentication status by verifying the JWT cookie. The appropriate procedure handler executes, performing business logic and database operations through Drizzle ORM. PostgreSQL processes the query and returns results. The response flows back through the layers with full type safety, and React updates the UI based on the returned data.

## Deployment Architecture

On Render.com, the web service runs Node.js with Express and tRPC, featuring auto-scaling based on load, health checks for availability monitoring, and automatic SSL/TLS certificate management. The PostgreSQL database includes automatic daily backups, connection pooling for efficiency, and SSL-encrypted connections. CloudFlare CDN sits in front, providing global content delivery, DDoS protection, and caching for static assets. Users access the application through HTTPS, with requests flowing through CloudFlare to Render's infrastructure.

## Security Architecture

Security is implemented in multiple layers. The **transport layer** uses HTTPS with TLS 1.3 and automatic certificate management through Render. The **authentication layer** employs JWT tokens stored in httpOnly cookies, bcrypt password hashing with 10 rounds, and OAuth 2.0 for Google and GitHub. The **authorization layer** implements role-based access control (RBAC), protected tRPC procedures that require authentication, and team-based permissions for collaborative features. The **data layer** uses parameterized queries to prevent SQL injection, Zod schemas for input validation, and database encryption at rest. The **application layer** includes CORS configuration, rate limiting to prevent abuse, XSS protection through React's built-in escaping, and CSRF protection via SameSite cookies.

## Scalability Considerations

The application is designed for horizontal scaling with a stateless architecture. Sessions are stored in JWT tokens rather than server-side storage, eliminating sticky session requirements. Database connection pooling ensures efficient resource usage. Static assets are served through CDN for global distribution. For vertical scaling, Render.com offers multiple instance types with increasing CPU and memory. Database plans can be upgraded for more storage and connections. Future enhancements may include Redis for session and API response caching, database query result caching, and aggressive static asset caching strategies.

## Monitoring and Observability

Application logs aggregate in Render.com's log management system with structured JSON formatting for easy parsing. Error tracking captures exceptions and stack traces. Key metrics include request rate, response time percentiles, error rate by endpoint, and database query performance. Health checks monitor application availability through a dedicated endpoint, verify database connectivity, and check external service status. This comprehensive monitoring enables quick identification and resolution of issues.

## API Design Patterns

The tRPC API follows consistent patterns across all endpoints. **Public procedures** are accessible without authentication for operations like registration and public data retrieval. **Protected procedures** require valid authentication and inject the user object into the context. **Admin procedures** extend protected procedures with role checking to restrict access to administrative functions. All procedures use Zod schemas for input validation, ensuring type safety and runtime validation. Error handling follows tRPC conventions with specific error codes (UNAUTHORIZED, FORBIDDEN, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR) and descriptive messages.

## Performance Optimization

The frontend implements code splitting to load only necessary JavaScript, lazy loading for routes and heavy components, and memoization of expensive computations. The backend uses database indexes on frequently queried fields, connection pooling to reuse database connections, and efficient query patterns with Drizzle ORM. Response compression reduces bandwidth usage. Future optimizations may include server-side rendering for initial page loads, edge caching for API responses, and database read replicas for scaling read operations.

## Development Workflow

Developers start the application with `pnpm dev`, which launches the development server with hot module replacement. TypeScript compilation runs in watch mode, catching type errors immediately. The database schema is managed through Drizzle with `pnpm db:push` applying changes. Tests run with `pnpm test` using Vitest for fast feedback. Code quality is maintained through ESLint for linting and TypeScript for type checking. The build process uses `pnpm build` to create optimized production bundles, and `pnpm start` launches the production server.

## Deployment Process

Deployment to Render.com begins with pushing code to GitHub. Render detects the push and triggers a build using the configured build command `pnpm install && pnpm db:push`. The start command `pnpm start` launches the production server. Environment variables are injected from Render's configuration. Health checks verify the deployment succeeded. Automatic SSL certificates are provisioned. The application becomes accessible at the assigned Render URL. Auto-deploy can be enabled to automatically deploy on every push to the main branch.

## Future Enhancements

Planned improvements include real-time collaboration features using WebSockets, advanced skill versioning with rollback capabilities, skill dependency management to handle complex workflows, enhanced marketplace features with monetization, mobile applications using React Native, desktop applications using Electron, a CLI tool for skill management, GraphQL API as an alternative to tRPC, AI-powered skill recommendations, automated skill testing frameworks, performance optimization with caching and CDN, and multi-language support for international users.

---

*Last Updated: January 29, 2026*
