import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import RoleDashboard from "@/components/RoleDashboard";
import { Code2 } from "lucide-react";

const Dashboard = () => {
  const { role } = useParams<{ role: string }>();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Validate role parameter
  const validRoles = ['student', 'team_lead', 'advisor', 'hod', 'admin'];
  const isValidRole = role && validRoles.includes(role);

  useEffect(() => {
    // Redirect to home if invalid role
    if (!loading && !isValidRole) {
      navigate('/', { replace: true });
    }
  }, [loading, isValidRole, navigate]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleRoleSelect = (newRole: string) => {
    if (newRole && newRole !== '') {
      navigate(`/dashboard/${newRole}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-lg font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isValidRole) {
    return null; // Will redirect in useEffect
  }

  // Determine if this is a demo view
  const isDemo = !user || !profile || role !== profile.role;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onRoleSelect={handleRoleSelect} 
        onAuthModal={() => {}} // Not needed on dashboard, header handles auth
      />
      
      <RoleDashboard 
        role={role} 
        onBack={handleBackToHome} 
        isDemo={isDemo}
      />
    </div>
  );
};

export default Dashboard;
