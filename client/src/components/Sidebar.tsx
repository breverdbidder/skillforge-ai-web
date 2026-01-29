import { Link, useLocation } from "wouter";
import {
  BookOpen,
  LayoutDashboard,
  Library,
  Settings,
  GitBranch,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Skills Library", href: "/skills", icon: Library },
  { name: "Sync Status", href: "/sync", icon: Activity },
  { name: "GitHub", href: "/github", icon: GitBranch },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Documentation", href: "/docs", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold gradient-text">SkillForge AI</h1>
          <p className="text-xs text-muted-foreground">Skills Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  "sidebar-nav-item",
                  isActive && "active"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="status-dot success"></div>
            <span className="text-sm font-medium">System Online</span>
          </div>
          <p className="text-xs text-muted-foreground">
            100+ skills ready • Last sync: 2m ago
          </p>
        </div>
      </div>
    </div>
  );
}
