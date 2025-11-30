import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Members from "./pages/Members";
import Contests from "./pages/Contests";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Settings from "./pages/Settings";

// Profile Sub-pages
import ProfileTeams from "./pages/profile/ProfileTeams";
import ProfilePlatforms from "./pages/profile/ProfilePlatforms";
import ProfileStats from "./pages/profile/ProfileStats";
import ProfileAchievements from "./pages/profile/ProfileAchievements";
import ProfileNotifications from "./pages/profile/ProfileNotifications";
import ProfilePrivacy from "./pages/profile/ProfilePrivacy";
import ProfileInvitations from "./pages/profile/ProfileInvitations";
import ProfileProgress from "./pages/profile/ProfileProgress";
import ProfileLeaderboards from "./pages/profile/ProfileLeaderboards";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Protected Routes wrapped in DashboardLayout */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/:role" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />

              {/* Profile Routes */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/teams" element={<ProfileTeams />} />
              <Route path="/profile/platforms" element={<ProfilePlatforms />} />
              <Route path="/profile/stats" element={<ProfileStats />} />
              <Route path="/profile/achievements" element={<ProfileAchievements />} />
              <Route path="/profile/notifications" element={<ProfileNotifications />} />
              <Route path="/profile/privacy" element={<ProfilePrivacy />} />
              <Route path="/profile/invitations" element={<ProfileInvitations />} />
              <Route path="/profile/progress" element={<ProfileProgress />} />
              <Route path="/profile/leaderboards" element={<ProfileLeaderboards />} />

              <Route path="/members" element={<Members />} />
              <Route path="/contests" element={<Contests />} />
              <Route path="/tasks" element={<Tasks />} />
              {/* Add other protected routes here */}
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
