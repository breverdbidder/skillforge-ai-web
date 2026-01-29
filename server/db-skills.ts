import { and, desc, eq, like, or, sql } from "drizzle-orm";
import {
  githubActivity,
  InsertGitHubActivity,
  InsertSkill,
  InsertSyncHistory,
  InsertSystemSetting,
  Skill,
  skills,
  syncHistory,
  systemSettings,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Skills Management
 */

export async function getAllSkills(): Promise<Skill[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(skills).orderBy(skills.name);
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(skills).where(eq(skills.category, category)).orderBy(skills.name);
}

export async function searchSkills(query: string): Promise<Skill[]> {
  const db = await getDb();
  if (!db) return [];

  const searchPattern = `%${query}%`;
  return db
    .select()
    .from(skills)
    .where(
      or(
        like(skills.name, searchPattern),
        like(skills.description, searchPattern),
        like(skills.tags, searchPattern)
      )
    )
    .orderBy(skills.name);
}

export async function getSkillById(id: number): Promise<Skill | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  return result[0];
}

export async function upsertSkill(skill: InsertSkill): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .insert(skills)
    .values(skill)
    .onDuplicateKeyUpdate({
      set: {
        name: skill.name,
        description: skill.description,
        category: skill.category,
        source: skill.source,
        enabled: skill.enabled,
        parameters: skill.parameters,
        usageExample: skill.usageExample,
        tags: skill.tags,
        updatedAt: new Date(),
      },
    });
}

export async function updateSkillUsage(skillId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(skills)
    .set({
      usageCount: sql`${skills.usageCount} + 1`,
      lastUsed: new Date(),
    })
    .where(eq(skills.id, skillId));
}

export async function toggleSkillEnabled(skillId: number, enabled: boolean): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .update(skills)
    .set({ enabled: enabled ? 1 : 0 })
    .where(eq(skills.id, skillId));
}

/**
 * Sync History Management
 */

export async function createSyncHistory(sync: InsertSyncHistory) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(syncHistory).values(sync);
  return result;
}

export async function updateSyncHistory(
  id: number,
  updates: Partial<InsertSyncHistory>
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(syncHistory).set(updates).where(eq(syncHistory.id, id));
}

export async function getRecentSyncHistory(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(syncHistory).orderBy(desc(syncHistory.startedAt)).limit(limit);
}

export async function getLastSuccessfulSync() {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(syncHistory)
    .where(eq(syncHistory.status, "success"))
    .orderBy(desc(syncHistory.completedAt))
    .limit(1);

  return result[0] || null;
}

/**
 * GitHub Activity Management
 */

export async function createGitHubActivity(activity: InsertGitHubActivity) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(githubActivity).values(activity);
  return result;
}

export async function getRecentGitHubActivity(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(githubActivity).orderBy(desc(githubActivity.createdAt)).limit(limit);
}

export async function getGitHubActivityByRepo(repository: string, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(githubActivity)
    .where(eq(githubActivity.repository, repository))
    .orderBy(desc(githubActivity.createdAt))
    .limit(limit);
}

/**
 * System Settings Management
 */

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.settingKey, key))
    .limit(1);

  return result[0]?.settingValue || null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .insert(systemSettings)
    .values({ settingKey: key, settingValue: value })
    .onDuplicateKeyUpdate({
      set: { settingValue: value, updatedAt: new Date() },
    });
}

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(systemSettings);
}

/**
 * Analytics & Statistics
 */

export async function getSkillsStatistics() {
  const db = await getDb();
  if (!db)
    return {
      total: 0,
      enabled: 0,
      byCategory: {},
      bySource: {},
    };

  const allSkills = await db.select().from(skills);

  const stats = {
    total: allSkills.length,
    enabled: allSkills.filter((s) => s.enabled === 1).length,
    byCategory: {} as Record<string, number>,
    bySource: {} as Record<string, number>,
  };

  allSkills.forEach((skill) => {
    stats.byCategory[skill.category] = (stats.byCategory[skill.category] || 0) + 1;
    stats.bySource[skill.source] = (stats.bySource[skill.source] || 0) + 1;
  });

  return stats;
}

export async function getSyncStatistics() {
  const db = await getDb();
  if (!db)
    return {
      totalSyncs: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      successRate: 0,
    };

  const allSyncs = await db.select().from(syncHistory);

  const successful = allSyncs.filter((s) => s.status === "success").length;
  const failed = allSyncs.filter((s) => s.status === "failed").length;

  return {
    totalSyncs: allSyncs.length,
    successfulSyncs: successful,
    failedSyncs: failed,
    successRate: allSyncs.length > 0 ? (successful / allSyncs.length) * 100 : 0,
  };
}

export async function getTopUsedSkills(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(skills)
    .where(sql`${skills.usageCount} > 0`)
    .orderBy(desc(skills.usageCount))
    .limit(limit);
}
