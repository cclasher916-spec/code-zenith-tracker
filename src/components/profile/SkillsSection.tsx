import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SkillsSection() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL'
  ]);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      toast({
        title: "Skill Added",
        description: `${newSkill.trim()} has been added to your skills.`,
      });
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
    toast({
      title: "Skill Removed",
      description: `${skill} has been removed from your skills.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Technologies</CardTitle>
        <CardDescription>Manage your technical skills and expertise</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a skill (e.g., Python, React)"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No skills added yet. Start adding your technical skills above!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
