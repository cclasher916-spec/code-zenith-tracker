import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Download
} from "lucide-react";

interface RoleDashboardProps {
  role: string;
  onBack: () => void;
}

const RoleDashboard = ({ role, onBack }: RoleDashboardProps) => {
  const roleConfigs = {
    student: {
      title: "Student Dashboard",
      subtitle: "Track your coding progress and performance",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      cards: [
        {
          title: "Today's Progress",
          value: "7 Problems",
          change: "+2 from yesterday",
          trend: "up",
          color: "text-green-600"
        },
        {
          title: "Current Streak",
          value: "12 Days",
          change: "Personal best!",
          trend: "up",
          color: "text-orange-600"
        },
        {
          title: "Team Rank",
          value: "#3 of 8",
          change: "↑2 positions",
          trend: "up",
          color: "text-purple-600"
        },
        {
          title: "Total Solved",
          value: "284",
          change: "This month: +45",
          trend: "up",
          color: "text-blue-600"
        }
      ]
    },
    "team-lead": {
      title: "Team Leader Dashboard",
      subtitle: "Manage and monitor your team's performance",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      cards: [
        {
          title: "Team Average",
          value: "5.2/day",
          change: "+0.8 this week",
          trend: "up",
          color: "text-green-600"
        },
        {
          title: "Active Members",
          value: "7 of 8",
          change: "1 inactive today",
          trend: "down",
          color: "text-orange-600"
        },
        {
          title: "Team Rank",
          value: "#2 of 15",
          change: "Section leaders",
          trend: "up",
          color: "text-purple-600"
        },
        {
          title: "Monthly Goal",
          value: "89%",
          change: "On track",
          trend: "up",
          color: "text-blue-600"
        }
      ]
    },
    advisor: {
      title: "Class Advisor Dashboard",
      subtitle: "Monitor section performance and guide students",
      color: "text-green-600",
      bgColor: "bg-green-100",
      cards: [
        {
          title: "Section Average",
          value: "4.1/day",
          change: "+12% this month",
          trend: "up",
          color: "text-green-600"
        },
        {
          title: "Active Students",
          value: "58 of 62",
          change: "94% engagement",
          trend: "up",
          color: "text-blue-600"
        },
        {
          title: "Top Performers",
          value: "15 students",
          change: ">10/day average",
          trend: "up",
          color: "text-purple-600"
        },
        {
          title: "Need Attention",
          value: "4 students",
          change: "Follow-up required",
          trend: "down",
          color: "text-orange-600"
        }
      ]
    },
    hod: {
      title: "Head of Department",
      subtitle: "Department-wide analytics and strategic oversight",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      cards: [
        {
          title: "Department Avg",
          value: "3.8/day",
          change: "+18% YoY growth",
          trend: "up",
          color: "text-green-600"
        },
        {
          title: "Total Students",
          value: "248 active",
          change: "Across 4 sections",
          trend: "up",
          color: "text-blue-600"
        },
        {
          title: "Placement Ready",
          value: "82%",
          change: "Above target",
          trend: "up",
          color: "text-purple-600"
        },
        {
          title: "Faculty Usage",
          value: "12 of 15",
          change: "80% adoption",
          trend: "up",
          color: "text-amber-600"
        }
      ]
    },
    admin: {
      title: "System Administrator",
      subtitle: "Platform management and system oversight",
      color: "text-red-600",
      bgColor: "bg-red-100",
      cards: [
        {
          title: "System Health",
          value: "99.2%",
          change: "Uptime this month",
          trend: "up",
          color: "text-green-600"
        },
        {
          title: "Total Users",
          value: "2,547",
          change: "+127 this month",
          trend: "up",
          color: "text-blue-600"
        },
        {
          title: "API Success",
          value: "98.7%",
          change: "Data collection rate",
          trend: "up",
          color: "text-purple-600"
        },
        {
          title: "Support Tickets",
          value: "3 open",
          change: "2 resolved today",
          trend: "down",
          color: "text-red-600"
        }
      ]
    }
  };

  const config = roleConfigs[role as keyof typeof roleConfigs];
  
  if (!config) return null;

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

        {/* Role Badge */}
        <div className="mb-8">
          <Badge className={`${config.bgColor} ${config.color} text-sm px-3 py-1`}>
            {role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')} Access
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-grid mb-8">
          {config.cards.map((card, index) => (
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
          ))}
        </div>

        {/* Recent Activity */}
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
                  { time: "2 hours ago", event: "Daily scraping completed", status: "success" },
                  { time: "4 hours ago", event: "Team performance report generated", status: "info" },
                  { time: "6 hours ago", event: "New student registered", status: "success" },
                  { time: "1 day ago", event: "Weekly analytics updated", status: "info" },
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
                      Excellent
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