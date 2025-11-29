import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    User,
    Settings,
    Shield,
    Users,
    Trophy,
    BarChart3,
    Bell,
    Code,
    BookOpen,
    Briefcase,
    Award,
    FileText,
    HelpCircle,
    Home,
    LogOut,
    LayoutDashboard
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout() {
    const { user, profile, loading, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || !profile) {
        return <Navigate to="/" replace />;
    }

    const isActive = (path: string) => location.pathname === path;

    const navSections = [
        {
            label: "General",
            items: [
                { label: "My Profile", route: "/profile", icon: User },
                { label: "Settings", route: "/settings", icon: Settings },
                { label: "Privacy Controls", route: "/profile/privacy", icon: Shield },
            ],
        },
        {
            label: "Activities",
            items: [
                { label: "My Teams", route: "/profile/teams", icon: Users },
                { label: "Invitations", route: "/profile/invitations", icon: Bell }, // Using Bell as proxy for invites
                { label: "Platform Profiles", route: "/profile/platforms", icon: Code },
                { label: "Achievements", route: "/profile/achievements", icon: Award },
            ],
        },
        {
            label: "Analytics",
            items: [
                { label: "My Stats", route: "/profile/stats", icon: BarChart3 },
                { label: "Progress Tracker", route: "/profile/progress", icon: Trophy },
                { label: "Leaderboards", route: "/profile/leaderboards", icon: Trophy },
            ],
        },
        {
            label: "Support",
            items: [
                { label: "Help Center", route: "/help", icon: HelpCircle },
                { label: "Report Issue", route: "/support/report", icon: FileText },
                { label: "Feedback", route: "/feedback", icon: FileText },
            ],
        },
    ];

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                <Sidebar>
                    <SidebarContent>
                        {/* User Panel */}
                        <div className="p-6 border-b border-border/50">
                            <div className="flex items-center space-x-3 mb-4">
                                <Avatar className="h-12 w-12 border-2 border-primary/20">
                                    <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {profile.fullName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-sm truncate">{profile.fullName}</p>
                                    <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className={`text-xs px-2 py-1 rounded-full bg-primary/10 text-primary inline-block font-medium capitalize`}>
                                    {profile.role.replace('_', ' ')}
                                </div>
                                <div className="h-2 w-2 rounded-full bg-green-500" title="Online" />
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        <div className="flex-1 overflow-y-auto py-4">
                            {navSections.map((section, index) => (
                                <SidebarGroup key={index}>
                                    <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                                    <SidebarGroupContent>
                                        <SidebarMenu>
                                            {section.items.map((item) => {
                                                const Icon = item.icon;
                                                return (
                                                    <SidebarMenuItem key={item.route}>
                                                        <SidebarMenuButton
                                                            onClick={() => navigate(item.route)}
                                                            isActive={isActive(item.route)}
                                                            tooltip={item.label}
                                                        >
                                                            <Icon className="w-4 h-4 mr-2" />
                                                            <span>{item.label}</span>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                );
                                            })}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </SidebarGroup>
                            ))}
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t border-border/50 mt-auto">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => navigate('/')}>
                                        <Home className="w-4 h-4 mr-2" />
                                        <span>Home</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={() => navigate(`/dashboard/${profile.role}`)}>
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        <span>Dashboard</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={signOut} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </div>
                    </SidebarContent>
                </Sidebar>

                <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                    {/* Header */}
                    <Header
                        onRoleSelect={(role) => navigate(`/dashboard/${role}`)}
                        onAuthModal={() => { }} // Not needed for authenticated layout
                        showSidebarTrigger={true}
                    />

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto pt-16 p-6">
                        <div className="container mx-auto max-w-7xl animate-fade-in">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
