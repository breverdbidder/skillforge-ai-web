import { eq, desc, like, or, and, sql, gte, lte } from "drizzle-orm";
import {
  marketplaceSkills,
  skillReviews,
  installedSkills,
  InsertMarketplaceSkill,
  InsertSkillReview,
  InsertInstalledSkill,
  MarketplaceSkill,
  SkillReview,
  InstalledSkill,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Marketplace Skills Management
 */

export async function getAllMarketplaceSkills(): Promise<MarketplaceSkill[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(marketplaceSkills)
    .where(eq(marketplaceSkills.visibility, "public"))
    .orderBy(desc(marketplaceSkills.downloads));
}

export async function getMarketplaceSkillById(id: number): Promise<MarketplaceSkill | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(marketplaceSkills).where(eq(marketplaceSkills.id, id)).limit(1);
  return result[0];
}

export async function searchMarketplaceSkills(query: string): Promise<MarketplaceSkill[]> {
  const db = await getDb();
  if (!db) return [];

  const searchPattern = `%${query}%`;
  return db
    .select()
    .from(marketplaceSkills)
    .where(
      and(
        eq(marketplaceSkills.visibility, "public"),
        or(
          like(marketplaceSkills.name, searchPattern),
          like(marketplaceSkills.description, searchPattern),
          like(marketplaceSkills.tags, searchPattern)
        )
      )
    )
    .orderBy(desc(marketplaceSkills.downloads));
}

export async function getMarketplaceSkillsByCategory(category: string): Promise<MarketplaceSkill[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(marketplaceSkills)
    .where(
      and(eq(marketplaceSkills.visibility, "public"), eq(marketplaceSkills.category, category))
    )
    .orderBy(desc(marketplaceSkills.downloads));
}

export async function getMarketplaceSkillsByAuthor(authorId: number): Promise<MarketplaceSkill[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(marketplaceSkills)
    .where(eq(marketplaceSkills.authorId, authorId))
    .orderBy(desc(marketplaceSkills.createdAt));
}

export async function createMarketplaceSkill(skill: InsertMarketplaceSkill): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(marketplaceSkills).values(skill);
  return result[0].insertId;
}

export async function updateMarketplaceSkill(id: number, updates: Partial<InsertMarketplaceSkill>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(marketplaceSkills).set(updates).where(eq(marketplaceSkills.id, id));
}

export async function deleteMarketplaceSkill(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(marketplaceSkills).where(eq(marketplaceSkills.id, id));
}

export async function incrementSkillDownloads(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(marketplaceSkills)
    .set({
      downloads: sql`${marketplaceSkills.downloads} + 1`,
    })
    .where(eq(marketplaceSkills.id, id));
}

/**
 * Skill Reviews Management
 */

export async function getSkillReviews(skillId: number): Promise<SkillReview[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(skillReviews)
    .where(eq(skillReviews.skillId, skillId))
    .orderBy(desc(skillReviews.createdAt));
}

export async function createSkillReview(review: InsertSkillReview): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(skillReviews).values(review);

  // Update skill rating
  await updateSkillRating(review.skillId);

  return result[0].insertId;
}

export async function updateSkillRating(skillId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const reviews = await getSkillReviews(skillId);
  if (reviews.length === 0) return;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingValue = Math.round(avgRating * 100); // Store as integer (e.g., 450 = 4.5 stars)

  await db
    .update(marketplaceSkills)
    .set({
      rating: ratingValue,
      reviewCount: reviews.length,
    })
    .where(eq(marketplaceSkills.id, skillId));
}

export async function deleteSkillReview(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get review to know which skill to update
  const review = await db.select().from(skillReviews).where(eq(skillReviews.id, id)).limit(1);
  if (review[0]) {
    await db.delete(skillReviews).where(eq(skillReviews.id, id));
    await updateSkillRating(review[0].skillId);
  }
}

/**
 * Installed Skills Management
 */

export async function getUserInstalledSkills(userId: number): Promise<InstalledSkill[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(installedSkills)
    .where(eq(installedSkills.userId, userId))
    .orderBy(desc(installedSkills.installedAt));
}

export async function installSkill(install: InsertInstalledSkill): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(installedSkills).values(install);

  // Increment download count if it's a marketplace skill
  if (install.marketplaceSkillId) {
    await incrementSkillDownloads(install.marketplaceSkillId);
  }

  return result[0].insertId;
}

export async function uninstallSkill(userId: number, skillId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(installedSkills)
    .where(and(eq(installedSkills.userId, userId), eq(installedSkills.skillId, skillId)));
}

export async function isSkillInstalled(userId: number, skillId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(installedSkills)
    .where(and(eq(installedSkills.userId, userId), eq(installedSkills.skillId, skillId)))
    .limit(1);

  return result.length > 0;
}

/**
 * Marketplace Statistics
 */

