import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function AboutSection() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState((profile as any)?.bio || '');

  const handleSave = async () => {
    if (!profile) return;

    if (bio.length > 1000) {
      toast({
        variant: "destructive",
        title: "Bio Too Long",
        description: "Please keep your bio under 1000 characters.",
      });
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({ bio })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      await refreshProfile();
      setEditing(false);
      toast({
        title: "Bio Updated",
        description: "Your bio has been updated successfully.",
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

  const handleCancel = () => {
    setBio((profile as any)?.bio || '');
    setEditing(false);
  };

  if (!profile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Me</CardTitle>
        <CardDescription>Tell others about yourself, your interests, and goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!editing ? (
          <>
            <p className="text-sm whitespace-pre-wrap">
              {(profile as any).bio || "No bio added yet. Click edit to add information about yourself."}
            </p>
            <Button onClick={() => setEditing(true)} variant="outline">
              Edit Bio
            </Button>
          </>
        ) : (
          <>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
              rows={8}
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {bio.length}/1000 characters
              </span>
              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
