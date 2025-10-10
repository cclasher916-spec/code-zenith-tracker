import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Code, Github, Trophy, Target, Loader2, ExternalLink } from "lucide-react";

interface PlatformProfile {
  id: string;
  platform: string;
  username: string;
  profile_url?: string;
  is_verified: boolean;
}

const platforms = [
  { key: 'leetcode', label: 'LeetCode', icon: Code, urlPattern: 'https://leetcode.com/u/{username}/' },
  { key: 'skillrack', label: 'SkillRack', icon: Target, urlPattern: 'https://www.skillrack.com/faces/resume.xhtml?id={username}' },
  { key: 'codechef', label: 'CodeChef', icon: Trophy, urlPattern: 'https://www.codechef.com/users/{username}' },
  { key: 'hackerrank', label: 'HackerRank', icon: Code, urlPattern: 'https://www.hackerrank.com/profile/{username}' },
  { key: 'github', label: 'GitHub', icon: Github, urlPattern: 'https://github.com/{username}' },
];

export function PlatformProfilesSection() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [existingProfiles, setExistingProfiles] = useState<PlatformProfile[]>([]);

  useEffect(() => {
    loadPlatformProfiles();
  }, [profile]);

  const loadPlatformProfiles = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('platform_profiles')
        .select('*')
        .eq('user_id', profile.user_id);

      if (error) throw error;

      const profileMap: Record<string, string> = {};
      data?.forEach((p: PlatformProfile) => {
        profileMap[p.platform] = p.username;
      });

      setProfiles(profileMap);
      setExistingProfiles(data || []);
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

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);

      // Delete existing profiles
      await supabase
        .from('platform_profiles')
        .delete()
        .eq('user_id', profile.user_id);

      // Insert new profiles
      const newProfiles = Object.entries(profiles)
        .filter(([_, username]) => username.trim() !== '')
        .map(([platform, username]) => ({
          user_id: profile.user_id,
          platform,
          username: username.trim(),
          profile_url: platforms.find(p => p.key === platform)?.urlPattern.replace('{username}', username.trim()),
        }));

      if (newProfiles.length > 0) {
        const { error } = await supabase
          .from('platform_profiles')
          .insert(newProfiles);

        if (error) throw error;
      }

      await loadPlatformProfiles();
      toast({
        title: "Profiles Updated",
        description: "Your platform profiles have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    } finally {
      setSaving(false);
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
        <CardTitle>Coding Platform Profiles</CardTitle>
        <CardDescription>Link your coding profiles for automated tracking</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const username = profiles[platform.key] || '';
            const profileUrl = username ? platform.urlPattern.replace('{username}', username) : '';

            return (
              <div key={platform.key} className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{platform.label}</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    value={username}
                    onChange={(e) => setProfiles({ ...profiles, [platform.key]: e.target.value })}
                    placeholder="Enter username"
                  />
                  {profileUrl && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(profileUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Platform Profiles
        </Button>
      </CardContent>
    </Card>
  );
}
