import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Github, Trophy, Target } from "lucide-react";

interface PlatformProfilesProps {
  formData: {
    leetcode: string;
    skillrack: string;
    codechef: string;
    hackerrank: string;
    github: string;
  };
  onChange: (field: string, value: string) => void;
  role: string;
}

const platforms = [
  {
    key: 'leetcode',
    label: 'LeetCode',
    icon: Code,
    placeholder: 'username',
    urlPattern: 'https://leetcode.com/u/{username}/',
    priority: 'high'
  },
  {
    key: 'skillrack',
    label: 'SkillRack',
    icon: Target,
    placeholder: 'username',
    urlPattern: 'https://www.skillrack.com/faces/resume.xhtml?id={username}',
    priority: 'high'
  },
  {
    key: 'codechef',
    label: 'CodeChef',
    icon: Trophy,
    placeholder: 'username',
    urlPattern: 'https://www.codechef.com/users/{username}',
    priority: 'medium'
  },
  {
    key: 'hackerrank',
    label: 'HackerRank',
    icon: Code,
    placeholder: 'username',
    urlPattern: 'https://www.hackerrank.com/profile/{username}',
    priority: 'medium'
  },
  {
    key: 'github',
    label: 'GitHub',
    icon: Github,
    placeholder: 'username',
    urlPattern: 'https://github.com/{username}',
    priority: 'low'
  },
];

export const PlatformProfiles = ({ formData, onChange, role }: PlatformProfilesProps) => {
  const isTeamLead = role === 'team_lead';
  const isOptional = role === 'student';

  const filledPlatforms = Object.values(formData).filter(v => v).length;
  const requirementsMet = isTeamLead ? filledPlatforms >= 2 : true;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {isOptional ? 'Coding Platform Profiles (Optional)' : 'Your Coding Platform Profiles'}
        </h2>
        <p className="text-muted-foreground mt-2">
          {isTeamLead 
            ? 'As a team lead, add at least 2 platform profiles to enable tracking'
            : 'Add your coding platform usernames to track your progress automatically'
          }
        </p>
        {isOptional && (
          <p className="text-sm text-info mt-1">
            You can skip this step and add platforms later from your dashboard
          </p>
        )}
      </div>

      {isTeamLead && (
        <Card className={requirementsMet ? 'border-success' : 'border-warning'}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Platforms Added: {filledPlatforms}/5
              </span>
              <span className={`text-sm font-medium ${requirementsMet ? 'text-success' : 'text-warning'}`}>
                {requirementsMet ? '✓ Requirements Met' : 'Minimum 2 required'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card key={platform.key} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{platform.label}</span>
                  {platform.priority === 'high' && isTeamLead && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Input
                    value={formData[platform.key as keyof typeof formData]}
                    onChange={(e) => onChange(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                  />
                  {formData[platform.key as keyof typeof formData] && (
                    <p className="text-xs text-muted-foreground truncate">
                      {platform.urlPattern.replace('{username}', formData[platform.key as keyof typeof formData])}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};