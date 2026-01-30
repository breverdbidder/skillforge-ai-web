import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Shield,
  Zap,
  Users,
  Lock,
  HeadphonesIcon,
  Server,
  Globe,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

/**
 * Enterprise Page - Custom development, SLAs, and enterprise features
 * Showcases enterprise-grade capabilities for large organizations
 */
export default function Enterprise() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "99.9% SLA Guarantee",
      description: "Enterprise-grade uptime with guaranteed service levels and automatic failover",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Private Marketplace",
      description: "Host your own private skill marketplace with custom branding and access control",
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: "Dedicated Infrastructure",
      description: "Isolated compute resources and database instances for maximum performance",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Dedicated Account Manager",
      description: "Personal account manager and technical architect for your success",
    },
    {
      icon: <HeadphonesIcon className="h-6 w-6" />,
      title: "24/7 Priority Support",
      description: "Phone, email, and Slack support with 1-hour response time guarantee",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "On-Premise Deployment",
      description: "Deploy SkillForgeAI on your own infrastructure for complete control",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Custom Integrations",
      description: "Bespoke integrations with your existing tools and workflows",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Custom Skill Development",
      description: "Our team builds production-ready skills tailored to your needs",
    },
  ];

  const useCases = [
    {
      title: "Financial Services",
      description: "Automate compliance checks, risk analysis, and portfolio management with custom AI agent skills",
      benefits: [
        "Regulatory compliance automation",
        "Real-time risk monitoring",
        "Secure on-premise deployment",
        "Audit trail and logging",
      ],
    },
    {
      title: "Healthcare",
      description: "Build HIPAA-compliant AI agents for patient care, diagnostics, and administrative tasks",
      benefits: [
        "HIPAA compliance built-in",
        "Patient data privacy",
        "Clinical decision support",
        "Integration with EHR systems",
      ],
    },
    {
      title: "Enterprise Software",
      description: "Embed AI agent capabilities into your SaaS products with our white-label solution",
      benefits: [
        "White-label marketplace",
        "Custom branding",
        "Revenue sharing options",
        "API-first architecture",
      ],
    },
    {
      title: "Manufacturing",
      description: "Optimize supply chain, quality control, and predictive maintenance with AI agents",
      benefits: [
        "IoT sensor integration",
        "Predictive analytics",
        "Real-time monitoring",
        "Custom workflow automation",
      ],
    },
  ];

  const pricing = [
    {
      feature: "Base Platform",
      value: "$999/month",
    },
    {
      feature: "Unlimited Executions",
      value: "Included",
    },
    {
      feature: "Dedicated Infrastructure",
      value: "+$500/month",
    },
    {
      feature: "On-Premise Deployment",
      value: "+$2,000/month",
    },
    {
      feature: "Custom Skill Development",
      value: "Starting at $5,000/skill",
    },
    {
      feature: "24/7 Phone Support",
      value: "+$499/month",
    },
  ];

  const testimonials = [
    {
      quote: "SkillForgeAI transformed how we deploy AI agents across our organization. The private marketplace and custom skills saved us months of development time.",
      author: "Sarah Chen",
      role: "CTO, TechCorp",
      company: "Fortune 500 Technology Company",
    },
    {
      quote: "The enterprise support and SLA guarantees give us confidence to run mission-critical workflows on SkillForgeAI. Highly recommended.",
      author: "Michael Rodriguez",
      role: "VP of Engineering, FinanceAI",
      company: "Leading Financial Services Firm",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <Building2 className="h-3 w-3 mr-1" />
              Enterprise Solutions
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Enterprise-Grade AI Agent Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Deploy SkillForgeAI at scale with dedicated infrastructure, custom development, 
              and enterprise support. Built for organizations that demand reliability, security, and performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Schedule Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-sm text-muted-foreground">Uptime SLA</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">&lt;1hr</div>
                <p className="text-sm text-muted-foreground">Support Response</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Enterprise Customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">10M+</div>
                <p className="text-sm text-muted-foreground">Daily Executions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Features</h2>
            <p className="text-muted-foreground">
              Everything you need to deploy AI agents at enterprise scale
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Use Cases</h2>
            <p className="text-muted-foreground">
              See how leading organizations use SkillForgeAI
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, bIndex) => (
                      <li key={bIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Development */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" variant="secondary">
                Custom Development
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                We Build Skills For You
              </h2>
              <p className="text-muted-foreground mb-6">
                Don't have time to build skills yourself? Our team of AI engineers will create 
                production-ready skills tailored to your specific needs. From initial requirements 
                to deployment and maintenance, we handle everything.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Requirements gathering and analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Custom skill development with SkillForge 7/10+ validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Integration with your existing systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Testing, deployment, and ongoing maintenance</span>
                </li>
              </ul>
              <Link href="/contact">
                <Button size="lg">
                  Request Custom Development
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Development Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Discovery Call</p>
                      <p className="text-sm text-muted-foreground">
                        Understand your requirements and goals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Proposal & Timeline</p>
                      <p className="text-sm text-muted-foreground">
                        Detailed scope, pricing, and delivery schedule
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Development</p>
                      <p className="text-sm text-muted-foreground">
                        Build with weekly progress updates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Deployment</p>
                      <p className="text-sm text-muted-foreground">
                        Launch to production with monitoring
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise Pricing</h2>
            <p className="text-muted-foreground">
              Flexible pricing to match your organization's needs
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <table className="w-full">
                <tbody>
                  {pricing.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-4 font-medium">{item.feature}</td>
                      <td className="py-4 text-right text-muted-foreground">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  * All prices are starting points. Contact us for a custom quote based on your specific requirements.
                </p>
                <Link href="/contact">
                  <Button className="w-full" size="lg">
                    Get Custom Quote
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-muted-foreground">
              See what enterprise customers say about SkillForgeAI
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Schedule a demo with our enterprise team to see how SkillForgeAI can transform your organization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Schedule Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View All Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
