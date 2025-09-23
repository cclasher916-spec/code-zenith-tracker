import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import RoleDashboard from "@/components/RoleDashboard";
import { Code2, Users, Trophy, BarChart3, Settings } from "lucide-react";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleGetStarted = () => {
    // Scroll to role selection or show modal
    document.getElementById('role-selection')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedRole(null);
  };

  if (selectedRole) {
    return (
      <>
        <RoleDashboard role={selectedRole} onBack={handleBackToHome} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header onRoleSelect={handleRoleSelect} />

        {/* Hero Section */}
        <HeroSection onGetStarted={handleGetStarted} />

        {/* Features Section */}
        <FeaturesSection />

        {/* Role Selection Section */}
        <section id="role-selection" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold mb-4">
                Choose Your Role
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience personalized dashboards designed for your specific needs and responsibilities
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
                  id: 'team-lead',
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
                return (
                  <div
                    key={role.id}
                    className="group relative bg-card rounded-2xl p-6 border border-border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${role.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-space-grotesk font-bold mb-2 group-hover:text-primary transition-colors">
                        {role.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 min-h-[2.5rem]">
                        {role.description}
                      </p>
                      
                      <div className="space-y-2">
                        {role.features.map((feature, index) => (
                          <div key={feature} className="flex items-center text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          className="w-full group-hover:shadow-lg transition-all duration-300"
                          variant="outline"
                        >
                          View Dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Demo Notice */}
            <div className="text-center mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong>Demo Mode:</strong> Click any role above to explore the dashboard interface. 
                Real implementation would include authentication and role-based access control.
              </p>
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
      <Toaster />
    </>
  );
};

export default Index;
