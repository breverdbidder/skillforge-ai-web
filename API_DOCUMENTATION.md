# SkillForge AI - Complete API Documentation

## Overview

SkillForge AI provides a comprehensive tRPC-based API for managing AI skills, synchronization, analytics, team collaboration, and more. All API endpoints are accessible via `/api/trpc` and use TypeScript for end-to-end type safety.

**Base URL:** `https://your-domain.com/api/trpc`

**Authentication:** Session-based authentication with JWT cookies

---

## Table of Contents

1. [Authentication](#authentication)
2. [Skills Management](#skills-management)
3. [Sync Operations](#sync-operations)
4. [GitHub Integration](#github-integration)
5. [Analytics](#analytics)
6. [Execution Management](#execution-management)
7. [Marketplace](#marketplace)
8. [Scheduling](#scheduling)
9. [Team Management](#team-management)
10. [Notifications](#notifications)
11. [Settings](#settings)
12. [System Operations](#system-operations)

---

## Authentication

### POST `/api/auth/register`

Register a new user with email/password authentication.

**Request Body:**
```typescript
{
  email: string;      // Valid email address
  password: string;   // Minimum 8 characters
  name: string;       // User's full name
}
```

**Response:**
```typescript
{
  success: boolean;
  user: {
    id: number;
    email: string;
    name: string;
    loginMethod: "email";
    createdAt: Date;
  }
}
```

**Errors:**
- `Email already registered` - Email is already in use
- `Database not available` - Database connection error

---

### POST `/api/auth/login`

Login with email/password credentials.

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  user: {
    id: number;
    email: string;
    name: string;
    role: "user" | "admin";
    lastSignedIn: Date;
  }
}
```

**Errors:**
- `Invalid email or password` - Incorrect credentials
- `Please use OAuth to sign in` - User registered via OAuth

---

### GET `/api/auth/google`

Initiate Google OAuth authentication flow.

**Query Parameters:**
- None (automatically redirects to Google OAuth)

**Response:**
- Redirects to Google OAuth consent screen
- On success, redirects to `/api/auth/google/callback`

**Requirements:**
- `GOOGLE_CLIENT_ID` environment variable
- `GOOGLE_CLIENT_SECRET` environment variable
- `GOOGLE_CALLBACK_URL` environment variable

---

### GET `/api/auth/github`

Initiate GitHub OAuth authentication flow.

**Query Parameters:**
- None (automatically redirects to GitHub OAuth)

**Response:**
- Redirects to GitHub OAuth consent screen
- On success, redirects to `/api/auth/github/callback`

**Requirements:**
- `GITHUB_CLIENT_ID` environment variable
- `GITHUB_CLIENT_SECRET` environment variable
- `GITHUB_CALLBACK_URL` environment variable

---

### GET `/api/trpc/auth.me`

Get current authenticated user information.

**Authentication:** Required

**Response:**
```typescript
{
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
  loginMethod: "email" | "google" | "github" | "manus";
  googleId?: string;
  githubId?: string;
  createdAt: Date;
  lastSignedIn: Date;
}
```

---

### POST `/api/trpc/auth.logout`

Logout current user and clear session.

**Authentication:** Required

**Response:**
```typescript
{
  success: true;
}
```

---

## Skills Management

### GET `/api/trpc/skills.getAll`

Retrieve all available skills.

**Authentication:** Required

**Query Parameters:**
```typescript
{
  category?: string;      // Filter by category
  search?: string;        // Search by name or description
  source?: "clawdbot" | "kilo" | "custom";
  enabled?: boolean;      // Filter by enabled status
}
```

**Response:**
```typescript
{
  skills: Array<{
    id: number;
    skillId: string;
    name: string;
    description: string;
    category: string;
    source: "clawdbot" | "kilo" | "custom";
    enabled: boolean;
    parameters: string;     // JSON string
    usageExample: string;
    tags: string[];
    usageCount: number;
    lastUsed: Date | null;
    createdAt: Date;
  }>;
}
```

---

### GET `/api/trpc/skills.getById`

Get detailed information about a specific skill.

**Authentication:** Required

**Input:**
```typescript
{
  skillId: string;
}
```

**Response:**
```typescript
{
  id: number;
  skillId: string;
  name: string;
  description: string;
  category: string;
  source: string;
  enabled: boolean;
  parameters: object;
  usageExample: string;
  tags: string[];
  usageCount: number;
  lastUsed: Date | null;
}
```

---

### POST `/api/trpc/skills.execute`

Execute a skill with provided parameters.

**Authentication:** Required

**Input:**
```typescript
{
  skillId: string;
  parameters: Record<string, any>;
}
```

**Response:**
```typescript
{
  success: boolean;
  result: any;
  executionTime: number;  // milliseconds
  executionId: number;
}
```

---

### POST `/api/trpc/skills.toggle`

Enable or disable a skill.

**Authentication:** Required

**Input:**
```typescript
{
  skillId: string;
  enabled: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

## Sync Operations

### GET `/api/trpc/sync.getStatus`

Get current synchronization status.

**Authentication:** Required

**Response:**
```typescript
{
  status: "idle" | "syncing" | "error";
  lastSync: Date | null;
  nextSync: Date | null;
  syncInterval: number;   // minutes
  totalSkills: number;
  newSkills: number;
  updatedSkills: number;
}
```

---

### POST `/api/trpc/sync.trigger`

Manually trigger a synchronization.

**Authentication:** Required

**Response:**
```typescript
{
  success: boolean;
  message: string;
  syncId: number;
}
```

---

### GET `/api/trpc/sync.getHistory`

Get synchronization history.

**Authentication:** Required

**Query Parameters:**
```typescript
{
  limit?: number;    // Default: 50
  offset?: number;   // Default: 0
}
```

**Response:**
```typescript
{
  history: Array<{
    id: number;
    status: "success" | "failed" | "partial";
    startedAt: Date;
    completedAt: Date;
    skillsAdded: number;
    skillsUpdated: number;
    skillsRemoved: number;
    errorMessage?: string;
  }>;
  total: number;
}
```

---

## GitHub Integration

### GET `/api/trpc/github.getActivity`

Get recent GitHub activity from connected repositories.

**Authentication:** Required

**Query Parameters:**
```typescript
{
  limit?: number;    // Default: 20
  repo?: string;     // Filter by repository
}
```

**Response:**
```typescript
{
  activities: Array<{
    id: number;
    repo: string;
    branch: string;
    commitHash: string;
    message: string;
    author: string;
    timestamp: Date;
    url: string;
  }>;
}
```

---

### POST `/api/trpc/github.connectRepo`

Connect a GitHub repository for synchronization.

**Authentication:** Required

**Input:**
```typescript
{
  repoUrl: string;
  branch?: string;   // Default: "main"
  autoSync?: boolean; // Default: true
}
```

**Response:**
```typescript
{
  success: boolean;
  repoId: number;
}
```

---

### GET `/api/trpc/github.getWebhooks`

Get configured GitHub webhooks.

**Authentication:** Required

**Response:**
```typescript
{
  webhooks: Array<{
    id: number;
    repo: string;
    events: string[];
    active: boolean;
    url: string;
  }>;
}
```

---

## Analytics

### GET `/api/trpc/analytics.getSkillUsage`

Get skill usage analytics.

**Authentication:** Required

**Query Parameters:**
```typescript
{
  timeRange?: "day" | "week" | "month" | "year";
  skillId?: string;
}
```

**Response:**
```typescript
{
  data: Array<{
    date: string;
    skillId: string;
    skillName: string;
    executions: number;
    successRate: number;
    avgDuration: number;
  }>;
}
```

---

### GET `/api/trpc/analytics.getSyncMetrics`

Get synchronization metrics.

**Authentication:** Required

**Query Parameters:**
```typescript
{
  timeRange?: "day" | "week" | "month" | "year";
}
```

**Response:**
```typescript
{
  metrics: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    successRate: number;
    avgDuration: number;
    timeline: Array<{
      date: string;
      syncs: number;
      success: number;
      failed: number;
    }>;
  };
}
```

---

### GET `/api/trpc/analytics.getCategoryDistribution`

Get skills distribution by category.

**Authentication:** Required

**Response:**
```typescript
{
  distribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}
```

---

## Execution Management

### GET `/api/trpc/execution.getHistory`

Get execution history.

**Authentication:** Required

**Query Parameters:**
```typescript
{
  limit?: number;
  offset?: number;
  skillId?: string;
  status?: "success" | "failed" | "pending";
  startDate?: Date;
  endDate?: Date;
}
```

**Response:**
```typescript
{
  executions: Array<{
    id: number;
    skillId: string;
    skillName: string;
    status: "success" | "failed" | "pending";
    parameters: object;
    result: any;
    duration: number;
    executedAt: Date;
    userId: number;
  }>;
  total: number;
}
```

---

### GET `/api/trpc/execution.getById`

Get detailed execution information.

**Authentication:** Required

**Input:**
```typescript
{
  executionId: number;
}
```

**Response:**
```typescript
{
  id: number;
  skillId: string;
  skillName: string;
  status: string;
  parameters: object;
  result: any;
  errorMessage?: string;
  duration: number;
  executedAt: Date;
  logs: string[];
}
```

---

## Marketplace

### GET `/api/trpc/marketplace.getSkills`

Browse marketplace skills.

**Authentication:** Required

**Query Parameters:**
```typescript
{
  category?: string;
  search?: string;
  sortBy?: "popular" | "recent" | "rating";
  limit?: number;
  offset?: number;
}
```

**Response:**
```typescript
{
  skills: Array<{
    id: number;
    name: string;
    description: string;
    category: string;
    author: string;
    rating: number;
    downloads: number;
    price: number;
    published: Date;
  }>;
  total: number;
}
```

---

### POST `/api/trpc/marketplace.publish`

Publish a skill to the marketplace.

**Authentication:** Required

**Input:**
```typescript
{
  skillId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  visibility: "public" | "private" | "team";
}
```

**Response:**
```typescript
{
  success: boolean;
  marketplaceSkillId: number;
}
```

---

### POST `/api/trpc/marketplace.install`

Install a skill from the marketplace.

**Authentication:** Required

**Input:**
```typescript
{
  marketplaceSkillId: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  skillId: string;
}
```

---

### POST `/api/trpc/marketplace.rate`

Rate a marketplace skill.

**Authentication:** Required

**Input:**
```typescript
{
  marketplaceSkillId: number;
  rating: number;      // 1-5
  review?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

## Scheduling

### GET `/api/trpc/scheduling.getTasks`

Get all scheduled tasks.

**Authentication:** Required

**Response:**
```typescript
{
  tasks: Array<{
    id: number;
    skillId: string;
    skillName: string;
    cronExpression: string;
    parameters: object;
    enabled: boolean;
    lastRun: Date | null;
    nextRun: Date | null;
    createdAt: Date;
  }>;
}
```

---

### POST `/api/trpc/scheduling.create`

Create a new scheduled task.

**Authentication:** Required

**Input:**
```typescript
{
  skillId: string;
  cronExpression: string;
  parameters: Record<string, any>;
  enabled?: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
  taskId: number;
}
```

---

### POST `/api/trpc/scheduling.update`

Update a scheduled task.

**Authentication:** Required

**Input:**
```typescript
{
  taskId: number;
  cronExpression?: string;
  parameters?: Record<string, any>;
  enabled?: boolean;
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

### DELETE `/api/trpc/scheduling.delete`

Delete a scheduled task.

**Authentication:** Required

**Input:**
```typescript
{
  taskId: number;
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

## Team Management

### GET `/api/trpc/teams.getAll`

Get all teams for the current user.

**Authentication:** Required

**Response:**
```typescript
{
  teams: Array<{
    id: number;
    name: string;
    description: string;
    role: "owner" | "admin" | "member" | "viewer";
    memberCount: number;
    createdAt: Date;
  }>;
}
```

---

### POST `/api/trpc/teams.create`

Create a new team.

**Authentication:** Required

**Input:**
```typescript
{
  name: string;
  description?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  teamId: number;
}
```

---

### POST `/api/trpc/teams.invite`

Invite a user to a team.

**Authentication:** Required (admin or owner role)

**Input:**
```typescript
{
  teamId: number;
  email: string;
  role: "admin" | "member" | "viewer";
}
```

**Response:**
```typescript
{
  success: boolean;
  invitationId: number;
}
```

---

### POST `/api/trpc/teams.updateMember`

Update team member role.

**Authentication:** Required (admin or owner role)

**Input:**
```typescript
{
  teamId: number;
  userId: number;
  role: "admin" | "member" | "viewer";
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

## Notifications

### GET `/api/trpc/notifications.getAll`

Get all notifications for the current user.

**Authentication:** Required

**Response:**
```typescript
{
  notifications: Array<{
    id: number;
    type: "task_completed" | "task_failed" | "team_invitation" | "skill_published" | "review_received" | "system_alert";
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
  }>;
}
```

---

### GET `/api/trpc/notifications.getUnreadCount`

Get count of unread notifications.

**Authentication:** Required

**Response:**
```typescript
{
  count: number;
}
```

---

### POST `/api/trpc/notifications.markAsRead`

Mark a notification as read.

**Authentication:** Required

**Input:**
```typescript
{
  notificationId: number;
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

### POST `/api/trpc/notifications.markAllAsRead`

Mark all notifications as read.

**Authentication:** Required

**Response:**
```typescript
{
  success: boolean;
}
```

---

### DELETE `/api/trpc/notifications.delete`

Delete a notification.

**Authentication:** Required

**Input:**
```typescript
{
  notificationId: number;
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

## Settings

### GET `/api/trpc/settings.get`

Get user settings.

**Authentication:** Required

**Response:**
```typescript
{
  syncInterval: number;
  githubToken?: string;
  notifications: {
    email: boolean;
    push: boolean;
    taskCompletion: boolean;
    syncStatus: boolean;
  };
}
```

---

### POST `/api/trpc/settings.update`

Update user settings.

**Authentication:** Required

**Input:**
```typescript
{
  syncInterval?: number;
  githubToken?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    taskCompletion?: boolean;
    syncStatus?: boolean;
  };
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

## System Operations

### POST `/api/trpc/system.notifyOwner`

Send a notification to the system owner.

**Authentication:** Required

**Input:**
```typescript
{
  title: string;
  content: string;
}
```

**Response:**
```typescript
{
  success: boolean;
}
```

---

## Error Handling

All API endpoints follow a consistent error format:

```typescript
{
  error: {
    code: string;
    message: string;
    data?: any;
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid input
- `INTERNAL_SERVER_ERROR` - Server error
- `CONFLICT` - Resource conflict (e.g., duplicate email)

---

## Rate Limiting

- **Default:** 100 requests per minute per user
- **Burst:** 200 requests per minute
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

---

## Webhooks

SkillForge AI supports webhooks for real-time event notifications.

### Webhook Events

- `skill.executed` - Skill execution completed
- `sync.completed` - Synchronization completed
- `task.scheduled` - Task scheduled
- `team.member_added` - Team member added
- `marketplace.skill_published` - Skill published to marketplace

### Webhook Payload Format

```typescript
{
  event: string;
  timestamp: string;
  data: object;
  signature: string;  // HMAC-SHA256 signature
}
```

---

## OAuth Configuration Guide

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen
6. Add authorized redirect URI: `https://your-domain.com/api/auth/google/callback`
7. Copy Client ID and Client Secret
8. Set environment variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_CALLBACK_URL=https://your-domain.com/api/auth/google/callback
   ```

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in application details
4. Set Authorization callback URL: `https://your-domain.com/api/auth/github/callback`
5. Copy Client ID and Client Secret
6. Set environment variables:
   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   GITHUB_CALLBACK_URL=https://your-domain.com/api/auth/github/callback
   ```

---

## SDK Examples

### TypeScript/JavaScript

```typescript
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/routers';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'https://your-domain.com/api/trpc',
      credentials: 'include',
    }),
  ],
});

// Register user
const user = await client.auth.register.mutate({
  email: 'user@example.com',
  password: 'securepassword',
  name: 'John Doe',
});

// Get all skills
const skills = await client.skills.getAll.query();

// Execute a skill
const result = await client.skills.execute.mutate({
  skillId: 'content-generator',
  parameters: { topic: 'AI', length: 500 },
});
```

---

## Support

For API support and questions:
- Email: support@skillforge.ai
- Documentation: https://docs.skillforge.ai
- GitHub Issues: https://github.com/breverdbidder/skillforge-ai-web/issues

---

## Changelog

### Version 1.0.0 (2026-01-29)
- Initial release
- Multi-provider authentication (Gmail, GitHub, Email/Password)
- Complete skills management system
- Synchronization engine
- Analytics dashboard
- Marketplace functionality
- Team collaboration
- Notification system
- Scheduling system
- GitHub integration

---

*Last Updated: January 29, 2026*