export async function getMarketplaceStatistics() {
  const db = await getDb();
  if (!db) {
    return {
      totalSkills: 0,
      totalDownloads: 0,
      totalReviews: 0,
      averageRating: 0,
    };
  }

  const skillsResult = await db
    .select({
      count: sql<number>`COUNT(*)`,
      totalDownloads: sql<number>`SUM(${marketplaceSkills.downloads})`,
    })
    .from(marketplaceSkills)
    .where(eq(marketplaceSkills.visibility, "public"));

  const reviewsResult = await db
    .select({
      count: sql<number>`COUNT(*)`,
      avgRating: sql<number>`AVG(${skillReviews.rating})`,
    })
    .from(skillReviews);

  return {
    totalSkills: Number(skillsResult[0]?.count || 0),
    totalDownloads: Number(skillsResult[0]?.totalDownloads || 0),
    totalReviews: Number(reviewsResult[0]?.count || 0),
    averageRating: Number(reviewsResult[0]?.avgRating || 0),
  };
}

// ============================================================================
// ENTERPRISE MARKETPLACE FUNCTIONS
// ============================================================================

import {
  creatorProfiles,
  marketplaceSkillsPricing,
  skillExecutions,
  creatorEarnings,
  subscriptions,
  creatorBonuses,
  userActivityLog,
  skillUsagePatterns,
  InsertCreatorProfile,
  InsertMarketplaceSkillPricing,
  InsertSkillExecution,
  InsertCreatorEarning,
  InsertSubscription,
  InsertCreatorBonus,
  InsertUserActivityLog,
  InsertSkillUsagePattern,
} from "../drizzle/schema";

/**
 * Creator Profile Management
 */
export async function getCreatorProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(creatorProfiles)
    .where(eq(creatorProfiles.userId, userId))
    .limit(1);

  if (result.length === 0) {
    // Create default profile
    await db.insert(creatorProfiles).values({
      userId,
      isCreator: 0,
      creatorBonusClaimed: 0,
      totalEarnings: 0,
      totalSkills: 0,
      totalExecutions: 0,
    });
    return await getCreatorProfile(userId);
  }

  return result[0];
}

export async function updateCreatorProfile(userId: number, updates: Partial<InsertCreatorProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(creatorProfiles)
    .set(updates)
    .where(eq(creatorProfiles.userId, userId));
}

/**
 * Skill Pricing Management
 */
export async function getSkillPricing(skillId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(marketplaceSkillsPricing)
    .where(eq(marketplaceSkillsPricing.skillId, skillId))
    .limit(1);

  return result[0] || null;
}

export async function createSkillPricing(pricing: InsertMarketplaceSkillPricing) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(marketplaceSkillsPricing).values(pricing);
}

export async function updateSkillPricing(skillId: number, updates: Partial<InsertMarketplaceSkillPricing>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(marketplaceSkillsPricing)
    .set(updates)
    .where(eq(marketplaceSkillsPricing.skillId, skillId));
}

/**
 * Skill Execution Tracking
 */
export async function trackSkillExecution(execution: InsertSkillExecution) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(skillExecutions).values(execution);
  const executionId = result[0].insertId;

  // If execution was successful and skill has pricing, create creator earning
  if (execution.status === "success" && execution.cost > 0) {
    const pricing = await getSkillPricing(execution.skillId);
    if (pricing) {
      const skill = await getMarketplaceSkillById(execution.skillId);
      if (skill) {
        const grossRevenue = execution.cost;
        const platformCommission = Math.floor(grossRevenue * 0.2); // 20%
        const netRevenue = grossRevenue - platformCommission;

        await db.insert(creatorEarnings).values({
          creatorId: skill.authorId,
          skillId: execution.skillId,
          executionId,
          grossRevenue,
          platformCommission,
          netRevenue,
          payoutStatus: "pending",
        });

        // Update creator profile
        await db.execute(sql`
          UPDATE creator_profiles
          SET totalEarnings = totalEarnings + ${netRevenue},
              totalExecutions = totalExecutions + 1
          WHERE userId = ${skill.authorId}
        `);
      }
    }
  }

  return executionId;
}

export async function getSkillExecutions(skillId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(skillExecutions)
    .where(eq(skillExecutions.skillId, skillId))
    .orderBy(desc(skillExecutions.executedAt))
    .limit(limit);
}

export async function getUserExecutions(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(skillExecutions)
    .where(eq(skillExecutions.userId, userId))
    .orderBy(desc(skillExecutions.executedAt))
    .limit(limit);
}

/**
 * Creator Earnings
 */
export async function getCreatorEarnings(creatorId: number, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(creatorEarnings)
    .where(eq(creatorEarnings.creatorId, creatorId))
    .orderBy(desc(creatorEarnings.createdAt));

  // Add date filters if provided
  if (startDate && endDate) {
    query = query.where(
      and(
        gte(creatorEarnings.createdAt, new Date(startDate)),
        lte(creatorEarnings.createdAt, new Date(endDate))
      )
    );
  }

  return query;
}

