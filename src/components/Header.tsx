import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
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
  User
} from "lucide-react";

interface HeaderProps {
  onRoleSelect: (role: string) => void;
  onAuthModal: () => void;
}

const Header = ({ onRoleSelect, onAuthModal }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roles = [
    { id: 'student', label: 'Student', icon: Code2, color: 'text-blue-600' },
    { id: 'team-lead', label: 'Team Lead', icon: Users, color: 'text-purple-600' },
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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-space-grotesk font-bold">MVIT Coding Tracker</h1>
            <p className="text-xs text-muted-foreground">Performance Analytics Platform</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {user && profile ? (
            // Authenticated user menu
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoleSelect(profile.role)}
                className="flex items-center space-x-2"
              >
                <BarChart3 className={`w-4 h-4 ${getRoleColor(profile.role)}`} />
                <span>Dashboard</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {profile.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{profile.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
                    <div className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getRoleColor(profile.role)} inline-block w-fit mt-1`}>
                      {profile.role.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
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

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border p-4">
          {user && profile ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{profile.full_name}</p>
                  <p className="text-sm text-muted-foreground">{profile.role.replace('_', ' ').toUpperCase()}</p>
                </div>
              </div>
              <Button 
                className="w-full justify-start" 
                variant="ghost"
                onClick={() => {
                  onRoleSelect(profile.role);
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