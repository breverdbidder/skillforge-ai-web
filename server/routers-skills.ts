import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db-skills";
import { getGitHubClient } from "./github-api";

/**
 * Skills Router - Manages ClawdBot skills library
 */
export const skillsRouter = router({
  // Get all skills
  list: publicProcedure.query(async () => {
    return await db.getAllSkills();
  }),

  // Get skills by category
  byCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return await db.getSkillsByCategory(input.category);
    }),

  // Search skills
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return await db.searchSkills(input.query);
    }),

  // Get skill by ID
  getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await db.getSkillById(input.id);
  }),

  // Toggle skill enabled status
  toggleEnabled: protectedProcedure
    .input(z.object({ id: z.number(), enabled: z.boolean() }))
    .mutation(async ({ input }) => {
      await db.toggleSkillEnabled(input.id, input.enabled);
      return { success: true };
    }),

  // Record skill usage
  recordUsage: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.updateSkillUsage(input.id);
      return { success: true };
    }),

  // Get skills statistics
  statistics: publicProcedure.query(async () => {
    return await db.getSkillsStatistics();
  }),

  // Get top used skills
  topUsed: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return await db.getTopUsedSkills(input.limit);
    }),
});

/**
 * Sync Router - Manages synchronization operations
 */
export const syncRouter = router({
  // Get recent sync history
  history: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return await db.getRecentSyncHistory(input.limit);
    }),

  // Get last successful sync
  lastSuccess: publicProcedure.query(async () => {
    return await db.getLastSuccessfulSync();
  }),

  // Trigger manual sync
  trigger: protectedProcedure.mutation(async () => {
    // Create sync record
    const syncRecord = await db.createSyncHistory({
      syncType: "manual",
      status: "in_progress",
      startedAt: new Date(),
    });

    // TODO: Integrate with SkillForge AI backend to perform actual sync
    // For now, simulate a successful sync
    const syncId = Array.isArray(syncRecord) ? syncRecord[0]?.insertId : null;

    if (syncId) {
      await db.updateSyncHistory(syncId, {
        status: "success",
        skillsAdded: 0,
        skillsUpdated: 0,
        skillsRemoved: 0,
        completedAt: new Date(),
        duration: 1000,
      });
    }

    return { success: true, syncId };
  }),

  // Get sync statistics
  statistics: publicProcedure.query(async () => {
    return await db.getSyncStatistics();
  }),
});

/**
 * GitHub Router - Manages GitHub integration
 */
export const githubRouter = router({
  // Get  // Get all activity (real GitHub API)
  activity: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      try {
        const client = await getGitHubClient();
        const repos = [
          { owner: "breverdbidder", repo: "skillforge-ai" },
          { owner: "breverdbidder", repo: "kimi-kilo-craft-integration" },
          { owner: "breverdbidder", repo: "skillforge-craft-extraction" },
        ];
        
        const commits = await client.getCommitsFromRepos(repos, input.limit);
        
        // Transform to match our database schema
        return commits.map((commit, index) => ({
          id: index + 1,
          repository: commit.repository,
          branch: "main",
          commitHash: commit.sha.substring(0, 7),
          commitMessage: commit.message.split('\n')[0], // First line only
          author: commit.author,
          filesChanged: (commit.additions || 0) + (commit.deletions || 0) > 0 ? 1 : null,
          status: "success" as const,
          createdAt: new Date(commit.date),
        }));
      } catch (error) {
        console.error("Failed to fetch GitHub activity:", error);
        // Fallback to mock data if API fails
        return [];
      }
    }),

  // Get activity by repository
  byRepo: publicProcedure
    .input(z.object({ repository: z.string(), limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return await db.getGitHubActivityByRepo(input.repository, input.limit);
    }),

  // Get connected repositories
  repositories: publicProcedure.query(async () => {
    return [
      {
        name: "skillforge-ai",
        url: "https://github.com/breverdbidder/skillforge-ai",
        description: "Main integration ecosystem",
        status: "connected",
      },
      {
        name: "kimi-kilo-craft-integration",
        url: "https://github.com/breverdbidder/kimi-kilo-craft-integration",
        description: "Kimi K2.5 + Kilo integration",
        status: "connected",
      },
    ];
  }),
});

/**
 * Settings Router - Manages system settings
 */
export const settingsRouter = router({
  // Get all settings
  getAll: protectedProcedure.query(async () => {
    return await db.getAllSettings();
  }),

  // Get specific setting
  get: protectedProcedure.input(z.object({ key: z.string() })).query(async ({ input }) => {
    return await db.getSetting(input.key);
  }),

  // Update setting
  update: protectedProcedure
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      await db.setSetting(input.key, input.value);
      return { success: true };
    }),

  // Get sync interval
  syncInterval: publicProcedure.query(async () => {
    const interval = await db.getSetting("sync_interval");
    return interval || "24"; // Default 24 hours
  }),

  // Update sync interval
  updateSyncInterval: protectedProcedure
    .input(z.object({ hours: z.number() }))
    .mutation(async ({ input }) => {
      await db.setSetting("sync_interval", input.hours.toString());
      return { success: true };
    }),
});

/**
 * Analytics Router - Provides analytics data
 */
export const analyticsRouter = router({
  // Get dashboard overview
  overview: publicProcedure.query(async () => {
    const [skillsStats, syncStats, topSkills] = await Promise.all([
      db.getSkillsStatistics(),
      db.getSyncStatistics(),
      db.getTopUsedSkills(5),
    ]);

    return {
      skills: skillsStats,
      sync: syncStats,
      topSkills,
    };
  }),

  // Get skill usage trends (mock data for now)
  usageTrends: publicProcedure.query(async () => {
    // TODO: Implement actual trend calculation
    return [
      { date: "2026-01-22", count: 45 },
      { date: "2026-01-23", count: 52 },
      { date: "2026-01-24", count: 48 },
      { date: "2026-01-25", count: 61 },
      { date: "2026-01-26", count: 55 },
      { date: "2026-01-27", count: 68 },
      { date: "2026-01-28", count: 72 },
      { date: "2026-01-29", count: 58 },
    ];
  }),

  // Get category distribution
  categoryDistribution: publicProcedure.query(async () => {
    const stats = await db.getSkillsStatistics();
    return Object.entries(stats.byCategory).map(([category, count]) => ({
      category,
      count,
    }));
  }),
});
