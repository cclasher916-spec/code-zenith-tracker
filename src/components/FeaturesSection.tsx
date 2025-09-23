import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot,
  MessageSquare,
  Shield,
  Zap,
  BarChart3,
  Users,
  Bell,
  Code2,
  Github,
  Trophy,
  Clock,
  Smartphone
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Code2,
      title: "Multi-Platform Integration",
      description: "Seamlessly connect with LeetCode, SkillRack, CodeChef, HackerRank, and GitHub for comprehensive tracking.",
      badge: "5 Platforms",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Bot,
      title: "AI-Powered Analytics",
      description: "Get personalized insights and recommendations powered by Google Gemini AI for improved performance.",
      badge: "AI Driven",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: BarChart3,
      title: "Real-Time Dashboards",
      description: "Interactive dashboards with live performance metrics, rankings, and progress visualization.",
      badge: "Live Data",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Create and manage coding teams with collaborative features and peer comparison tools.",
      badge: "Collaborative",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Multi-channel notifications via Email and WhatsApp with intelligent timing and personalization.",
      badge: "Multi-Channel",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with role-based access control and complete data privacy protection.",
      badge: "Secure",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  const platforms = [
    { name: "LeetCode", color: "bg-orange-500", problems: "2,000+" },
    { name: "GitHub", color: "bg-gray-900", problems: "Repos" },
    { name: "CodeChef", color: "bg-amber-600", problems: "5,000+" },
    { name: "HackerRank", color: "bg-green-600", problems: "3,000+" },
    { name: "SkillRack", color: "bg-blue-600", problems: "10,000+" },
  ];

  const benefits = [
    {
      icon: Trophy,
      title: "94% Placement Success",
      description: "Students using our platform show significantly higher placement rates"
    },
    {
      icon: Clock,
      title: "70% Time Saved",
      description: "Automated tracking saves faculty hours of manual progress monitoring"
    },
    {
      icon: Smartphone,
      title: "24/7 Accessibility",
      description: "Mobile-responsive design ensures access from any device, anywhere"
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Zap className="w-3 h-3 mr-1" />
            Powerful Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-space-grotesk font-bold mb-4">
            Everything You Need for
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Coding Excellence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive platform designed to elevate coding performance across the entire academic ecosystem
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-card-gradient animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Integration */}
        <div className="mb-16">
          <h3 className="text-2xl font-space-grotesk font-bold text-center mb-8">
            Integrated Coding Platforms
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {platforms.map((platform, index) => (
              <div 
                key={platform.name}
                className="flex items-center space-x-3 bg-card rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`platform-indicator ${platform.name.toLowerCase().replace(' ', '-')}`}></div>
                <div>
                  <div className="font-medium">{platform.name}</div>
                  <div className="text-sm text-muted-foreground">{platform.problems}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={benefit.title}
                className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-space-grotesk font-bold mb-2">{benefit.title}</h4>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;