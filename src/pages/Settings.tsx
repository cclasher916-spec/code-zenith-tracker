import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Moon, Sun, Bell, Shield, LogOut } from "lucide-react";

export default function Settings() {
    const { profile, signOut } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [emailUpdates, setEmailUpdates] = useState(true);

    const handleSave = () => {
        toast({
            title: "Settings Saved",
            description: "Your preferences have been updated successfully.",
        });
    };

    if (!profile) return null;

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                            Appearance
                        </CardTitle>
                        <CardDescription>Customize how the application looks on your device.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">Enable dark mode for better viewing at night.</p>
                            </div>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Configure how you receive alerts and updates.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Push Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive notifications about your activity.</p>
                            </div>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Updates</Label>
                                <p className="text-sm text-muted-foreground">Receive emails about new features and updates.</p>
                            </div>
                            <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
                        </div>
                    </CardContent>
                </Card>

                {/* Privacy & Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Privacy & Security
                        </CardTitle>
                        <CardDescription>Manage your account security and privacy settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Public Profile</Label>
                                <p className="text-sm text-muted-foreground">Allow others to see your profile.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="pt-4">
                            <Button variant="destructive" onClick={signOut} className="w-full sm:w-auto">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave}>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
