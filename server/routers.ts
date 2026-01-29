import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { skillsRouter, syncRouter, analyticsRouter, githubRouter, settingsRouter } from "./routers-skills";
import { executionRouter } from "./routers-execution";
import { schedulingRouter } from "./routers-scheduling";
import { teamsRouter, sharingRouter } from "./routers-teams";
export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // SkillForge AI feature routers
  skills: skillsRouter,
  sync: syncRouter,
  github: githubRouter,
  settings: settingsRouter,
  analytics: analyticsRouter,
  execution: executionRouter,
  scheduling: schedulingRouter,
  teams: teamsRouter,
  sharing: sharingRouter,
});

export type AppRouter = typeof appRouter;
