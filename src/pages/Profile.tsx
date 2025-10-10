import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { User, Settings, Shield, Users, Trophy, BarChart3, Bell, Code, BookOpen, Briefcase, Award, FileText, HelpCircle } from "lucide-react";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { AcademicInfoSection } from "@/components/profile/AcademicInfoSection";
import { PlatformProfilesSection } from "@/components/profile/PlatformProfilesSection";
import { StatsSection } from "@/components/profile/StatsSection";
import { TeamInfoSection } from "@/components/profile/TeamInfoSection";
import { NotificationsSection } from "@/components/profile/NotificationsSection";
import { SkillsSection } from "@/components/profile/SkillsSection";

type ProfileSection = 'personal' | 'academic' | 'platforms' | 'stats' | 'teams' | 'notifications' | 'skills';

const roleBasedSections: Record<string, ProfileSection[]> = {
  student: ['personal', 'academic', 'platforms', 'stats', 'teams', 'notifications', 'skills'],
  team_lead: ['personal', 'academic', 'platforms', 'stats', 'teams', 'notifications', 'skills'],
  advisor: ['personal', 'academic', 'teams', 'notifications', 'stats'],
  hod: ['personal', 'academic', 'notifications', 'stats'],
  admin: ['personal', 'notifications', 'stats'],
};

const sectionConfig = {
  personal: { icon: User, label: 'Personal Info' },
  academic: { icon: BookOpen, label: 'Academic Details' },
  platforms: { icon: Code, label: 'Coding Platforms' },
  stats: { icon: BarChart3, label: 'My Stats' },
  teams: { icon: Users, label: 'Teams' },
  notifications: { icon: Bell, label: 'Notifications' },
  skills: { icon: Trophy, label: 'Skills' },
};

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ProfileSection>('personal');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Profile not found</div>
      </div>
    );
  }

  const availableSections = roleBasedSections[profile.role] || [];

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection />;
      case 'academic':
        return <AcademicInfoSection />;
      case 'platforms':
        return <PlatformProfilesSection />;
      case 'stats':
        return <StatsSection />;
      case 'teams':
        return <TeamInfoSection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'skills':
        return <SkillsSection />;
      default:
        return <PersonalInfoSection />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarTrigger className="m-2 self-end" />
          
          <SidebarContent>
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                  <p className="text-xs text-primary capitalize">{profile.role.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Profile Sections</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {availableSections.map((section) => {
                    const config = sectionConfig[section];
                    const Icon = config.icon;
                    return (
                      <SidebarMenuItem key={section}>
                        <SidebarMenuButton
                          onClick={() => setActiveSection(section)}
                          isActive={activeSection === section}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          <span>{config.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => navigate('/')}>
                      <Award className="w-4 h-4 mr-2" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => navigate('/dashboard')}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6 overflow-auto">
          <header className="mb-6 flex items-center">
            <SidebarTrigger className="mr-4" />
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </header>

          <div className="max-w-4xl">
            {renderSection()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
