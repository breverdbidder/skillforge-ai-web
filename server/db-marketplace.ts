import { eq, desc, like, or, and, sql } from "drizzle-orm";
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