export async function getTotalCreatorEarnings(creatorId: number) {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({
      total: sql<number>`SUM(${creatorEarnings.netRevenue})`,
    })
    .from(creatorEarnings)
    .where(eq(creatorEarnings.creatorId, creatorId));

  return result[0]?.total || 0;
}

/**
 * Subscription Management
 */
export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (result.length === 0) {
    // Create default free subscription
    await db.insert(subscriptions).values({
      userId,
      tier: "free",
      monthlyExecutions: 0,
      executionLimit: 100, // Free tier limit
    });
    return await getUserSubscription(userId);
  }

  return result[0];
}

export async function updateSubscription(userId: number, tier: "free" | "creator" | "professional" | "enterprise") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Set execution limits based on tier
  const limits = {
    free: 100,
    creator: 10000,
    professional: 100000,
    enterprise: -1, // Unlimited
  };

  await db
    .update(subscriptions)
    .set({
      tier,
      executionLimit: limits[tier],
      monthlyExecutions: 0, // Reset on tier change
    })
    .where(eq(subscriptions.userId, userId));
}

/**
 * Creator Bonus Program
 */
export async function checkAndAwardFirstSkillBonus(creatorId: number, skillId: number) {
  const db = await getDb();
  if (!db) return false;

  const profile = await getCreatorProfile(creatorId);
  if (!profile || profile.creatorBonusClaimed) return false;

  // Check if this is their first published skill
  const skillCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(marketplaceSkills)
    .where(eq(marketplaceSkills.authorId, creatorId));

  if (skillCount[0]?.count === 1) {
    // Award $500 bonus (50000 cents)
    await db.insert(creatorBonuses).values({
      creatorId,
      bonusType: "first_skill",
      amount: 50000,
      status: "approved",
    });

    await updateCreatorProfile(creatorId, {
      creatorBonusClaimed: 1,
      isCreator: 1,
    });

    return true;
  }

  return false;
}

/**
 * Activity Logging for Training
 */
export async function logUserActivity(activity: InsertUserActivityLog) {
  const db = await getDb();
  if (!db) return;

  await db.insert(userActivityLog).values(activity);
}

export async function logSkillUsagePattern(pattern: InsertSkillUsagePattern) {
  const db = await getDb();
  if (!db) return;

  await db.insert(skillUsagePatterns).values(pattern);
}

/**
 * Analytics Functions
 */
export async function getSkillUsageAnalytics(skillId: number) {
  const db = await getDb();
  if (!db) return null;

  const [executions, revenue, avgRating] = await Promise.all([
    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(skillExecutions)
      .where(eq(skillExecutions.skillId, skillId)),
    
    db
      .select({ total: sql<number>`SUM(${skillExecutions.cost})` })
      .from(skillExecutions)
      .where(
        and(
          eq(skillExecutions.skillId, skillId),
          eq(skillExecutions.status, "success")
        )
      ),
    
    db
      .select({ avg: sql<number>`AVG(${skillReviews.rating})` })
      .from(skillReviews)
      .where(eq(skillReviews.skillId, skillId)),
  ]);

  return {
    totalExecutions: executions[0]?.count || 0,
    totalRevenue: revenue[0]?.total || 0,
    averageRating: avgRating[0]?.avg || 0,
  };
}

export async function getFeaturedSkills(limit = 10) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(marketplaceSkills)
    .innerJoin(
      marketplaceSkillsPricing,
      eq(marketplaceSkills.id, marketplaceSkillsPricing.skillId)
    )
    .where(
      and(
        eq(marketplaceSkills.visibility, "public"),
        eq(marketplaceSkillsPricing.isFeatured, 1)
      )
    )
    .orderBy(desc(marketplaceSkillsPricing.skillForgeScore))
    .limit(limit);
}

export async function getMarketplaceSkills(filters: {
  category?: string;
  search?: string;
  pricingModel?: string;
  minRating?: number;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(marketplaceSkills)
    .innerJoin(
      marketplaceSkillsPricing,
      eq(marketplaceSkills.id, marketplaceSkillsPricing.skillId)
    )
    .where(eq(marketplaceSkills.visibility, "public"));

  if (filters.category) {
    query = query.where(eq(marketplaceSkills.category, filters.category));
  }

  if (filters.search) {
    const searchPattern = `%${filters.search}%`;
    query = query.where(
      or(
        like(marketplaceSkills.name, searchPattern),
        like(marketplaceSkills.description, searchPattern),
        like(marketplaceSkills.tags, searchPattern)
      )
    );
  }

  if (filters.pricingModel) {
    query = query.where(eq(marketplaceSkillsPricing.pricingModel, filters.pricingModel));
  }

  if (filters.minRating) {
    query = query.where(gte(marketplaceSkillsPricing.averageRating, filters.minRating * 100));
  }

  return query
    .orderBy(desc(marketplaceSkills.downloads))
    .limit(filters.limit || 20)
    .offset(filters.offset || 0);
}
