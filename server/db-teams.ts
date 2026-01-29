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

  const [result] = await db.insert(teams).values(team);
  const [created] = await db.select().from(teams).where(eq(teams.id, Number(result.insertId)));
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

  const memberships = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId));

  if (memberships.length === 0) return [];

  const teamIds = memberships.map((m) => m.teamId);
  const allTeams = await db.select().from(teams);
  
  return allTeams.filter((t) => teamIds.includes(t.id));
}

export async function updateTeam(id: number, updates: Partial<InsertTeam>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(teams).set(updates).where(eq(teams.id, id));
}

export async function deleteTeam(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete team members first
  await db.delete(teamMembers).where(eq(teamMembers.teamId, id));
  
  // Delete skill shares for this team
  await db.delete(skillShares).where(eq(skillShares.teamId, id));
  
  // Delete team
  await db.delete(teams).where(eq(teams.id, id));
}

// Team Members
export async function addTeamMember(member: InsertTeamMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(teamMembers).values(member);
  const [created] = await db.select().from(teamMembers).where(eq(teamMembers.id, Number(result.insertId)));
  return created!;
}

export async function getTeamMembers(teamId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
}

export async function getTeamMember(teamId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [member] = await db
    .select()
    .from(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));

  return member || null;
}

export async function updateTeamMemberRole(teamId: number, userId: number, role: "owner" | "admin" | "member" | "viewer") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(teamMembers)
    .set({ role })
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
}

export async function removeTeamMember(teamId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(teamMembers)
    .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
}

// Skill Shares
export async function createSkillShare(share: InsertSkillShare) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(skillShares).values(share);
  const [created] = await db.select().from(skillShares).where(eq(skillShares.id, Number(result.insertId)));
  return created!;
}

export async function getSkillShare(skillId: string) {
  const db = await getDb();
  if (!db) return null;

  const [share] = await db.select().from(skillShares).where(eq(skillShares.skillId, skillId));
  return share || null;
}

export async function updateSkillShare(
  skillId: string,
  updates: {
    sharedWith?: "public" | "team" | "private";
    teamId?: number | null;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(skillShares).set(updates).where(eq(skillShares.skillId, skillId));
}

export async function deleteSkillShare(skillId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(skillShares).where(eq(skillShares.skillId, skillId));
}

/**
 * Check if user has access to a skill
 */
export async function canAccessSkill(userId: number, skillId: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const share = await getSkillShare(skillId);
  
  // If no share record, assume private and only owner can access
  if (!share) return false;

  // Public skills are accessible to everyone
  if (share.sharedWith === "public") return true;

  // Owner always has access
  if (share.ownerId === userId) return true;

  // Private skills only accessible to owner
  if (share.sharedWith === "private") return false;

  // Team skills accessible to team members
  if (share.sharedWith === "team" && share.teamId) {
    const member = await getTeamMember(share.teamId, userId);
    return member !== null;
  }

  return false;
}

/**
 * Check if user has permission to perform action on team
 */
export async function hasTeamPermission(
  userId: number,
  teamId: number,
  requiredRole: "owner" | "admin" | "member" | "viewer"
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const member = await getTeamMember(teamId, userId);
  if (!member) return false;

  const roleHierarchy = { owner: 4, admin: 3, member: 2, viewer: 1 };
  const userLevel = roleHierarchy[member.role];
  const requiredLevel = roleHierarchy[requiredRole];

  return userLevel >= requiredLevel;
}
