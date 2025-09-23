import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Code2, 
  Zap,
  ArrowRight,
  Play
} from "lucide-react";
import heroImage from "@/assets/hero-platform.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const stats = [
    { label: "Active Students", value: "2,500+", icon: Users },
    { label: "Problems Solved", value: "125K+", icon: Code2 },
    { label: "Team Success Rate", value: "94%", icon: TrendingUp },
    { label: "Platform Integrations", value: "5", icon: Zap },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Zap className="w-3 h-3 mr-1" />
              Automated Performance Tracking
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-space-grotesk font-bold text-white mb-6 leading-tight">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Coding Journey
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              MVIT's comprehensive platform tracks coding performance across multiple platforms, 
              provides intelligent analytics, and empowers students with data-driven insights for academic and placement success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
                onClick={onGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={stat.label}
                    className="glass-effect rounded-xl p-4 text-center text-white animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-yellow-300" />
                    <div className="text-2xl font-bold font-space-grotesk">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src={heroImage} 
                alt="MVIT Coding Tracker Dashboard" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-success text-success-foreground rounded-full p-3 shadow-lg animate-pulse-glow">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-warning text-warning-foreground rounded-full p-3 shadow-lg animate-pulse-glow" style={{ animationDelay: '1s' }}>
              <Code2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;