import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Zap,
  Shield,
  TrendingUp,
  Users,
  Code,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  DollarSign,
} from "lucide-react";

/**
 * Public Homepage - SkillForgeAI: The Apify for AI Agents
 * Showcases the marketplace, Skills + MCP Runtime, and enterprise features
 */
export default function PublicHome() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Skills + MCP Runtime",
      description: "Progressive disclosure engine with multiple skills from one MCP and vice versa",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Quality Validated",
      description: "SkillForge 7/10+ validation with 11 thinking lenses and multi-agent synthesis",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Creator Earnings",
      description: "80% revenue share with $500 bonus for your first published skill",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-Tenant Privacy",
      description: "Private workspaces with team collaboration and enterprise-grade security",
    },
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      executions: "100/month",
      features: ["Basic skills", "Community support", "Public marketplace"],
    },
    {
      name: "Creator",
      price: "$29",
      executions: "10K/month",
      features: ["Publish skills", "Earn 80% revenue", "$500 first skill bonus", "Priority support"],
      popular: true,
    },
    {
      name: "Professional",
      price: "$199",
      executions: "100K/month",
      features: ["Team workspaces", "Private skills", "Advanced analytics", "API access"],
    },
    {
      name: "Enterprise",
      price: "$999",
      executions: "Unlimited",
      features: ["Custom development", "Dedicated support", "SLA guarantee", "Private marketplace"],
    },
  ];

  const featuredSkills = [
    {
      name: "Code Analyzer",
      category: "Development",
      rating: 4.8,
      executions: "12.5K",
      price: "Free",
    },
    {
      name: "Content Generator",
      category: "Marketing",
      rating: 4.9,
      executions: "8.2K",
      price: "$0.05/exec",
    },
    {
      name: "Data Pipeline",
      category: "Data",
      rating: 4.7,
      executions: "5.1K",
      price: "$29/month",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SkillForgeAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#marketplace" className="text-sm hover:text-primary transition-colors">
              Marketplace
            </a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#docs" className="text-sm hover:text-primary transition-colors">
              Docs
            </a>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="sm">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            The Apify for AI Agents
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Enterprise Skills Marketplace for AI Agents
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Build, publish, and monetize AI agent skills with our production-ready runtime. Join the
            ecosystem where creators earn 80% revenue and get $500 for their first skill.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketplace">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Marketplace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Start Creating
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>1,000+ Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>10M+ Executions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>$200K+ Paid to Creators</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why SkillForgeAI?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for creators, designed for scale, optimized for AI agents
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section id="marketplace" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Skills</h2>
              <p className="text-muted-foreground">Curated by our quality validation team</p>
            </div>
            <Link href="/marketplace">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredSkills.map((skill, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{skill.category}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{skill.rating}</span>
                    </div>
                  </div>
                  <CardTitle>{skill.name}</CardTitle>
                  <CardDescription>{skill.executions} executions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.price}</span>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills + MCP Runtime */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Zap className="h-3 w-3 mr-1" />
              Production Runtime
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Skills + MCP Runtime</h2>
            <p className="text-muted-foreground">
              Progressive disclosure engine that loads skills in three levels for optimal context efficiency
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Multiple Skills from One MCP</h3>
                    <p className="text-sm text-muted-foreground">
                      Access multiple skills through a single MCP server connection
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Multiple MCPs for One Skill</h3>
                    <p className="text-sm text-muted-foreground">
                      Combine capabilities from multiple MCP servers in a single skill
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Progressive Disclosure</h3>
                    <p className="text-sm text-muted-foreground">
                      Three-level loading: metadata → parameters → full implementation
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <Button variant="outline" className="w-full">
                  <Code className="mr-2 h-4 w-4" />
                  View Runtime Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={tier.popular ? "border-primary shadow-lg relative" : ""}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.price !== "$0" && <span className="text-muted-foreground">/month</span>}
                  </div>
                  <CardDescription className="mt-2">{tier.executions}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full mt-6"
                    variant={tier.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Build the Future of AI Agents?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join 10,000+ developers building and monetizing AI agent skills. Get $500 for your first
            published skill.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <DollarSign className="mr-2 h-5 w-5" />
                Claim $500 Bonus
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Explore Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">SkillForgeAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The Apify for AI Agents. Enterprise skills marketplace with production runtime.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#marketplace" className="hover:text-foreground transition-colors">
                    Marketplace
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Developers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/breverdbidder/skills-mcp-runtime"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Runtime GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/breverdbidder/skillforge-ai-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Platform GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Creator Bonus
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2026 SkillForgeAI. Built with independence in mind. No vendor lock-in.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
