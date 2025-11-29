import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Menu,
  X,
  Code2,
  Trophy,
  Users,
  BarChart3,
  LogIn,
  LogOut,
  Settings,
  User,
  Search,
  Bell
} from "lucide-react";

interface HeaderProps {
  onRoleSelect: (role: string) => void;
  onAuthModal: () => void;
  showSidebarTrigger?: boolean;
}

const Header = ({ onRoleSelect, onAuthModal, showSidebarTrigger = false }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogoClick = () => {
    navigate('/');
  };

  const roles = [
    { id: 'student', label: 'Student', icon: Code2, color: 'text-blue-600' },
    { id: 'team_lead', label: 'Team Lead', icon: Users, color: 'text-purple-600' },
    { id: 'advisor', label: 'Advisor', icon: Trophy, color: 'text-green-600' },
    { id: 'hod', label: 'HOD', icon: BarChart3, color: 'text-amber-600' },
    { id: 'admin', label: 'Admin', icon: Settings, color: 'text-red-600' },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'text-blue-600';
      case 'team_lead': return 'text-purple-600';
      case 'advisor': return 'text-green-600';
      case 'hod': return 'text-amber-600';
      case 'admin': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showSidebarTrigger && (
            <SidebarTrigger className="md:hidden" />
          )}

          {/* Logo - Clickable to return to landing page */}
          <button onClick={handleLogoClick} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-space-grotesk font-bold">MVIT Coding Tracker</h1>
              <p className="text-xs text-muted-foreground">Performance Analytics Platform</p>
            </div>
          </button>
        </div>

        {/* Search Bar - Visible on Desktop */}
        {user && profile && (
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users, teams, or achievements..."
                className="w-full pl-9 bg-muted/50 focus:bg-background transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {user && profile ? (
            // Authenticated user menu
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile/notifications')}
                className="relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{profile.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
                    <div className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 ${getRoleColor(profile.role)} inline-block w-fit mt-1`}>
                      {profile.role.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/dashboard/${profile.role}`)}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            // Demo navigation for non-authenticated users
            <>
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Button
                    key={role.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onRoleSelect(role.id)}
                    className="flex items-center space-x-2 hover:bg-primary/10"
                  >
                    <Icon className={`w-4 h-4 ${role.color}`} />
                    <span>{role.label}</span>
                  </Button>
                );
              })}
              <Button onClick={onAuthModal} className="flex items-center space-x-2">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button - Only show if sidebar trigger is NOT present */}
        {!showSidebarTrigger && (
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        )}
      </div>

      {/* Mobile Menu - Only show if sidebar trigger is NOT present */}
      {!showSidebarTrigger && isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border p-4 animate-in slide-in-from-top-5">
          {user && profile ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{profile.fullName}</p>
                  <p className="text-sm text-muted-foreground">{profile.role.replace('_', ' ').toUpperCase()}</p>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => {
                  navigate('/');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Code2 className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => {
                  navigate(`/dashboard/${profile.role}`);
                  setIsMobileMenuOpen(false);
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => {
                  navigate('/profile');
                  setIsMobileMenuOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                className="w-full justify-start"
                variant="ghost"
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Button
                      key={role.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onRoleSelect(role.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 justify-start"
                    >
                      <Icon className={`w-4 h-4 ${role.color}`} />
                      <span>{role.label}</span>
                    </Button>
                  );
                })}
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  onAuthModal();
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;