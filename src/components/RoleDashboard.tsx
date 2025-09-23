import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDashboardData } from "@/components/dashboard/DashboardData";
import { useAuth } from "@/hooks/useAuth";
import { 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Target, 
  Code2, 
  Trophy,
  Calendar,
  ArrowLeft,
  Bell,
  Settings,
  Download,
  AlertCircle,
  Shield
} from "lucide-react";

interface RoleDashboardProps {
  role: string;
  onBack: () => void;
  isDemo?: boolean;
}

const RoleDashboard = ({ role, onBack, isDemo = false }: RoleDashboardProps) => {
  const { profile } = useAuth();
  const { stats, loading, error } = useDashboardData(role);

  const roleConfigs = {
    student: {
      title: "Student Dashboard",
      subtitle: "Track your coding progress and performance",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    team_lead: {
      title: "Team Leader Dashboard", 
      subtitle: "Manage and monitor your team's performance",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    advisor: {
      title: "Class Advisor Dashboard",
      subtitle: "Monitor section performance and guide students",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    hod: {
      title: "Head of Department",
      subtitle: "Department-wide analytics and strategic oversight",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    admin: {
      title: "System Administrator",
      subtitle: "Platform management and system oversight",
      color: "text-red-600",
      bgColor: "bg-red-100",
    }
  };

  const config = roleConfigs[role as keyof typeof roleConfigs];
  
  if (!config) return null;

  const getStatsCards = () => {
    if (loading) {
      return Array.from({ length: 4 }, (_, i) => (
        <Card key={i} className="stats-card animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </CardContent>
        </Card>
      ));
    }

    if (error) {
      return (
        <Alert className="col-span-full">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    switch (role) {
      case 'student':
        const personalStats = stats.personalStats;
        if (!personalStats) return null;
        
        return [
          {
            title: "Today's Progress",
            value: `${personalStats.todayProblems} Problems`,
            change: personalStats.todayProblems > 0 ? `+${personalStats.todayProblems} today` : "No activity today",
            trend: personalStats.todayProblems > 0 ? "up" : "down",
            color: personalStats.todayProblems > 0 ? "text-green-600" : "text-orange-600"
          },
          {
            title: "Current Streak",
            value: `${personalStats.currentStreak} Days`,
            change: personalStats.currentStreak > 5 ? "Great streak!" : "Keep going!",
            trend: personalStats.currentStreak > 0 ? "up" : "down",
            color: "text-orange-600"
          },
          {
            title: "Team Rank",
            value: `#${personalStats.teamRank} of 8`,
            change: personalStats.teamRank <= 3 ? "Top performer!" : "Room to improve",
            trend: personalStats.teamRank <= 3 ? "up" : "down",
            color: "text-purple-600"
          },
          {
            title: "Total Solved",
            value: `${personalStats.totalSolved}`,
            change: "This semester",
            trend: "up",
            color: "text-blue-600"
          }
        ].map((card, index) => (
          <Card key={card.title} className="stats-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-space-grotesk font-bold mb-1">
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {card.change}
              </div>
            </CardContent>
          </Card>
        ));

      case 'team_lead':
        const teamStats = stats.teamStats;
        if (!teamStats) return null;
        
        return [
          {
            title: "Team Average",
            value: `${teamStats.teamAverage}/day`,
            change: teamStats.teamAverage > 4 ? "+Excellent pace" : "Needs improvement",
            trend: teamStats.teamAverage > 4 ? "up" : "down",
            color: teamStats.teamAverage > 4 ? "text-green-600" : "text-orange-600"
          },
          {
            title: "Active Members",
            value: `${teamStats.activeMembers} of 8`,
            change: teamStats.activeMembers >= 6 ? "Good engagement" : "Low activity",
            trend: teamStats.activeMembers >= 6 ? "up" : "down",
            color: teamStats.activeMembers >= 6 ? "text-green-600" : "text-orange-600"
          },
          {
            title: "Team Rank",
            value: `#${teamStats.teamRank} of 15`,
            change: teamStats.teamRank <= 5 ? "Top performer!" : "Keep pushing",
            trend: teamStats.teamRank <= 5 ? "up" : "down",
            color: "text-purple-600"
          },
          {
            title: "Monthly Goal",
            value: `${teamStats.monthlyGoal}%`,
            change: teamStats.monthlyGoal >= 80 ? "On track" : "Behind target",
            trend: teamStats.monthlyGoal >= 80 ? "up" : "down",
            color: "text-blue-600"
          }
        ].map((card, index) => (
          <Card key={card.title} className="stats-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-space-grotesk font-bold mb-1">
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {card.change}
              </div>
            </CardContent>
          </Card>
        ));

      case 'advisor':
        const sectionStats = stats.sectionStats;
        if (!sectionStats) return null;
        
        return [
          {
            title: "Section Average",
            value: `${sectionStats.sectionAverage}/day`,
            change: sectionStats.sectionAverage > 3 ? "+Good progress" : "Needs guidance",
            trend: sectionStats.sectionAverage > 3 ? "up" : "down",
            color: "text-green-600"
          },
          {
            title: "Active Students", 
            value: `${sectionStats.activeStudents} of ${sectionStats.activeStudents + sectionStats.needAttention}`,
            change: `${Math.round((sectionStats.activeStudents / (sectionStats.activeStudents + sectionStats.needAttention)) * 100)}% engagement`,
            trend: "up",
            color: "text-blue-600"
          },
          {
            title: "Top Performers",
            value: `${sectionStats.topPerformers} students`,
            change: ">10/day average",
            trend: "up",
            color: "text-purple-600"
          },
          {
            title: "Need Attention",
            value: `${sectionStats.needAttention} students`,
            change: sectionStats.needAttention === 0 ? "All engaged!" : "Follow-up required",
            trend: sectionStats.needAttention === 0 ? "up" : "down",
            color: sectionStats.needAttention === 0 ? "text-green-600" : "text-orange-600"
          }
        ].map((card, index) => (
          <Card key={card.title} className="stats-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-space-grotesk font-bold mb-1">
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {card.change}
              </div>
            </CardContent>
          </Card>
        ));

      case 'hod':
        const departmentStats = stats.departmentStats;
        if (!departmentStats) return null;
        
        return [
          {
            title: "Department Avg",
            value: `${departmentStats.departmentAverage}/day`,
            change: "+18% YoY growth",
            trend: "up",
            color: "text-green-600"
          },
          {
            title: "Total Students",
            value: `${departmentStats.totalStudents} active`,
            change: "Across all sections",
            trend: "up",
            color: "text-blue-600"
          },
          {
            title: "Placement Ready",
            value: `${Math.round((departmentStats.placementReady / departmentStats.totalStudents) * 100)}%`,
            change: "Above target",
            trend: "up",
            color: "text-purple-600"
          },
          {
            title: "Faculty Usage",
            value: `${departmentStats.facultyUsage} active`,
            change: "Platform adoption",
            trend: "up",
            color: "text-amber-600"
          }
        ].map((card, index) => (
          <Card key={card.title} className="stats-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-space-grotesk font-bold mb-1">
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {card.change}
              </div>
            </CardContent>
          </Card>
        ));

      case 'admin':
        const systemStats = stats.systemStats;
        if (!systemStats) return null;
        
        return [
          {
            title: "System Health",
            value: `${systemStats.systemHealth}%`,
            change: "Uptime this month",
            trend: "up",
            color: "text-green-600"
          },
          {
            title: "Total Users",
            value: `${systemStats.totalUsers}`,
            change: "Active accounts",
            trend: "up",
            color: "text-blue-600"
          },
          {
            title: "API Success",
            value: `${systemStats.apiSuccess}%`,
            change: "Data collection rate",
            trend: "up",
            color: "text-purple-600"
          },
          {
            title: "Support Tickets",
            value: `${systemStats.supportTickets} open`,
            change: "Resolved today",
            trend: "down",
            color: "text-red-600"
          }
        ].map((card, index) => (
          <Card key={card.title} className="stats-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-space-grotesk font-bold mb-1">
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {card.change}
              </div>
            </CardContent>
          </Card>
        ));

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-space-grotesk font-bold">{config.title}</h1>
              <p className="text-muted-foreground">{config.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Demo/Authentication Notice */}
        {isDemo && (
          <Alert className="mb-8 border-primary/50 bg-primary/5">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Mode:</strong> This is a demonstration of the {config.title.toLowerCase()}. 
              {profile ? (
                <>Sign in with a {role.replace('_', ' ')} account to access real data and full functionality.</>
              ) : (
                <>Sign in to access your actual dashboard with real data and personalized features.</>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Role Badge */}
        <div className="mb-8">
          <Badge className={`${config.bgColor} ${config.color} text-sm px-3 py-1`}>
            {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')} {isDemo ? 'Demo' : 'Access'}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-grid mb-8">
          {getStatsCards()}
        </div>

        {/* Recent Activity and Performance Overview */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "2 hours ago", event: isDemo ? "Demo: Daily data sync completed" : "Daily scraping completed", status: "success" },
                  { time: "4 hours ago", event: isDemo ? "Demo: Sample report generated" : "Performance report generated", status: "info" },
                  { time: "6 hours ago", event: isDemo ? "Demo: User activity simulated" : "New user registered", status: "success" },
                  { time: "1 day ago", event: isDemo ? "Demo: Weekly stats updated" : "Weekly analytics updated", status: "info" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-success' : 'bg-info'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.event}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Monthly Goal Progress</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Platform Integration</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>User Engagement</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium">Overall Rating</span>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {isDemo ? 'Demo' : 'Excellent'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleDashboard;