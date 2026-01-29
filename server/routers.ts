import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { users } from "../drizzle/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { skillsRouter, syncRouter, analyticsRouter, githubRouter, settingsRouter } from "./routers-skills";
import { marketplaceRouter } from "./routers-marketplace";
import { executionRouter } from "./routers-execution";
import { schedulingRouter } from "./routers-scheduling";
import { teamsRouter, sharingRouter } from "./routers-teams";
import { notificationsRouter } from "./routers-notifications";
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
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        const user = existingUsers[0];

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(input.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // Update last signed in
        await db
          .update(users)
          .set({ lastSignedIn: new Date() })
          .where(eq(users.id, user.id));

        return { success: true, user };
      }),
    register: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        // Check if user already exists
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUsers.length > 0) {
          throw new Error("Email already registered");
        }

        // Hash password
        const passwordHash = await bcrypt.hash(input.password, 10);

        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            email: input.email,
            passwordHash,
            name: input.name,
            loginMethod: "email",
            lastSignedIn: new Date(),
          })
          .$returningId();

        const createdUsers = await db.select().from(users).where(eq(users.id, newUser.id)).limit(1);
        const user = createdUsers[0];

        return { success: true, user };
      }),
  }),

  // SkillForge AI feature routers
  skills: skillsRouter,
  sync: syncRouter,
  github: githubRouter,
  settings: settingsRouter,
  analytics: analyticsRouter,
  execution: executionRouter,
  marketplace: marketplaceRouter,
  scheduling: schedulingRouter,
  teams: teamsRouter,
  sharing: sharingRouter,
  notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
