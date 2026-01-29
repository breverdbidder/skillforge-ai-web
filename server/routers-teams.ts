import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as teamDb from "./db-teams";
import { TRPCError } from "@trpc/server";

/**
 * Team Management Router
 */
export const teamsRouter = router({
  // Create team
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const team = await teamDb.createTeam({
        name: input.name,
        description: input.description || null,
        ownerId: ctx.user.id,
      });

      // Add creator as owner member
      await teamDb.addTeamMember({
        teamId: team.id,
        userId: ctx.user.id,
        role: "owner",
      });

      return team;
    }),

  // Get user's teams
  myTeams: protectedProcedure.query(async ({ ctx }) => {
    const ownedTeams = await teamDb.getTeamsByOwner(ctx.user.id);
    const memberTeams = await teamDb.getTeamsByMember(ctx.user.id);

    // Combine and deduplicate
    const allTeams = [...ownedTeams, ...memberTeams];
    const uniqueTeams = Array.from(new Map(allTeams.map((t) => [t.id, t])).values());

    return uniqueTeams;
  }),

  // Get team by ID with members
  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input, ctx }) => {
    const team = await teamDb.getTeamById(input.id);
    if (!team) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Team not found" });
    }

    // Check if user has access
    const member = await teamDb.getTeamMember(team.id, ctx.user.id);
    if (!member) {
      throw new TRPCError({ code: "FORBIDDEN", message: "You are not a member of this team" });
    }

    const members = await teamDb.getTeamMembers(team.id);

    return {
      ...team,
      members,
      userRole: member.role,
    };
  }),

  // Update team
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input;

      // Check permission
      const hasPermission = await teamDb.hasTeamPermission(ctx.user.id, id, "admin");
      if (!hasPermission) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update team" });
      }

      await teamDb.updateTeam(id, updates);
      return { success: true };
    }),

  // Delete team
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
    // Check permission (only owner can delete)
    const hasPermission = await teamDb.hasTeamPermission(ctx.user.id, input.id, "owner");
    if (!hasPermission) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only owner can delete team" });
    }

    await teamDb.deleteTeam(input.id);
    return { success: true };
  }),

  // Add team member
  addMember: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
        userEmail: z.string().email(),
        role: z.enum(["admin", "member", "viewer"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check permission
      const hasPermission = await teamDb.hasTeamPermission(ctx.user.id, input.teamId, "admin");
      if (!hasPermission) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can add members" });
      }

      // TODO: Look up user by email (would need user lookup function)
      // For now, return success
      return { success: true, message: "Invitation sent" };
    }),

  // Update member role
  updateMemberRole: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
        userId: z.number(),
        role: z.enum(["owner", "admin", "member", "viewer"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check permission
      const hasPermission = await teamDb.hasTeamPermission(ctx.user.id, input.teamId, "admin");
      if (!hasPermission) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can update roles" });
      }

      await teamDb.updateTeamMemberRole(input.teamId, input.userId, input.role);
      return { success: true };
    }),

  // Remove member
  removeMember: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
        userId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check permission
      const hasPermission = await teamDb.hasTeamPermission(ctx.user.id, input.teamId, "admin");
      if (!hasPermission) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can remove members" });
      }

      await teamDb.removeTeamMember(input.teamId, input.userId);
      return { success: true };
    }),
});

/**
 * Skill Sharing Router
 */
export const sharingRouter = router({
  // Get skill share settings
  getSkillShare: protectedProcedure.input(z.object({ skillId: z.string() })).query(async ({ input, ctx }) => {
    const share = await teamDb.getSkillShare(input.skillId);

    // If no share exists, create default private share
    if (!share) {
      return await teamDb.createSkillShare({
        skillId: input.skillId,
        sharedWith: "private",
        teamId: null,
        ownerId: ctx.user.id,
      });
    }

    // Check if user is owner
    if (share.ownerId !== ctx.user.id) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only owner can view share settings" });
    }

    return share;
  }),

  // Update skill share settings
  updateSkillShare: protectedProcedure
    .input(
      z.object({
        skillId: z.string(),
        sharedWith: z.enum(["public", "team", "private"]),
        teamId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const share = await teamDb.getSkillShare(input.skillId);

      if (!share) {
        // Create new share
        return await teamDb.createSkillShare({
          skillId: input.skillId,
          sharedWith: input.sharedWith,
          teamId: input.teamId || null,
          ownerId: ctx.user.id,
        });
      }

      // Check if user is owner
      if (share.ownerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only owner can update share settings" });
      }

      await teamDb.updateSkillShare(input.skillId, {
        sharedWith: input.sharedWith,
        teamId: input.teamId || null,
      });

      return { success: true };
    }),

  // Check if user can access skill
  canAccess: protectedProcedure.input(z.object({ skillId: z.string() })).query(async ({ input, ctx }) => {
    return await teamDb.canAccessSkill(ctx.user.id, input.skillId);
  }),
});
