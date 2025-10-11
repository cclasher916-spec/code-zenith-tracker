import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  id: string;
  name: string;
  category: string | null;
  level: string | null;
}

export function SkillsSection() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState<string>('Intermediate');
  const [skillCategory, setSkillCategory] = useState<string>('Programming Languages');

  useEffect(() => {
    loadSkills();
  }, [profile]);

  const loadSkills = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    if (!profile) return;
    
    if (newSkill.trim() && !skills.some(s => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      try {
        const { error } = await supabase
          .from('skills')
          .insert({
            user_id: profile.user_id,
            name: newSkill.trim(),
            category: skillCategory,
            level: skillLevel,
          });

        if (error) throw error;

        await loadSkills();
        setNewSkill('');
        toast({
          title: "Skill Added",
          description: `${newSkill.trim()} has been added to your skills.`,
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Add Failed",
          description: error.message,
        });
      }
    }
  };

  const removeSkill = async (skillId: string, skillName: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      await loadSkills();
      toast({
        title: "Skill Removed",
        description: `${skillName} has been removed from your skills.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Remove Failed",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Technologies</CardTitle>
        <CardDescription>Manage your technical skills and expertise</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Skill name (e.g., Python)"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="md:col-span-1"
          />
          <Select value={skillCategory} onValueChange={setSkillCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Programming Languages">Programming Languages</SelectItem>
              <SelectItem value="Frameworks">Frameworks</SelectItem>
              <SelectItem value="Tools">Tools</SelectItem>
              <SelectItem value="Databases">Databases</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2">
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addSkill}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {['Programming Languages', 'Frameworks', 'Tools', 'Databases', 'Other'].map((category) => {
            const categorySkills = skills.filter(s => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category}>
                <h4 className="text-sm font-semibold mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-sm px-3 py-1">
                      <span>{skill.name}</span>
                      {skill.level && (
                        <span className="ml-2 text-xs opacity-70">• {skill.level}</span>
                      )}
                      <button
                        onClick={() => removeSkill(skill.id, skill.name)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
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
