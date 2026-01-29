import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, Activity, GitBranch, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: overview, isLoading } = trpc.analytics.overview.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Skills",
      value: overview?.skills.total || 0,
      description: `${overview?.skills.enabled || 0} enabled`,
      icon: Library,
      trend: "+12% from last month",
    },
    {
      title: "Sync Success Rate",
      value: `${Math.round(overview?.sync.successRate || 0)}%`,
      description: `${overview?.sync.successfulSyncs || 0} successful`,
      icon: Activity,
      trend: (overview?.sync.successRate ?? 0) >= 90 ? "Excellent" : "Good",
    },
    {
      title: "Total Syncs",
      value: overview?.sync.totalSyncs || 0,
      description: `${overview?.sync.failedSyncs || 0} failed`,
      icon: TrendingUp,
      trend: "Last 30 days",
    },
    {
      title: "GitHub Repos",
      value: 2,
      description: "All connected",
      icon: GitBranch,
      trend: "Active",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to <span className="gradient-text">SkillForge AI</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your ClawdBot skills, monitor sync status, and track GitHub activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="skill-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                <p className="text-xs text-primary mt-2">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Top Used Skills</CardTitle>
          <CardDescription>Most frequently executed skills this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overview?.topSkills && overview.topSkills.length > 0 ? (
              overview.topSkills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Library className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-sm text-muted-foreground">{skill.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{skill.usageCount}</p>
                    <p className="text-xs text-muted-foreground">executions</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No skill usage data yet. Start using skills to see statistics here.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <button className="glass rounded-lg p-4 text-left hover:bg-accent/50 transition-colors">
              <Library className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Browse Skills</h3>
              <p className="text-sm text-muted-foreground">
                Explore 100+ available skills
              </p>
            </button>
            <button className="glass rounded-lg p-4 text-left hover:bg-accent/50 transition-colors">
              <Activity className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Trigger Sync</h3>
              <p className="text-sm text-muted-foreground">
                Manually sync skills now
              </p>
            </button>
            <button className="glass rounded-lg p-4 text-left hover:bg-accent/50 transition-colors">
              <GitBranch className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold mb-1">View GitHub</h3>
              <p className="text-sm text-muted-foreground">
                Check recent commits
              </p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
