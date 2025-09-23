import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import RoleDashboard from "@/components/RoleDashboard";
import AuthModal from "@/components/auth/AuthModal";
import { Code2, Users, Trophy, BarChart3, Settings } from "lucide-react";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleRoleSelect = (role: string) => {
    if (user && profile) {
      // Authenticated users can only access their actual role or view demos
      if (role === profile.role) {
        setSelectedRole(role);
      } else {
        // Show demo dashboard for other roles
        setSelectedRole(role);
      }
    } else {
      // Non-authenticated users see demo dashboards
      setSelectedRole(role);
    }
  };

  const handleGetStarted = () => {
    if (user && profile) {
      // Redirect authenticated users to their dashboard
      setSelectedRole(profile.role);
    } else {
      // Show auth modal for non-authenticated users
      setShowAuthModal(true);
    }
  };

  const handleBackToHome = () => {
    setSelectedRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-lg font-medium">Loading MVIT Coding Tracker...</p>
        </div>
      </div>
    );
  }

  if (selectedRole) {
    return (
      <>
        <RoleDashboard 
          role={selectedRole} 
          onBack={handleBackToHome} 
          isDemo={!user || selectedRole !== profile?.role}
        />
        <Toaster />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header 
          onRoleSelect={handleRoleSelect} 
          onAuthModal={() => setShowAuthModal(true)}
        />

        {/* Hero Section */}
        <HeroSection onGetStarted={handleGetStarted} />

        {/* Features Section */}
        <FeaturesSection />

        {/* Role Selection Section */}
        <section id="role-selection" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold mb-4">
                {user && profile ? (
                  <>
                    Welcome back, <span className="text-primary">{profile.full_name.split(' ')[0]}</span>!
                  </>
                ) : (
                  'Choose Your Role'
                )}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {user && profile ? (
                  `Access your ${profile.role.replace('_', ' ')} dashboard or explore other role interfaces`
                ) : (
                  'Experience personalized dashboards designed for your specific needs and responsibilities'
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {[
                {
                  id: 'student',
                  title: 'Student',
                  description: 'Track your personal coding progress and compete with peers',
                  icon: Code2,
                  color: 'from-blue-500 to-blue-600',
                  features: ['Personal Analytics', 'Progress Tracking', 'Peer Comparison']
                },
                {
                  id: 'team_lead',
                  title: 'Team Lead',
                  description: 'Manage your team and monitor collective performance',
                  icon: Users,
                  color: 'from-purple-500 to-purple-600',
                  features: ['Team Management', 'Member Analytics', 'Goal Setting']
                },
                {
                  id: 'advisor',
                  title: 'Class Advisor',
                  description: 'Monitor section performance and guide students',
                  icon: Trophy,
                  color: 'from-green-500 to-green-600',
                  features: ['Section Overview', 'Student Guidance', 'Performance Reports']
                },
                {
                  id: 'hod',
                  title: 'HOD',
                  description: 'Department-wide analytics and strategic insights',
                  icon: BarChart3,
                  color: 'from-amber-500 to-amber-600',
                  features: ['Department Analytics', 'Faculty Reports', 'Strategic Planning']
                },
                {
                  id: 'admin',
                  title: 'Admin',
                  description: 'System management and platform oversight',
                  icon: Settings,
                  color: 'from-red-500 to-red-600',
                  features: ['System Health', 'User Management', 'Platform Analytics']
                }
              ].map((role) => {
                const Icon = role.icon;
                const isUserRole = user && profile && role.id === profile.role;
                const isAccessible = !user || role.id === profile?.role || true; // Allow demo access
                
                return (
                  <div
                    key={role.id}
                    className={`group relative bg-card rounded-2xl p-6 border transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                      isUserRole 
                        ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                        : 'border-border hover:shadow-2xl'
                    } ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => isAccessible && handleRoleSelect(role.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${role.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      {isUserRole && (
                        <div className="absolute top-2 right-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                      
                      <h3 className={`text-xl font-space-grotesk font-bold mb-2 transition-colors ${
                        isUserRole ? 'text-primary' : 'group-hover:text-primary'
                      }`}>
                        {role.title}
                        {isUserRole && <span className="text-sm ml-2 text-green-600">(Your Role)</span>}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 min-h-[2.5rem]">
                        {role.description}
                      </p>
                      
                      <div className="space-y-2">
                        {role.features.map((feature) => (
                          <div key={feature} className="flex items-center text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          className={`w-full group-hover:shadow-lg transition-all duration-300 ${
                            isUserRole ? 'bg-primary hover:bg-primary/90' : ''
                          }`}
                          variant={isUserRole ? "default" : "outline"}
                          disabled={!isAccessible}
                        >
                          {isUserRole ? 'Open Dashboard' : 'View Demo'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Authentication Notice */}
            <div className="text-center mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
              {user && profile ? (
                <p className="text-sm text-muted-foreground">
                  <strong>Welcome {profile.full_name}!</strong> You can access your actual dashboard or explore demo interfaces for other roles.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  <strong>Demo Mode:</strong> Click any role above to explore the dashboard interface. 
                  Sign in for full access to real data and personalized features.
                  <Button 
                    variant="link" 
                    className="ml-2 p-0 h-auto"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Sign In Now
                  </Button>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted/50 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-space-grotesk font-bold">MVIT Coding Tracker</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Empowering coding excellence through intelligent performance analytics
            </p>
            <p className="text-sm text-muted-foreground">
              Developed by ByteBreakers Team • AIML Department, Section A • MVIT
            </p>
          </div>
        </footer>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <Toaster />
    </>
  );
};

export default Index;
