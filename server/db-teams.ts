import { eq, and } from "drizzle-orm";
import { teams, teamMembers, skillShares, type InsertTeam, type InsertTeamMember, type InsertSkillShare } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Team Management Database Helpers
 */

// Teams
export async function createTeam(team: InsertTeam) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(teams).values(team).$returningId();
  const [created] = await db.select().from(teams).where(eq(teams.id, result.id));
  return created!;
}

export async function getTeamById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const [team] = await db.select().from(teams).where(eq(teams.id, id));
  return team || null;
}

export async function getTeamsByOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(teams).where(eq(teams.ownerId, ownerId));
}

export async function getTeamsByMember(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const memberTeams = await db.select().from(teamMembers).where(eq(teamMembers.userId, userId));
  const teamIds = memberTeams.map(m => m.teamId);
  
  if (teamIds.length === 0) return [];
  
  const result = [];
  for (const teamId of teamIds) {
    const [team] = await db.select().from(teams).where(eq(teams.id, teamId));
    if (team) result.push(team);
  }
  return result;
}

export async function updateTeam(id: number, updates: Partial<InsertTeam>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(teams).set({ ...updates, updatedAt: new Date() }).where(eq(teams.id, id));
  return getTeamById(id);
}

export async function deleteTeam(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete team members first
  await db.delete(teamMembers).where(eq(teamMembers.teamId, id));
  // Delete skill shares
  await db.delete(skillShares).where(eq(skillShares.teamId, id));
  // Delete team
  await db.delete(teams).where(eq(teams.id, id));
}

// Team Members
export async function addTeamMember(member: InsertTeamMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(teamMembers).values(member).$returningId();
  const [created] = await db.select().from(teamMembers).where(eq(teamMembers.id, result.id));
  return created!;
}

export async function getTeamMembers(teamId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
}

export async function removeTeamMember(teamId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(teamMembers).where(
    and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId))
  );
}

export async function updateMemberRole(teamId: number, userId: number, role: "owner" | "admin" | "member" | "viewer") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(teamMembers)
    .set({ role })
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
}

// Skill Shares
export async function shareSkill(share: InsertSkillShare) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(skillShares).values(share).$returningId();
  const [created] = await db.select().from(skillShares).where(eq(skillShares.id, result.id));
  return created!;
}

export async function getSkillShares(skillId: string) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(skillShares).where(eq(skillShares.skillId, skillId));
}

export async function updateSkillShare(id: number, updates: Partial<InsertSkillShare>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(skillShares).set(updates).where(eq(skillShares.id, id));
}

export async function removeSkillShare(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(skillShares).where(eq(skillShares.id, id));
}

export async function getTeamSkillShares(teamId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(skillShares).where(eq(skillShares.teamId, teamId));
}
