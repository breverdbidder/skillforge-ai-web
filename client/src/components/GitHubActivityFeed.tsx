import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCommit, GitBranch, FileCode, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function GitHubActivityFeed() {
  const { data: activity, isLoading } = trpc.github.activity.useQuery({ limit: 20 });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            GitHub Activity Feed
          </CardTitle>
          <CardDescription>Loading recent commits...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activity || activity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            GitHub Activity Feed
          </CardTitle>
          <CardDescription>Recent commits from connected repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <GitCommit className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCommit className="h-5 w-5" />
          GitHub Activity Feed
        </CardTitle>
        <CardDescription>Recent commits from connected repositories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activity.map((commit: any) => (
            <div
              key={commit.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {commit.status === "success" ? (
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <GitCommit className="h-4 w-4 text-green-500" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <GitCommit className="h-4 w-4 text-red-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{commit.repository}</span>
                  <Badge variant="outline" className="text-xs">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {commit.branch}
                  </Badge>
                </div>

                <p className="text-sm text-foreground mb-2">{commit.commitMessage}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {commit.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {commit.author}
                    </div>
                  )}
                  {commit.filesChanged !== null && commit.filesChanged > 0 && (
                    <div className="flex items-center gap-1">
                      <FileCode className="h-3 w-3" />
                      {commit.filesChanged} {commit.filesChanged === 1 ? "file" : "files"}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(commit.createdAt), { addSuffix: true })}
                  </div>
                </div>

                {commit.commitHash && (
                  <div className="mt-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {commit.commitHash.substring(0, 7)}
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
