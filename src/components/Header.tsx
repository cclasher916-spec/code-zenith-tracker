import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Code2, 
  Trophy, 
  Users, 
  BarChart3,
  LogIn
} from "lucide-react";

interface HeaderProps {
  onRoleSelect: (role: string) => void;
}

const Header = ({ onRoleSelect }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roles = [
    { id: 'student', label: 'Student', icon: Code2, color: 'text-blue-600' },
    { id: 'team-lead', label: 'Team Lead', icon: Users, color: 'text-purple-600' },
    { id: 'advisor', label: 'Advisor', icon: Trophy, color: 'text-green-600' },
    { id: 'hod', label: 'HOD', icon: BarChart3, color: 'text-amber-600' },
    { id: 'admin', label: 'Admin', icon: LogIn, color: 'text-red-600' },
  ];

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
        <nav className="hidden md:flex items-center space-x-2">
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
          <div className="grid grid-cols-2 gap-2">
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
        </div>
      )}
    </header>
  );
};

export default Header;