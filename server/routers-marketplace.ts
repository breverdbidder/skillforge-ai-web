import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  getAllMarketplaceSkills,
  getMarketplaceSkillById,
  searchMarketplaceSkills,
  getMarketplaceSkillsByCategory,
  getMarketplaceSkillsByAuthor,
  createMarketplaceSkill,
  updateMarketplaceSkill,
  deleteMarketplaceSkill,
  getSkillReviews,
  createSkillReview,
  deleteSkillReview,
  getUserInstalledSkills,
  installSkill,
  uninstallSkill,
  isSkillInstalled,
  getMarketplaceStatistics,
} from "./db-marketplace";

export const marketplaceRouter = router({
  /**
   * Get all public marketplace skills
   */
  all: protectedProcedure.query(async () => {
    return await getAllMarketplaceSkills();
  }),

  /**
   * Get skill by ID
   */
  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getMarketplaceSkillById(input.id);
    }),

  /**
   * Search marketplace skills
   */
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return await searchMarketplaceSkills(input.query);
    }),

  /**
   * Get skills by category
   */
  byCategory: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return await getMarketplaceSkillsByCategory(input.category);
    }),

  /**
   * Get skills by author
   */
  byAuthor: protectedProcedure
    .input(z.object({ authorId: z.number() }))
    .query(async ({ input }) => {
      return await getMarketplaceSkillsByAuthor(input.authorId);
    }),

  /**
   * Publish a new skill to marketplace
   */
  publish: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.string(),
        tags: z.string().optional(),
        version: z.string().optional(),
        visibility: z.enum(["public", "private"]).optional(),
        code: z.string().optional(),
        parameters: z.string().optional(),
        examples: z.string().optional(),
        readme: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await createMarketplaceSkill({
        ...input,
        authorId: ctx.user.id,
        authorName: ctx.user.name || undefined,
      });
      return { success: true, id };
    }),

  /**
   * Update marketplace skill
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        version: z.string().optional(),
        visibility: z.enum(["public", "private"]).optional(),
        code: z.string().optional(),
        parameters: z.string().optional(),
        examples: z.string().optional(),
        readme: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input;
      
      // Verify ownership
      const skill = await getMarketplaceSkillById(id);
      if (!skill || skill.authorId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await updateMarketplaceSkill(id, updates);
      return { success: true };
    }),

  /**
   * Delete marketplace skill
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const skill = await getMarketplaceSkillById(input.id);
      if (!skill || skill.authorId !== ctx.user.id) {
        throw new Error("Unauthorized");
      }

      await deleteMarketplaceSkill(input.id);
      return { success: true };
    }),

  /**
   * Get skill reviews
   */
  reviews: protectedProcedure
    .input(z.object({ skillId: z.number() }))
    .query(async ({ input }) => {
      return await getSkillReviews(input.skillId);
    }),

  /**
   * Create skill review
   */
  createReview: protectedProcedure
    .input(
      z.object({
        skillId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await createSkillReview({
        ...input,
        userId: ctx.user.id,
        userName: ctx.user.name || undefined,
      });
      return { success: true, id };
    }),

  /**
   * Delete skill review
   */
  deleteReview: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteSkillReview(input.id);
      return { success: true };
    }),

  /**
   * Get user's installed skills
   */
  installed: protectedProcedure.query(async ({ ctx }) => {
    return await getUserInstalledSkills(ctx.user.id);
  }),

  /**
   * Install a skill
   */
  install: protectedProcedure
    .input(
      z.object({
        skillId: z.number(),
        marketplaceSkillId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await installSkill({
        userId: ctx.user.id,
        skillId: input.skillId,
        marketplaceSkillId: input.marketplaceSkillId,
      });
      return { success: true, id };
    }),

  /**
   * Uninstall a skill
   */
  uninstall: protectedProcedure
    .input(z.object({ skillId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await uninstallSkill(ctx.user.id, input.skillId);
      return { success: true };
    }),

  /**
   * Check if skill is installed
   */
  isInstalled: protectedProcedure
    .input(z.object({ skillId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await isSkillInstalled(ctx.user.id, input.skillId);
    }),

  /**
   * Get marketplace statistics
   */
  statistics: protectedProcedure.query(async () => {
    return await getMarketplaceStatistics();
  }),
});
