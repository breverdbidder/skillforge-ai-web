import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { getUserByOpenId, upsertUser } from "../db";
import { users } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, or } from "drizzle-orm";

// Serialize user to session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const db = await getDb();
    if (!db) {
      return done(new Error("Database not available"));
    }
    
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    const user = result[0];
    
    if (!user) {
      return done(new Error("User not found"));
    }
    
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await getDb();
        if (!db) {
          return done(new Error("Database not available"));
        }

        // Check if user exists with this Google ID or email
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;

        const existingUsers = await db
          .select()
          .from(users)
          .where(or(eq(users.googleId, googleId), email ? eq(users.email, email) : undefined))
          .limit(1);

        let user = existingUsers[0];

        if (user) {
          // Update Google ID if not set
          if (!user.googleId) {
            await db
              .update(users)
              .set({
                googleId,
                lastSignedIn: new Date(),
              })
              .where(eq(users.id, user.id));
            user.googleId = googleId;
          } else {
            // Just update last signed in
            await db
              .update(users)
              .set({ lastSignedIn: new Date() })
              .where(eq(users.id, user.id));
          }
        } else {
          // Create new user
          const [newUser] = await db
            .insert(users)
            .values({
              googleId,
              email,
              name: profile.displayName,
              loginMethod: "google",
              lastSignedIn: new Date(),
            })
            .$returningId();

          const createdUsers = await db.select().from(users).where(eq(users.id, newUser.id)).limit(1);
          user = createdUsers[0];
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
      }
    )
  );
} else {
  console.warn("[Auth] Google OAuth not configured - skipping Google strategy");
}

// GitHub OAuth Strategy (only if credentials are provided)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/api/auth/github/callback",
      },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const db = await getDb();
        if (!db) {
          return done(new Error("Database not available"));
        }

        // Check if user exists with this GitHub ID or email
        const email = profile.emails?.[0]?.value;
        const githubId = profile.id;

        const existingUsers = await db
          .select()
          .from(users)
          .where(or(eq(users.githubId, githubId), email ? eq(users.email, email) : undefined))
          .limit(1);

        let user = existingUsers[0];

        if (user) {
          // Update GitHub ID if not set
          if (!user.githubId) {
            await db
              .update(users)
              .set({
                githubId,
                lastSignedIn: new Date(),
              })
              .where(eq(users.id, user.id));
            user.githubId = githubId;
          } else {
            // Just update last signed in
            await db
              .update(users)
              .set({ lastSignedIn: new Date() })
              .where(eq(users.id, user.id));
          }
        } else {
          // Create new user
          const [newUser] = await db
            .insert(users)
            .values({
              githubId,
              email,
              name: profile.displayName || profile.username,
              loginMethod: "github",
              lastSignedIn: new Date(),
            })
            .$returningId();

          const createdUsers = await db.select().from(users).where(eq(users.id, newUser.id)).limit(1);
          user = createdUsers[0];
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
      }
    )
  );
} else {
  console.warn("[Auth] GitHub OAuth not configured - skipping GitHub strategy");
}

// Local (Email/Password) Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const db = await getDb();
        if (!db) {
          return done(new Error("Database not available"));
        }

        // Find user by email
        const existingUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        const user = existingUsers[0];

        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        if (!user.passwordHash) {
          return done(null, false, { message: "Please use OAuth to sign in." });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // Update last signed in
        await db
          .update(users)
          .set({ lastSignedIn: new Date() })
          .where(eq(users.id, user.id));

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
