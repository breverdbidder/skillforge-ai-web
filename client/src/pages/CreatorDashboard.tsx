import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Users,
  Code,
  Star,
  Download,
  Calendar,
  Plus,
  ArrowUpRight,
  Eye,
  Edit,
} from "lucide-react";
import { Link } from "wouter";

/**
 * Creator Dashboard - Earnings, analytics, and skill management
 * Shows creator profile, revenue, skill performance, and $500 bonus status
 */
export default function CreatorDashboard() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("month");

  // Fetch creator data
  const { data: profile, isLoading: profileLoading } = trpc.marketplace.getCreatorProfile.useQuery();
  const { data: earnings, isLoading: earningsLoading } = trpc.marketplace.getEarnings.useQuery({});
  const { data: mySkills } = trpc.marketplace.byAuthor.useQuery(
    { authorId: profile?.userId || 0 },
    { enabled: !!profile }
  );

  if (profileLoading || earningsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading creator dashboard...</p>
        </div>
      </div>
    );
  }

  const totalEarnings = profile?.totalEarnings || 0;
  const totalSkills = profile?.totalSkills || 0;
  const totalExecutions = profile?.totalExecutions || 0;
  const bonusClaimed = profile?.creatorBonusClaimed || 0;

  const stats = [
    {
      title: "Total Earnings",
      value: `$${(totalEarnings / 100).toFixed(2)}`,
      change: "+12.5%",
      icon: <DollarSign className="h-4 w-4" />,
      trend: "up",
    },
    {
      title: "Published Skills",
      value: totalSkills.toString(),
      change: "+2 this month",
      icon: <Code className="h-4 w-4" />,
      trend: "up",
    },
    {
      title: "Total Executions",
      value: totalExecutions.toLocaleString(),
      change: "+1.2K this week",
      icon: <TrendingUp className="h-4 w-4" />,
      trend: "up",
    },
    {
      title: "Avg Rating",
      value: "4.8",
      change: "Across all skills",
      icon: <Star className="h-4 w-4" />,
      trend: "neutral",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Creator Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your skills, track earnings, and grow your creator business
              </p>
            </div>
            <Link href="/marketplace">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Publish New Skill
              </Button>
            </Link>
          </div>

          {/* Creator Bonus Banner */}
          {!bonusClaimed && totalSkills === 0 && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Claim Your $500 Creator Bonus!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Publish your first skill and automatically receive $500 as a welcome bonus. No
                      strings attached.
                    </p>
                    <Link href="/marketplace">
                      <Button>
                        Get Started
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {bonusClaimed === 1 && (
            <Card className="border-green-500 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Creator Bonus Claimed!</h3>
                    <p className="text-sm text-muted-foreground">
                      You've received your $500 welcome bonus. Keep building amazing skills!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {stat.trend === "up" && (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  )}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList>
            <TabsTrigger value="skills">My Skills</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* My Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Published Skills</h2>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>

            {mySkills && mySkills.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySkills.map((skill) => (
                  <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{skill.category}</Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{skill.rating || "N/A"}</span>
                        </div>
                      </div>
                      <CardTitle className="line-clamp-1">{skill.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {skill.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Downloads</span>
                          <span className="font-medium">{skill.downloads || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Version</span>
                          <span className="font-medium">{skill.version || "1.0.0"}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Skills Published Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your creator portfolio by publishing your first skill
                  </p>
                  <Link href="/marketplace">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Publish Your First Skill
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Earnings Overview</h2>
              <div className="flex gap-2">
                <Button
                  variant={dateRange === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange("week")}
                >
                  Week
                </Button>
                <Button
                  variant={dateRange === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange("month")}
                >
                  Month
                </Button>
                <Button
                  variant={dateRange === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDateRange("year")}
                >
                  Year
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Gross Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${((totalEarnings / 0.8) / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Before commission</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Platform Fee (20%)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${(((totalEarnings / 0.8) * 0.2) / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Commission deducted</p>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Your Earnings (80%)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    ${(totalEarnings / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Available for payout</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest earnings from skill executions</CardDescription>
              </CardHeader>
              <CardContent>
                {earnings && earnings.length > 0 ? (
                  <div className="space-y-4">
                    {earnings.slice(0, 10).map((earning: any) => (
                      <div
                        key={earning.id}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium">Skill Execution</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(earning.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            +${(earning.netRevenue / 100).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {earning.payoutStatus}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No earnings yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Performance Analytics</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Execution Trends</CardTitle>
                  <CardDescription>Skill usage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Chart placeholder - Coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Growth</CardTitle>
                  <CardDescription>Earnings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Chart placeholder - Coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Skills</CardTitle>
                  <CardDescription>By execution count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mySkills?.slice(0, 5).map((skill, index) => (
                      <div key={skill.id} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{skill.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {skill.downloads || 0} executions
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                  <CardDescription>How users interact with your skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Success Rate</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Avg Rating</span>
                        <span className="text-sm font-medium">4.8/5.0</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: "96%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Repeat Users</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
