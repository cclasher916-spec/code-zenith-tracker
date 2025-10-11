import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trophy, Flame, Target, Crown } from "lucide-react";
import { format } from "date-fns";

interface Achievement {
  id: string;
  badge_name: string;
  category: string;
  description: string | null;
  earned_at: string;
  icon: string | null;
  is_locked: boolean;
}

const categoryIcons: Record<string, any> = {
  coding_streaks: Flame,
  problem_solving: Target,
  team_leadership: Crown,
  platform_mastery: Trophy,
};

const categoryColors: Record<string, string> = {
  coding_streaks: "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
  problem_solving: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
  team_leadership: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
  platform_mastery: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600",
};

export function AchievementsSection() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, [profile]);

  const loadAchievements = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
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

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const earnedAchievements = achievements.filter(a => !a.is_locked);
  const lockedAchievements = achievements.filter(a => a.is_locked);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements & Badges</CardTitle>
        <CardDescription>Your earned accomplishments and progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {earnedAchievements.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
              Earned Badges ({earnedAchievements.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {earnedAchievements.map((achievement) => {
                const Icon = categoryIcons[achievement.category] || Trophy;
                const colorClass = categoryColors[achievement.category] || "bg-gray-100 dark:bg-gray-900/20";
                
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg ${colorClass} border`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{achievement.badge_name}</h4>
                        {achievement.description && (
                          <p className="text-xs mt-1 opacity-80">{achievement.description}</p>
                        )}
                        <p className="text-xs mt-2 opacity-70">
                          Earned {format(new Date(achievement.earned_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-muted-foreground">
              Locked Badges ({lockedAchievements.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lockedAchievements.map((achievement) => {
                const Icon = categoryIcons[achievement.category] || Trophy;
                
                return (
                  <div
                    key={achievement.id}
                    className="p-4 rounded-lg bg-muted/50 border border-dashed opacity-60"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Icon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-muted-foreground">
                          {achievement.badge_name}
                        </h4>
                        {achievement.description && (
                          <p className="text-xs mt-1 text-muted-foreground">
                            {achievement.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {achievements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No achievements yet. Keep coding to earn badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
