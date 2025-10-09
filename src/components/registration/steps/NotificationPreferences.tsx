import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mail, MessageSquare, Phone } from "lucide-react";

interface NotificationPreferencesProps {
  formData: {
    emailNotifications: boolean;
    whatsappNotifications: boolean;
    inAppNotifications: boolean;
  };
  onChange: (field: string, value: boolean) => void;
  hasPhone: boolean;
}

export const NotificationPreferences = ({ formData, onChange, hasPhone }: NotificationPreferencesProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Communication Preferences</h2>
        <p className="text-muted-foreground mt-2">
          Choose how you'd like to receive updates about your coding progress
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Email Notifications</CardTitle>
                  <CardDescription className="text-sm">
                    Receive weekly progress reports and important updates
                  </CardDescription>
                </div>
              </div>
              <Switch
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => onChange('emailNotifications', checked)}
              />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <MessageSquare className="w-5 h-5 text-success" />
                </div>
                <div>
                  <CardTitle className="text-base">WhatsApp Notifications</CardTitle>
                  <CardDescription className="text-sm">
                    {hasPhone 
                      ? 'Get instant updates on your phone via WhatsApp'
                      : 'Add phone number to enable WhatsApp notifications'
                    }
                  </CardDescription>
                </div>
              </div>
              <Switch
                checked={formData.whatsappNotifications}
                onCheckedChange={(checked) => onChange('whatsappNotifications', checked)}
                disabled={!hasPhone}
              />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Bell className="w-5 h-5 text-info" />
                </div>
                <div>
                  <CardTitle className="text-base">In-App Notifications</CardTitle>
                  <CardDescription className="text-sm">
                    Receive notifications within the platform
                  </CardDescription>
                </div>
              </div>
              <Switch
                checked={formData.inAppNotifications}
                onCheckedChange={(checked) => onChange('inAppNotifications', checked)}
              />
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> We recommend enabling email notifications to stay updated with your weekly coding progress reports and team activities.
        </p>
      </div>
    </div>
  );
};