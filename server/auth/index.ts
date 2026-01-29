import { Router } from "express";
import googleRoutes from "./google-routes";
import githubRoutes from "./github-routes";
import localRoutes from "./local-routes";

const authRouter = Router();

// Mount all auth routes
authRouter.use("/", googleRoutes);
authRouter.use("/", githubRoutes);
authRouter.use("/", localRoutes);

// Get current user
authRouter.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

export default authRouter;
