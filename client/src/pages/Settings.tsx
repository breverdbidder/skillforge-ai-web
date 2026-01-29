import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings as SettingsIcon, Save, Key, Clock, Bell } from "lucide-react";

export default function Settings() {
  const { data: settings, refetch } = trpc.settings.getAll.useQuery();
  const updateSetting = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success("Settings saved successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to save settings");
    },
  });

  const [syncInterval, setSyncInterval] = useState("24");
  const [githubToken, setGithubToken] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const handleSaveSettings = () => {
    updateSetting.mutate({ key: "sync_interval", value: syncInterval });
    if (githubToken) {
      updateSetting.mutate({ key: "github_token", value: githubToken });
    }
    updateSetting.mutate({ key: "notifications_enabled", value: notificationsEnabled.toString() });
    updateSetting.mutate({ key: "auto_sync_enabled", value: autoSyncEnabled.toString() });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <SettingsIcon className="h-10 w-10" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure sync intervals, credentials, and notification preferences
        </p>
      </div>

      {/* Sync Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Sync Configuration
          </CardTitle>
          <CardDescription>
            Configure automatic synchronization settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="sync-interval">Sync Interval</Label>
            <Select value={syncInterval} onValueChange={setSyncInterval}>
              <SelectTrigger id="sync-interval">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Every Hour</SelectItem>
                <SelectItem value="6">Every 6 Hours</SelectItem>
                <SelectItem value="12">Every 12 Hours</SelectItem>
                <SelectItem value="24">Every 24 Hours (Daily)</SelectItem>
                <SelectItem value="168">Every Week</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How often to automatically sync skills from connected repositories
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-sync">Enable Auto-Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync skills at the configured interval
              </p>
            </div>
            <Switch
              id="auto-sync"
              checked={autoSyncEnabled}
              onCheckedChange={setAutoSyncEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* GitHub Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            GitHub Credentials
          </CardTitle>
          <CardDescription>
            Manage GitHub API tokens for repository access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github-token">GitHub Personal Access Token</Label>
            <Input
              id="github-token"
              type="password"
              placeholder="ghp_••••••••••••••••••••••••••••••••"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Required for accessing private repositories and pushing updates
            </p>
          </div>

          <div className="p-4 glass rounded-lg">
            <h4 className="font-medium mb-2">Connected Repositories</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>skillforge-ai</span>
                <span className="text-green-500">✓ Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>kimi-kilo-craft-integration</span>
                <span className="text-green-500">✓ Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>skillforge-craft-extraction</span>
                <span className="text-green-500">✓ Connected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for sync events and errors
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sync-success">Sync Success Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when syncs complete successfully
              </p>
            </div>
            <Switch id="sync-success" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sync-errors">Sync Error Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when syncs fail or encounter errors
              </p>
            </div>
            <Switch id="sync-errors" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={updateSetting.isPending}
          className="gap-2"
          size="lg"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
