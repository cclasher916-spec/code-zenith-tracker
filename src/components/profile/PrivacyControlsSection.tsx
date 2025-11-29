import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Lock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { dbService } from "@/services/database";

export function PrivacyControlsSection() {
    const { profile, refreshProfile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Mock privacy settings if not in profile
    const [settings, setSettings] = useState({
        emailVisible: (profile as any)?.privacy?.emailVisible ?? false,
        showAchievements: (profile as any)?.privacy?.showAchievements ?? true,
        statsVisible: (profile as any)?.privacy?.statsVisible ?? true,
        allowInvites: (profile as any)?.privacy?.allowInvites ?? true,
    });

    const handleToggle = (key: string) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    const handleSave = async () => {
        if (!profile) return;

        try {
            setLoading(true);
            await dbService.update('profiles', profile.id, { privacy: settings });
            await refreshProfile();

            toast({
                title: "Settings Saved",
                description: "Your privacy preferences have been updated.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Failed to save privacy settings.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Privacy Controls
                </CardTitle>
                <CardDescription>Manage who can see your profile and activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="email-visible" className="font-medium">Show email publicly</Label>
                            <span className="text-xs text-muted-foreground">Allow other users to see your email address</span>
                        </div>
                        <Switch
                            id="email-visible"
                            checked={settings.emailVisible}
                            onCheckedChange={() => handleToggle('emailVisible')}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="show-achievements" className="font-medium">Display achievements</Label>
                            <span className="text-xs text-muted-foreground">Show your badges and certificates on your public profile</span>
                        </div>
                        <Switch
                            id="show-achievements"
                            checked={settings.showAchievements}
                            onCheckedChange={() => handleToggle('showAchievements')}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="stats-visible" className="font-medium">Public coding stats</Label>
                            <span className="text-xs text-muted-foreground">Allow others to view your coding performance metrics</span>
                        </div>
                        <Switch
                            id="stats-visible"
                            checked={settings.statsVisible}
                            onCheckedChange={() => handleToggle('statsVisible')}
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="allow-invites" className="font-medium">Allow invitations</Label>
                            <span className="text-xs text-muted-foreground">Receive team invitations from other students or leads</span>
                        </div>
                        <Switch
                            id="allow-invites"
                            checked={settings.allowInvites}
                            onCheckedChange={() => handleToggle('allowInvites')}
                        />
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
