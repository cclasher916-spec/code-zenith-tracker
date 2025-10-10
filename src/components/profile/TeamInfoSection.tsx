import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Team {
  id: string;
  name: string;
  description: string;
  status: string;
  current_count: number;
  max_members: number;
  team_lead_id: string;
}

export function TeamInfoSection() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [ledTeams, setLedTeams] = useState<Team[]>([]);

  useEffect(() => {
    loadTeams();
  }, [profile]);

  const loadTeams = async () => {
    if (!profile) return;

    try {
      setLoading(true);

      // Load teams where user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select('team_id, teams(*)')
        .eq('user_id', profile.user_id)
        .eq('is_active', true);

      if (memberError) throw memberError;

      const memberTeams = memberData?.map((tm: any) => tm.teams).filter(Boolean) || [];
      setTeams(memberTeams);

      // Load teams where user is team lead
      const { data: leadData, error: leadError } = await supabase
        .from('teams')
        .select('*')
        .eq('team_lead_id', profile.user_id);

      if (leadError) throw leadError;
      setLedTeams(leadData || []);
    } catch (error) {
      console.error('Error loading teams:', error);
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

  const isTeamLead = profile?.role === 'team_lead';
  const hasTeams = teams.length > 0 || ledTeams.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Information</CardTitle>
        <CardDescription>Your team memberships and leadership</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ledTeams.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Crown className="w-4 h-4 mr-2 text-yellow-500" />
              Teams You Lead
            </h3>
            <div className="space-y-3">
              {ledTeams.map((team) => (
                <div key={team.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{team.name}</p>
                      {team.description && (
                        <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          team.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                          team.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
                        }`}>
                          {team.status}
                        </span>
                        <span className="text-muted-foreground">
                          {team.current_count}/{team.max_members} members
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {teams.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Teams You're In
            </h3>
            <div className="space-y-3">
              {teams.map((team) => (
                <div key={team.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{team.name}</p>
                      {team.description && (
                        <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          team.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        }`}>
                          {team.status}
                        </span>
                        <span className="text-muted-foreground">
                          {team.current_count}/{team.max_members} members
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hasTeams && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">
              {isTeamLead 
                ? "You haven't created any teams yet" 
                : "You're not part of any teams yet"}
            </p>
            <Button onClick={() => navigate('/')}>
              {isTeamLead ? 'Create a Team' : 'Browse Teams'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
