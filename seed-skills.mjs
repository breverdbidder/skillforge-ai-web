import { drizzle } from "drizzle-orm/mysql2";
import { skills } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

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
    usageExample: "Generate blog posts and social media content",
    tags: JSON.stringify(["content", "ai", "writing"]),
    usageCount: 156,
  },
  {
    skillId: "seo-analyzer",
    name: "SEO Analyzer",
    description: "Analyze and optimize content for search engines",
    category: "Content",
    source: "clawdbot",
    enabled: 1,
    parameters: JSON.stringify({ url: "string", keywords: "array" }),
    usageExample: "Optimize website pages for SEO",
    tags: JSON.stringify(["seo", "optimization", "marketing"]),
    usageCount: 23,
  },
  {
    skillId: "security-scanner",
    name: "Security Scanner",
    description: "Scan applications for vulnerabilities and security issues",
    category: "Security",
    source: "clawdbot",
    enabled: 1,
    parameters: JSON.stringify({ target: "string", depth: "number" }),
    usageExample: "Identify security vulnerabilities in web apps",
    tags: JSON.stringify(["security", "scanning", "vulnerabilities"]),
    usageCount: 67,
  },
];

console.log("Seeding skills database...");
await db.insert(skills).values(sampleSkills);
console.log(`✓ Inserted ${sampleSkills.length} sample skills`);
