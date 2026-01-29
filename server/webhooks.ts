import { Router } from "express";
import crypto from "crypto";
import { createGitHubActivity } from "./db-skills";

/**
 * GitHub Webhook Handler
 * Receives real-time events from GitHub repositories
 */

const router = Router();

// Webhook secret for signature verification
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "skillforge-webhook-secret";

/**
 * Verify GitHub webhook signature
 */
function verifySignature(payload: string, signature: string): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(payload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

/**
 * Process push event
 */
async function processPushEvent(payload: any) {
  const { repository, pusher, commits, ref } = payload;

  // Store each commit as GitHub activity
  for (const commit of commits || []) {
    await createGitHubActivity({
      repository: repository.full_name,
      commitHash: commit.id,
      commitMessage: commit.message,
      filesChanged: (commit.added?.length || 0) + (commit.removed?.length || 0) + (commit.modified?.length || 0),
      author: commit.author?.name || pusher.name,
      branch: ref.replace("refs/heads/", ""),
      status: "success",
    });
  }

  console.log(`[Webhook] Processed ${commits?.length || 0} commits from ${repository.full_name}`);
}

/**
 * Process pull request event
 */
async function processPullRequestEvent(payload: any) {
  const { action, pull_request, repository, sender } = payload;

  await createGitHubActivity({
    repository: repository.full_name,
    commitHash: pull_request.head.sha,
    commitMessage: `PR #${pull_request.number}: ${pull_request.title} (${action})`,
    filesChanged: pull_request.changed_files || 0,
    author: sender.login,
    branch: pull_request.head.ref,
    status: pull_request.merged ? "success" : "failed",
  });

  console.log(`[Webhook] Processed PR ${action} from ${repository.full_name}`);
}

/**
 * Process issue event
 */
async function processIssueEvent(payload: any) {
  const { action, issue, repository, sender } = payload;

  await createGitHubActivity({
    repository: repository.full_name,
    commitHash: `issue-${issue.number}`,
    commitMessage: `Issue #${issue.number}: ${issue.title} (${action})`,
    filesChanged: 0,
    author: sender.login,
    branch: "main",
    status: issue.state === "closed" ? "success" : "failed",
  });

  console.log(`[Webhook] Processed issue ${action} from ${repository.full_name}`);
}

/**
 * Main webhook endpoint
 */
router.post("/github", async (req, res) => {
  try {
    // Get signature and event type
    const signature = req.headers["x-hub-signature-256"] as string;
    const event = req.headers["x-github-event"] as string;
    const delivery = req.headers["x-github-delivery"] as string;

    // Verify signature
    const payload = JSON.stringify(req.body);
    if (!verifySignature(payload, signature)) {
      console.error("[Webhook] Invalid signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    console.log(`[Webhook] Received ${event} event (delivery: ${delivery})`);

    // Process event based on type
    switch (event) {
      case "push":
        await processPushEvent(req.body);
        break;
      case "pull_request":
        await processPullRequestEvent(req.body);
        break;
      case "issues":
        await processIssueEvent(req.body);
        break;
      case "ping":
        console.log("[Webhook] Ping received");
        break;
      default:
        console.log(`[Webhook] Unhandled event: ${event}`);
    }

    res.status(200).json({ success: true, event, delivery });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Test endpoint to verify webhook is working
 */
router.get("/github/test", (req, res) => {
  res.json({
    status: "ok",
    message: "GitHub webhook endpoint is ready",
    secret_configured: !!process.env.GITHUB_WEBHOOK_SECRET,
  });
});

export default router;
