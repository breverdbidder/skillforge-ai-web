import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
  Users,
  Star,
  Info,
} from "lucide-react";

const notificationIcons = {
  task_completed: CheckCircle,
  task_failed: XCircle,
  team_invitation: Users,
  skill_published: Star,
  review_received: Star,
  system_alert: AlertCircle,
};

const notificationColors = {
  task_completed: "text-green-500",
  task_failed: "text-red-500",
  team_invitation: "text-blue-500",
  skill_published: "text-purple-500",
  review_received: "text-yellow-500",
  system_alert: "text-orange-500",
};

export default function Notifications() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const utils = trpc.useUtils();

  const { data: notifications, isLoading } = trpc.notifications.getAll.useQuery();
  const { data: unreadCount } = trpc.notifications.getUnreadCount.useQuery();

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      utils.notifications.getAll.invalidate();
      utils.notifications.getUnreadCount.invalidate();
    },
  });

  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      toast.success("All notifications marked as read");
      utils.notifications.getAll.invalidate();
      utils.notifications.getUnreadCount.invalidate();
    },
  });

  const deleteMutation = trpc.notifications.delete.useMutation({
    onSuccess: () => {
      toast.success("Notification deleted");
      utils.notifications.getAll.invalidate();
      utils.notifications.getUnreadCount.invalidate();
    },
  });

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate({ notificationId });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (notificationId: number) => {
    deleteMutation.mutate({ notificationId });
  };

  const filteredNotifications = notifications?.filter((notification) => {
    if (filter === "unread") {
      return notification.read === 0;
    }
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Notifications
          </h1>
          <p className="text-slate-400 mt-2">
            Stay updated with your tasks, teams, and system alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount && unreadCount.count > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All Notifications
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "outline"}
          onClick={() => setFilter("unread")}
        >
          Unread {unreadCount && unreadCount.count > 0 && `(${unreadCount.count})`}
        </Button>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading notifications...</div>
      ) : filteredNotifications && filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = notificationIcons[notification.type];
            const iconColor = notificationColors[notification.type];

            return (
              <Card
                key={notification.id}
                className={`p-4 border-slate-800 bg-slate-900/50 backdrop-blur transition-all hover:bg-slate-900/70 ${
                  notification.read === 0 ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-white font-medium flex items-center gap-2">
                          {notification.title}
                          {notification.read === 0 && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </h3>
                        {notification.message && (
                          <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-slate-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          {notification.link && (
                            <a
                              href={notification.link}
                              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              View Details <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.read === 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            <CheckCheck className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 border-slate-800 bg-slate-900/50 backdrop-blur text-center">
          <Info className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
          <p className="text-slate-400">
            {filter === "unread"
              ? "You're all caught up! No unread notifications."
              : "You don't have any notifications yet."}
          </p>
        </Card>
      )}
    </div>
  );
}
