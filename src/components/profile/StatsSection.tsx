import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Award, Flame, Target } from "lucide-react";
import { dbService } from "@/services/database";

interface DailyStats {
  platform: string;
  total_solved: number;
  daily_increase: number;
  coding_streak: number;
  rank_in_team: number | null;
  rank_in_section: number | null;
}

export function StatsSection() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DailyStats[]>([]);

  useEffect(() => {
    loadStats();
  }, [profile]);

  const loadStats = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const results = await dbService.query('daily_stats', {
        where: [['user_id', '==', profile.user_id]],
        orderBy: [['date', 'desc']],
        limit: 5,
      });
      setStats((results || []) as DailyStats[]);
    } catch (error) {
      console.error('Error loading stats:', error);
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

  const totalSolved = stats.reduce((sum, s) => sum + s.total_solved, 0);
  const maxStreak = Math.max(...stats.map(s => s.coding_streak), 0);
  const avgIncrease = stats.length > 0 ? stats.reduce((sum, s) => sum + s.daily_increase, 0) / stats.length : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Coding Stats</CardTitle>
        <CardDescription>Your coding progress across platforms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2 p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Total Solved</span>
            </div>
            <p className="text-2xl font-bold">{totalSolved}</p>
          </div>

          <div className="space-y-2 p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">Max Streak</span>
            </div>
            <p className="text-2xl font-bold">{maxStreak}</p>
          </div>

          <div className="space-y-2 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Avg Daily</span>
            </div>
            <p className="text-2xl font-bold">{avgIncrease.toFixed(1)}</p>
          </div>

          <div className="space-y-2 p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Platforms</span>
            </div>
            <p className="text-2xl font-bold">{stats.length}</p>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Recent Activity by Platform</h3>
            <div className="space-y-3">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{stat.platform}</p>
                    <p className="text-sm text-muted-foreground">
                      Solved: {stat.total_solved} | Streak: {stat.coding_streak} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      +{stat.daily_increase} today
                    </p>
                    {stat.rank_in_team && (
                      <p className="text-xs text-muted-foreground">
                        Team Rank: #{stat.rank_in_team}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No coding activity yet. Start solving problems to see your stats here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
