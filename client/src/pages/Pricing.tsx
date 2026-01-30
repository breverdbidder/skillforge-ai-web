import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, X, Zap, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Pricing Page - Comprehensive tier comparison
 * Shows all 4 tiers with detailed features and FAQ
 */
export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for trying out SkillForgeAI",
      executions: "100 executions/month",
      features: [
        { name: "Access to public marketplace", included: true },
        { name: "Basic skills execution", included: true },
        { name: "Community support", included: true },
        { name: "Public skill library", included: true },
        { name: "Publish skills", included: false },
        { name: "Team workspaces", included: false },
        { name: "Private skills", included: false },
        { name: "Priority support", included: false },
        { name: "API access", included: false },
        { name: "Advanced analytics", included: false },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Creator",
      price: 29,
      period: "month",
      description: "For indie developers building and monetizing skills",
      executions: "10,000 executions/month",
      features: [
        { name: "Everything in Free", included: true },
        { name: "Publish unlimited skills", included: true },
        { name: "Earn 80% revenue share", included: true },
        { name: "$500 first skill bonus", included: true },
        { name: "Priority support", included: true },
        { name: "Creator analytics dashboard", included: true },
        { name: "Team workspaces (up to 3)", included: true },
        { name: "Private skills", included: false },
        { name: "API access", included: false },
        { name: "Custom branding", included: false },
      ],
      cta: "Start Creating",
      popular: true,
    },
    {
      name: "Professional",
      price: 199,
      period: "month",
      description: "For teams building production AI agent systems",
      executions: "100,000 executions/month",
      features: [
        { name: "Everything in Creator", included: true },
        { name: "Unlimited team members", included: true },
        { name: "Private skill library", included: true },
        { name: "Advanced analytics", included: true },
        { name: "API access", included: true },
        { name: "Webhook integrations", included: true },
        { name: "Custom skill validation", included: true },
        { name: "Priority email support", included: true },
        { name: "SLA guarantee", included: false },
        { name: "Dedicated account manager", included: false },
      ],
      cta: "Go Professional",
      popular: false,
    },
    {
      name: "Enterprise",
      price: 999,
      period: "month",
      description: "For large organizations with custom needs",
      executions: "Unlimited executions",
      features: [
        { name: "Everything in Professional", included: true },
        { name: "Unlimited executions", included: true },
        { name: "Custom skill development", included: true },
        { name: "Dedicated infrastructure", included: true },
        { name: "99.9% SLA guarantee", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "Private marketplace", included: true },
        { name: "Custom integrations", included: true },
        { name: "24/7 phone support", included: true },
        { name: "On-premise deployment option", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "What counts as an execution?",
      answer:
        "An execution is a single run of a skill. For example, if you run a 'Code Analyzer' skill on one file, that's one execution. Executions reset monthly.",
    },
    {
      question: "How does the creator revenue share work?",
      answer:
        "When someone uses your paid skill, you earn 80% of the revenue. The platform takes 20% commission. Payouts are processed monthly to your connected account.",
    },
    {
      question: "What is the $500 first skill bonus?",
      answer:
        "When you publish your first skill to the marketplace (Creator tier or higher), you automatically receive $500 as a welcome bonus. No strings attached.",
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer:
        "Yes! You can change your plan anytime. Upgrades take effect immediately. Downgrades take effect at the end of your current billing cycle.",
    },
    {
      question: "What happens if I exceed my execution limit?",
      answer:
        "You'll receive a notification when you reach 80% of your limit. If you exceed it, you can upgrade your plan or purchase additional execution units at $0.01 per execution.",
    },
    {
      question: "Do you offer annual billing?",
      answer:
        "Yes! Annual billing gives you 2 months free (save 17%). Contact us for annual pricing on Professional and Enterprise tiers.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and wire transfer for Enterprise customers.",
    },
    {
      question: "Is there a free trial for paid plans?",
      answer:
        "Yes! All paid plans come with a 14-day free trial. No credit card required. Cancel anytime during the trial period.",
    },
  ];

  const addons = [
    {
      name: "Additional Executions",
      price: "$0.01 per execution",
      description: "Pay as you go for executions beyond your plan limit",
    },
    {
      name: "Premium Support",
      price: "$99/month",
      description: "24/7 priority support with 1-hour response time",
    },
    {
      name: "Custom Skill Development",
      price: "Starting at $5,000",
      description: "Our team builds custom skills for your specific needs",
    },
    {
      name: "Private Marketplace",
      price: "$499/month",
      description: "Host your own private skill marketplace for your organization",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            <Zap className="h-3 w-3 mr-1" />
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
          <Tabs defaultValue="monthly" className="w-full max-w-xs mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="annual">
                Annual
                <Badge variant="secondary" className="ml-2 text-xs">
                  Save 17%
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${
                  tier.popular ? "border-primary shadow-xl scale-105" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold">${tier.price}</span>
                    {tier.price > 0 && (
                      <span className="text-muted-foreground">/{tier.period}</span>
                    )}
                  </div>
                  <CardDescription className="text-base">{tier.description}</CardDescription>
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{tier.executions}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm">
                        {feature.included ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included ? "" : "text-muted-foreground line-through"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href={tier.name === "Enterprise" ? "/contact" : "/login"}>
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Add-ons & Extensions</h2>
            <p className="text-muted-foreground">
              Enhance your plan with additional features and services
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <div className="text-2xl font-bold text-primary mt-2">{addon.price}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{addon.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Detailed Feature Comparison</h2>
            <p className="text-muted-foreground">
              See exactly what's included in each plan
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.name} className="text-center p-4 font-semibold">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tiers[0].features.map((_, featureIndex) => (
                  <tr key={featureIndex} className="border-b hover:bg-muted/50">
                    <td className="p-4 text-sm">
                      {tiers[0].features[featureIndex].name}
                    </td>
                    {tiers.map((tier) => (
                      <td key={tier.name} className="text-center p-4">
                        {tier.features[featureIndex]?.included ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our team is here to help you choose the right plan for your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">Contact Sales</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
