import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Book,
  Code,
  Zap,
  Search,
  ExternalLink,
  Github,
  FileText,
  Rocket,
  Users,
  Shield,
  Terminal,
} from "lucide-react";

/**
 * Documentation Hub - Comprehensive guides and API reference
 * Includes Skills + MCP Runtime documentation, API docs, and tutorials
 */
export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");

  const quickStart = [
    {
      title: "Getting Started",
      description: "Set up your account and publish your first skill in 5 minutes",
      icon: <Rocket className="h-6 w-6" />,
      link: "#getting-started",
    },
    {
      title: "Skills + MCP Runtime",
      description: "Learn how the progressive disclosure engine works",
      icon: <Zap className="h-6 w-6" />,
      link: "#runtime",
    },
    {
      title: "API Reference",
      description: "Complete API documentation with examples",
      icon: <Code className="h-6 w-6" />,
      link: "#api",
    },
    {
      title: "Creator Guide",
      description: "Best practices for building and monetizing skills",
      icon: <Users className="h-6 w-6" />,
      link: "#creator",
    },
  ];

  const runtimeDocs = [
    {
      title: "Architecture Overview",
      description: "Understanding the Skills + MCP Runtime architecture",
      content: `The Skills + MCP Runtime is a progressive disclosure engine that efficiently loads skills in three levels:

**Level 1: Metadata**
- Skill name, description, category
- Author information
- Pricing model
- MCP requirements

**Level 2: Parameters**
- Input/output schema
- Configuration options
- Environment variables
- Dependencies

**Level 3: Implementation**
- Full skill code
- Execution logic
- Error handling
- Logging

This approach minimizes context usage and enables efficient skill discovery.`,
    },
    {
      title: "Multiple Skills from One MCP",
      description: "How to access multiple skills through a single MCP connection",
      content: `A single MCP server can expose multiple skills, allowing efficient resource usage:

\`\`\`python
# Example: Notion MCP with multiple skills
notion_mcp = {
  "name": "notion",
  "skills": [
    "create_page",
    "update_page",
    "search_database",
    "query_database"
  ]
}
\`\`\`

The runtime automatically discovers all available skills from connected MCPs.`,
    },
    {
      title: "Multiple MCPs for One Skill",
      description: "Combining capabilities from multiple MCP servers",
      content: `Complex skills can leverage multiple MCP servers:

\`\`\`python
# Example: Content pipeline skill
skill = {
  "name": "content_pipeline",
  "mcps": [
    "notion",  # Read content
    "openai",  # Generate text
    "slack"    # Send notification
  ]
}
\`\`\`

The runtime manages MCP connections and coordinates execution.`,
    },
    {
      title: "Integration Guide",
      description: "How to integrate the runtime into your AI agent",
      content: `Install the Skills + MCP Runtime:

\`\`\`bash
pip install skills-mcp-runtime
\`\`\`

Basic usage:

\`\`\`python
from skills_mcp_runtime import Agent, ProgressiveDisclosure

# Initialize agent
agent = Agent()

# Load skill metadata only
skill_meta = agent.discover_skill("send-report")

# Load parameters when needed
skill_params = agent.load_parameters("send-report")

# Execute skill with full implementation
result = agent.execute_skill("send-report", {
  "report_data": data,
  "recipients": ["user@example.com"]
})
\`\`\``,
    },
  ];

  const apiDocs = [
    {
      endpoint: "POST /api/skills/execute",
      description: "Execute a skill",
      example: `{
  "skillId": 123,
  "parameters": {
    "input": "data"
  }
}`,
    },
    {
      endpoint: "GET /api/marketplace/skills",
      description: "Browse marketplace skills",
      example: `{
  "category": "Development",
  "search": "code analyzer",
  "limit": 20
}`,
    },
    {
      endpoint: "POST /api/marketplace/publish",
      description: "Publish a new skill",
      example: `{
  "name": "My Skill",
  "description": "...",
  "code": "...",
  "pricingModel": "free"
}`,
    },
    {
      endpoint: "GET /api/creator/earnings",
      description: "Get creator earnings",
      example: `{
  "startDate": "2026-01-01",
  "endDate": "2026-01-31"
}`,
    },
  ];

  const tutorials = [
    {
      title: "Build Your First Skill",
      duration: "10 minutes",
      difficulty: "Beginner",
      steps: [
        "Set up your development environment",
        "Create a skill template",
        "Write skill logic",
        "Test locally",
        "Publish to marketplace",
      ],
    },
    {
      title: "Monetize Your Skills",
      duration: "15 minutes",
      difficulty: "Intermediate",
      steps: [
        "Choose a pricing model",
        "Set up payment integration",
        "Configure skill pricing",
        "Track earnings",
        "Optimize for revenue",
      ],
    },
    {
      title: "Advanced MCP Integration",
      duration: "30 minutes",
      difficulty: "Advanced",
      steps: [
        "Understand MCP protocol",
        "Connect multiple MCPs",
        "Handle authentication",
        "Implement error handling",
        "Deploy to production",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            <Book className="h-3 w-3 mr-1" />
            Documentation
          </Badge>
          <h1 className="text-5xl font-bold mb-4">SkillForgeAI Docs</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Everything you need to build, publish, and monetize AI agent skills
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search documentation..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Quick Start</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStart.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full">
                    Read More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Documentation */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="runtime" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="runtime">
                <Zap className="h-4 w-4 mr-2" />
                Runtime
              </TabsTrigger>
              <TabsTrigger value="api">
                <Code className="h-4 w-4 mr-2" />
                API
              </TabsTrigger>
              <TabsTrigger value="tutorials">
                <Book className="h-4 w-4 mr-2" />
                Tutorials
              </TabsTrigger>
              <TabsTrigger value="github">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </TabsTrigger>
            </TabsList>

            {/* Runtime Documentation */}
            <TabsContent value="runtime" className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Skills + MCP Runtime</h2>
                <p className="text-muted-foreground">
                  Learn how the progressive disclosure engine works and how to integrate it into your AI agents
                </p>
              </div>
              <div className="space-y-6">
                {runtimeDocs.map((doc, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{doc.title}</CardTitle>
                      <CardDescription>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                          {doc.content}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* API Documentation */}
            <TabsContent value="api" className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">API Reference</h2>
                <p className="text-muted-foreground">
                  Complete API documentation with request/response examples
                </p>
              </div>
              <div className="space-y-6">
                {apiDocs.map((api, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {api.endpoint.split(" ")[0]}
                        </Badge>
                        <code className="text-sm">{api.endpoint.split(" ")[1]}</code>
                      </div>
                      <CardDescription>{api.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Example Request:</h4>
                          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                            {api.example}
                          </pre>
                        </div>
                        <Button variant="outline" size="sm">
                          <Terminal className="mr-2 h-4 w-4" />
                          Try in API Playground
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Tutorials */}
            <TabsContent value="tutorials" className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Tutorials</h2>
                <p className="text-muted-foreground">
                  Step-by-step guides to help you master SkillForgeAI
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{tutorial.difficulty}</Badge>
                        <Badge variant="outline">{tutorial.duration}</Badge>
                      </div>
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4">
                        {tutorial.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="font-bold text-primary">{stepIndex + 1}.</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" size="sm" className="w-full">
                        Start Tutorial
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* GitHub */}
            <TabsContent value="github" className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">GitHub Repositories</h2>
                <p className="text-muted-foreground">
                  Explore our open-source code and contribute to the project
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Github className="h-5 w-5" />
                      <Badge>Python</Badge>
                    </div>
                    <CardTitle>Skills + MCP Runtime</CardTitle>
                    <CardDescription>
                      Progressive disclosure engine and MCP integration layer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>⭐ 1.2K stars</span>
                        <span>🔀 156 forks</span>
                      </div>
                      <a
                        href="https://github.com/breverdbidder/skills-mcp-runtime"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full">
                          <Github className="mr-2 h-4 w-4" />
                          View on GitHub
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Github className="h-5 w-5" />
                      <Badge>TypeScript</Badge>
                    </div>
                    <CardTitle>SkillForgeAI Platform</CardTitle>
                    <CardDescription>
                      Full-stack marketplace platform with React + Node.js + PostgreSQL
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>⭐ 856 stars</span>
                        <span>🔀 92 forks</span>
                      </div>
                      <a
                        href="https://github.com/breverdbidder/skillforge-ai-web"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full">
                          <Github className="mr-2 h-4 w-4" />
                          View on GitHub
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Blog</CardTitle>
                <CardDescription>
                  Latest updates, tutorials, and best practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Read Blog
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Join our Discord community and connect with other creators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Join Discord
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Support</CardTitle>
                <CardDescription>
                  Get help from our support team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
