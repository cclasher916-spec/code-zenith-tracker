import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Users, Building, Shield, GraduationCap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RoleSelectionProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const roles = [
  {
    value: "student",
    label: "Student",
    icon: Code2,
    description: "Track your coding progress and join teams",
    permissions: ["Track progress", "Join teams", "View rankings"]
  },
  {
    value: "team_lead",
    label: "Team Leader",
    icon: Users,
    description: "Create and manage your coding team",
    permissions: ["Create team", "Invite members", "Track team progress"]
  },
  {
    value: "advisor",
    label: "Class Advisor",
    icon: GraduationCap,
    description: "Monitor and guide student progress",
    permissions: ["View section analytics", "Approve teams", "Generate reports"]
  },
  {
    value: "hod",
    label: "Head of Department",
    icon: Building,
    description: "Oversee department-wide performance",
    permissions: ["Department analytics", "Manage advisors", "System configuration"]
  },
  {
    value: "admin",
    label: "Administrator",
    icon: Shield,
    description: "Full system access and management",
    permissions: ["Complete system control", "User management", "Platform configuration"]
  }
];

export const RoleSelection = ({ selectedRole, onRoleChange }: RoleSelectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Select Registration Type</h2>
        <p className="text-muted-foreground mt-2">
          Choose your role to get started with the right features for you
        </p>
      </div>

      <RadioGroup value={selectedRole} onValueChange={onRoleChange} className="space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <label key={role.value} htmlFor={role.value} className="cursor-pointer">
              <Card 
                className={`transition-all hover:shadow-lg ${
                  selectedRole === role.value 
                    ? 'ring-2 ring-primary shadow-md' 
                    : 'hover:border-primary/50'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        selectedRole === role.value 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.label}</CardTitle>
                        <CardDescription className="text-sm">{role.description}</CardDescription>
                      </div>
                    </div>
                    <RadioGroupItem value={role.value} id={role.value} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span 
                        key={permission} 
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
};