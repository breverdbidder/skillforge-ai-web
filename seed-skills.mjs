import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { skills } from "./drizzle/schema.ts";

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

const sampleSkills = [
  {
    skillId: "web-scraper",
    name: "Web Scraper",
    description: "Extract data from websites with advanced parsing capabilities",
    category: "Development",
    source: "clawdbot",
    enabled: 1,
    parameters: JSON.stringify({ url: "string", selectors: "array" }),
    usageExample: "Scrape product prices from e-commerce sites",
    tags: JSON.stringify(["web", "scraping", "data"]),
    usageCount: 45,
  },
  {
    skillId: "code-reviewer",
    name: "Code Reviewer",
    description: "Automated code review with best practices and security checks",
    category: "Development",
    source: "clawdbot",
    enabled: 1,
    parameters: JSON.stringify({ language: "string", files: "array" }),
    usageExample: "Review pull requests for code quality",
    tags: JSON.stringify(["code", "review", "quality"]),
    usageCount: 78,
  },
  {
    skillId: "api-tester",
    name: "API Tester",
    description: "Comprehensive API endpoint testing and validation",
    category: "Development",
    source: "clawdbot",
    enabled: 1,
    parameters: JSON.stringify({ endpoint: "string", method: "string" }),
    usageExample: "Test REST API endpoints automatically",
    tags: JSON.stringify(["api", "testing", "automation"]),
    usageCount: 32,
  },
  {
    skillId: "content-generator",
    name: "Content Generator",
    description: "AI-powered content creation for blogs, social media, and marketing",
    category: "Content",
    source: "clawdbot",
    enabled: 1,
    parameters: JSON.stringify({ topic: "string", tone: "string", length: "number" }),
    usageExample: "Generate blog posts on any topic",
    tags: JSON.stringify(["content", "ai", "writing"]),
    usageCount: 156,
  },
  {
    skillId: "data-analyzer",
    name: "Data Analyzer",
    description: "Statistical analysis and visualization of datasets",
    category: "Analytics",
    source: "clawdbot",
    enabled: 1,
    parameters: JSON.stringify({ dataset: "file", metrics: "array" }),
    usageExample: "Analyze sales data trends",
    tags: JSON.stringify(["data", "analytics", "visualization"]),
    usageCount: 89,
  },
];

async function seed() {
  console.log("Seeding skills...");
  
  for (const skill of sampleSkills) {
    try {
      await db.insert(skills).values(skill).onConflictDoNothing();
      console.log(`  ✓ ${skill.name}`);
    } catch (error) {
      console.log(`  ✗ ${skill.name}: ${error.message}`);
    }
  }
  
  console.log("Done!");
  await client.end();
}

seed().catch(console.error);
