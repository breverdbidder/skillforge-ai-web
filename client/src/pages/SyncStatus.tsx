import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { GitHubActivityFeed } from "@/components/GitHubActivityFeed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function SyncStatus() {
  const [countdown, setCountdown] = useState(0);
  const { data: syncStatus, isLoading, refetch } = trpc.sync.lastSuccess.useQuery();
  const triggerSync = trpc.sync.trigger.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Countdown timer for next sync (1 hour default)
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const { data: syncHistory } = trpc.sync.history.useQuery({ limit: 10 });
  const successRate = syncHistory?.length 
    ? (syncHistory.filter((h: any) => h.status === "success").length / syncHistory.length) * 100
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Sync Status</h1>
          <p className="text-muted-foreground mt-2">
            Monitor real-time synchronization status and history
          </p>
        </div>
        <Button
          onClick={() => triggerSync.mutate()}
          disabled={triggerSync.isPending}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${triggerSync.isPending ? "animate-spin" : ""}`} />
          Trigger Sync
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="skill-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              {syncStatus?.status === "in_progress" ? (
                <>
                  <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-2xl font-bold">Syncing</span>
                </>
              ) : syncStatus?.status === "success" ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">Idle</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">Pending</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Last sync: {syncStatus?.completedAt 
                ? formatDistanceToNow(new Date(syncStatus.completedAt), { addSuffix: true })
                : "Never"}
            </p>
          </CardContent>
        </Card>

        <Card className="skill-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCountdown(countdown)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next sync in {formatCountdown(countdown)}
            </p>
            <Progress value={(countdown / 3600) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="skill-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(successRate)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {syncHistory?.filter((h: any) => h.status === "success").length || 0} successful syncs
            </p>
            <Progress value={successRate} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Sync History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
          <CardDescription>Recent synchronization attempts and results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syncHistory && syncHistory.length > 0 ? (
              syncHistory.map((sync: any) => (
                <div key={sync.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="mt-1">
                    {sync.status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : sync.status === "failed" ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {sync.type === "manual" ? "Manual Sync" : "Scheduled Sync"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(sync.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge
                        variant={
                          sync.status === "success" 
                            ? "default" 
                            : sync.status === "failed" 
                            ? "destructive" 
                            : "secondary"
                        }
                      >
                        {sync.status}
                      </Badge>
                    </div>
                    {sync.details && (
                      <p className="text-sm text-muted-foreground mt-2">{sync.details}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Skills synced: {sync.skillsSynced || 0}</span>
                      <span>Duration: {sync.duration || 0}s</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No sync history available yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Repository Status */}
      <Card>
        <CardHeader>
          <CardTitle>Repository Connections</CardTitle>
          <CardDescription>Status of connected GitHub repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "skillforge-ai", status: "connected", lastCommit: "2 hours ago" },
              { name: "kimi-kilo-craft-integration", status: "connected", lastCommit: "5 hours ago" },
              { name: "skillforge-craft-extraction", status: "connected", lastCommit: "1 day ago" },
            ].map((repo) => (
              <div key={repo.name} className="flex items-center justify-between p-3 glass rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">{repo.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last commit: {repo.lastCommit}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{repo.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GitHub Activity Feed */}
      <GitHubActivityFeed />
    </div>
  );
}
