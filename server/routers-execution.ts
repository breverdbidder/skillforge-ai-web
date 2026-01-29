import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import {
  createExecutionRecord,
  getExecutionHistory,
  getExecutionById,
  getExecutionStatistics,
} from "./db-execution";

export const executionRouter = router({
  /**
   * Create a new execution record
   */
  create: protectedProcedure
    .input(
      z.object({
        skillId: z.string(),
        skillName: z.string(),
        parameters: z.string().optional(),
        result: z.string().optional(),
        status: z.enum(["success", "failed", "pending"]),
        duration: z.number().optional(),
        errorMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const record = await createExecutionRecord({
        ...input,
        userId: ctx.user.id,
      });
      return { success: true, id: record };
    }),

  /**
   * Get execution history with filtering and pagination
   */
  history: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(50),
        offset: z.number().optional().default(0),
        skillId: z.string().optional(),
        status: z.enum(["success", "failed", "pending"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await getExecutionHistory({
        ...input,
        userId: ctx.user.id,
      });
    }),

  /**
   * Get execution by ID
   */
  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getExecutionById(input.id);
    }),

  /**
   * Get execution statistics
   */
  statistics: protectedProcedure.query(async ({ ctx }) => {
    return await getExecutionStatistics(ctx.user.id);
  }),

  /**
   * Get recent executions (last 10)
   */
  recent: protectedProcedure.query(async ({ ctx }) => {
    return await getExecutionHistory({
      limit: 10,
      userId: ctx.user.id,
    });
  }),
});
