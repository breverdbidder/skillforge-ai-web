import { Router } from "express";
import passport from "./passport-config";

const router = Router();

// Initiate GitHub OAuth
router.get("/github", passport.authenticate("github", {
  scope: ["user:email"],
}));

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login?error=github_auth_failed" }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect("/dashboard");
  }
);

export default router;
