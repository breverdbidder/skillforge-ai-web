import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("skills router", () => {
  it("should list all skills", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.skills.list();

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("skillId");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("category");
    }
  });

  it("should get skill statistics", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.skills.statistics();

    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("enabled");
    expect(result).toHaveProperty("byCategory");
    expect(typeof result.total).toBe("number");
    expect(typeof result.enabled).toBe("number");
    expect(typeof result.byCategory).toBe("object");
  });

  it("should search skills by query", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.skills.search({ query: "content" });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should filter skills by category", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.skills.byCategory({ category: "Development" });

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].category).toBe("Development");
    }
  });
});

describe("sync router", () => {
  it("should get sync history", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sync.history({ limit: 10 });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should get last successful sync", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sync.lastSuccess();

    if (result) {
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("startedAt");
    }
  });
});

describe("analytics router", () => {
  it("should get analytics overview", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.analytics.overview();

    expect(result).toHaveProperty("skills");
    expect(result.skills).toHaveProperty("total");
    expect(result.skills).toHaveProperty("enabled");
  });
});
