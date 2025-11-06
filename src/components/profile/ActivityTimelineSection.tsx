import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, Users, Flame, Trophy, FileEdit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { dbService } from "@/services/database";

interface Activity {
  id: string;
  activity_type: string;
  message: string;
  metadata: any;
  created_at: string;
}

const activityIcons: Record<string, any> = {
  problems_solved: CheckCircle,
  team_joined: Users,
  streak_milestone: Flame,
  badge_earned: Trophy,
  profile_updated: FileEdit,
};

const activityColors: Record<string, string> = {
  problems_solved: "text-green-500",
  team_joined: "text-blue-500",
  streak_milestone: "text-orange-500",
  badge_earned: "text-yellow-500",
  profile_updated: "text-purple-500",
};

export function ActivityTimelineSection() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    loadActivities();
  }, [profile, limit]);

  const loadActivities = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      // Query Firebase for activity_log for this user, ordered, with limit
      const activityResults = await dbService.query('activity_log', {
        where: [['user_id', '==', profile.user_id]],
        orderBy: [['created_at', 'desc']],
        limit,
      });
      setActivities((activityResults || []) as Activity[]);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions and achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.activity_type] || CheckCircle;
                const colorClass = activityColors[activity.activity_type] || "text-gray-500";

                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {activities.length >= limit && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLimit(limit + 10)}
              >
                Load More
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
