import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SkillsLibrary from "./pages/SkillsLibrary";
import SyncStatus from "./pages/SyncStatus";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import ExecutionHistory from "./pages/ExecutionHistory";
import Marketplace from "./pages/Marketplace";
import Scheduling from "@/pages/Scheduling";
import Teams from "@/pages/Teams";
import Login from "@/pages/Login";
import Notifications from "@/pages/Notifications";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      
      {/* Protected routes with DashboardLayout */}
      <Route>
        <DashboardLayout>
          <Switch>
            <Route path={"/"} component={Dashboard} />
        <Route path={"/skills"} component={SkillsLibrary} />
        <Route path={"/sync"} component={SyncStatus} />
        <Route path={"/analytics"} component={Analytics} />
        <Route path={"/settings"} component={Settings} />
        <Route path="/execution-history" component={ExecutionHistory} />
      <Route path="/marketplace" component={Marketplace} />
        <Route path="/scheduling" component={Scheduling} />
        <Route path="/teams" component={Teams} />
        <Route path="/notifications" component={Notifications} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
            <Route component={NotFound} />
          </Switch>
        </DashboardLayout>
      </Route>
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
