import { Router } from "express";
import passport from "./passport-config";

const router = Router();

// Initiate Google OAuth
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login?error=google_auth_failed" }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect("/dashboard");
  }
);

export default router;
