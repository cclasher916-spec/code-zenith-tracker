import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Shield,
  Home,
  LogOut,
  Activity,
  BarChart3,
  TrendingUpIcon
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { 
  StudentPerformanceChart, 
  StudentDifficultyRadar, 
  TeamMemberBarChart, 
  SectionLeaderboardChart, 
  DepartmentTrendChart,
  UserDistributionChart 
} from "@/components/dashboard/RoleCharts";
import { toast } from "sonner";
import { authService } from "@/services/auth";

interface RoleDashboardProps {
  role: string;
  onBack: () => void;
  isDemo?: boolean;
}

const RoleDashboard = ({ role, onBack, isDemo = false }: RoleDashboardProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { stats, loading, error } = useDashboardData(role);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('week');

  const roleConfigs = {
    student: {
      title: "Student Dashboard",
      subtitle: "Track your coding progress and performance",
      color: "text-[hsl(212,85%,45%)]",
      bgColor: "bg-[hsl(212,85%,45%)]/10",
      accentColor: "hsl(212, 85%, 45%)",
    },
    team_lead: {
      title: "Team Leader Dashboard", 
      subtitle: "Manage and monitor your team's performance",
      color: "text-[hsl(270,85%,60%)]",
      bgColor: "bg-[hsl(270,85%,60%)]/10",
      accentColor: "hsl(270, 85%, 60%)",
    },
    advisor: {
      title: "Class Advisor Dashboard",
      subtitle: "Monitor section performance and guide students",
      color: "text-[hsl(142,76%,36%)]",
      bgColor: "bg-[hsl(142,76%,36%)]/10",
      accentColor: "hsl(142, 76%, 36%)",
    },
    hod: {
      title: "Head of Department",
      subtitle: "Department-wide analytics and strategic oversight",
      color: "text-[hsl(38,92%,50%)]",
      bgColor: "bg-[hsl(38,92%,50%)]/10",
      accentColor: "hsl(38, 92%, 50%)",
    },
    admin: {
      title: "System Administrator",
      subtitle: "Platform management and system oversight",
      color: "text-[hsl(0,84%,60%)]",
      bgColor: "bg-[hsl(0,84%,60%)]/10",
      accentColor: "hsl(0, 84%, 60%)",
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Failed to logout");
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
          <Card key={card.title} className="stats-card hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4" style={{ borderLeftColor: config.accentColor }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {card.title}
                {card.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-warning" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-space-grotesk font-bold mb-2" style={{ color: config.accentColor }}>
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
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
          <Card key={card.title} className="stats-card hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4" style={{ borderLeftColor: config.accentColor }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {card.title}
                {card.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-warning" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-space-grotesk font-bold mb-2" style={{ color: config.accentColor }}>
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
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
          <Card key={card.title} className="stats-card hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4" style={{ borderLeftColor: config.accentColor }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {card.title}
                {card.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-warning" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-space-grotesk font-bold mb-2" style={{ color: config.accentColor }}>
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
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
          <Card key={card.title} className="stats-card hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4" style={{ borderLeftColor: config.accentColor }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {card.title}
                {card.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-warning" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-space-grotesk font-bold mb-2" style={{ color: config.accentColor }}>
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
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
          <Card key={card.title} className="stats-card hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4" style={{ borderLeftColor: config.accentColor }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {card.title}
                {card.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-warning" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-space-grotesk font-bold mb-2" style={{ color: config.accentColor }}>
                {card.value}
              </div>
              <div className={`text-sm flex items-center ${card.color}`}>
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
        {/* Enhanced Header - Mobile Optimized */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Top Row: Back Button and Title */}
          <div className="flex items-start gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="hover:scale-105 transition-transform shrink-0"
            >
              <Home className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Home</span>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-space-grotesk font-bold ${config.color} truncate`}>
                {config.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{config.subtitle}</p>
            </div>
          </div>
          
          {/* Bottom Row: Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Date Range Filter - Full width on mobile */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted w-full sm:w-auto">
              <Button 
                variant={dateRange === 'today' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setDateRange('today')}
                className="text-xs flex-1 sm:flex-initial"
              >
                Today
              </Button>
              <Button 
                variant={dateRange === 'week' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setDateRange('week')}
                className="text-xs flex-1 sm:flex-initial"
              >
                Week
              </Button>
              <Button 
                variant={dateRange === 'month' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setDateRange('month')}
                className="text-xs flex-1 sm:flex-initial"
              >
                Month
              </Button>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform flex-1 sm:flex-initial">
                <Bell className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Alerts</span>
              </Button>
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform flex-1 sm:flex-initial">
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="hover:scale-105 transition-transform hover:bg-destructive hover:text-destructive-foreground flex-1 sm:flex-initial"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Demo/Authentication Notice */}
        {isDemo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Alert className={`mb-8 border-[${config.accentColor}]/30 ${config.bgColor}`}>
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
          </motion.div>
        )}

        {/* Role Badge */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <Badge className={`${config.bgColor} ${config.color} text-sm px-4 py-2 font-semibold`}>
            <Code2 className="w-4 h-4 mr-2" />
            {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')} {isDemo ? 'Demo' : 'Access'}
          </Badge>
        </motion.div>

        {/* Stats Cards with Animation - Mobile Responsive Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {getStatsCards()}
        </motion.div>

        {/* Role-Specific Charts and Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          {role === 'student' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <Card className="border-t-4" style={{ borderTopColor: config.accentColor }}>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" style={{ color: config.accentColor }} />
                    Weekly Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <StudentPerformanceChart color={config.accentColor} />
                </CardContent>
              </Card>

              <Card className="border-t-4" style={{ borderTopColor: config.accentColor }}>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" style={{ color: config.accentColor }} />
                    Problem Difficulty Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <StudentDifficultyRadar color={config.accentColor} />
                </CardContent>
              </Card>
            </div>
          )}

          {role === 'team_lead' && (
            <div className="mb-8">
              <Card className="border-t-4" style={{ borderTopColor: config.accentColor }}>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" style={{ color: config.accentColor }} />
                    Team Member Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <TeamMemberBarChart color={config.accentColor} />
                </CardContent>
              </Card>
            </div>
          )}

          {role === 'advisor' && (
            <div className="mb-8">
              <Card className="border-t-4" style={{ borderTopColor: config.accentColor }}>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2" style={{ color: config.accentColor }} />
                    Section Leaderboard - Top 5 Students
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <SectionLeaderboardChart color={config.accentColor} />
                </CardContent>
              </Card>
            </div>
          )}

          {role === 'hod' && (
            <div className="mb-8">
              <Card className="border-t-4" style={{ borderTopColor: config.accentColor }}>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" style={{ color: config.accentColor }} />
                    Department Performance Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <DepartmentTrendChart color={config.accentColor} />
                </CardContent>
              </Card>
            </div>
          )}

          {role === 'admin' && (
            <div className="mb-8">
              <Card className="border-t-4" style={{ borderTopColor: config.accentColor }}>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm sm:text-base">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" style={{ color: config.accentColor }} />
                    User Role Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-6">
                  <UserDistributionChart color={config.accentColor} />
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
        {/* Recent Activity and Performance Overview - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-sm sm:text-base">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" style={{ color: config.accentColor }} />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-3">
                {[
                  { time: "2 hours ago", event: isDemo ? "Demo: Daily data sync completed" : "Daily scraping completed", status: "success" },
                  { time: "4 hours ago", event: isDemo ? "Demo: Sample report generated" : "Performance report generated", status: "info" },
                  { time: "6 hours ago", event: isDemo ? "Demo: User activity simulated" : "New user registered", status: "success" },
                  { time: "1 day ago", event: isDemo ? "Demo: Weekly stats updated" : "Weekly analytics updated", status: "info" },
                ].map((activity, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div 
                      className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-success' : 'bg-info'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.event}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-sm sm:text-base">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" style={{ color: config.accentColor }} />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-6">
                {[
                  { label: "Monthly Goal Progress", value: 78 },
                  { label: "Platform Integration", value: 92 },
                  { label: "User Engagement", value: 85 },
                ].map((metric, index) => (
                  <motion.div 
                    key={metric.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span>{metric.label}</span>
                      <span className="font-medium">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </motion.div>
                ))}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="pt-4 border-t border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium">Overall Rating</span>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {isDemo ? 'Demo' : 'Excellent'}
                    </Badge>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleDashboard;