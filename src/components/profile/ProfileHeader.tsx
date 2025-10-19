import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, ExternalLink, Download, Upload } from "lucide-react";
import { dbService } from "@/services/database";

const roleColors: Record<string, string> = {
  student: "bg-blue-500",
  team_lead: "bg-purple-500",
  advisor: "bg-green-500",
  hod: "bg-orange-500",
  admin: "bg-red-500",
};

export function ProfileHeader() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile || !event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    
    // Validate file
    if (!file.type.match(/^image\/(jpg|jpeg|png)$/)) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please upload a JPG, JPEG, or PNG image.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}-${Date.now()}.${fileExt}`;
      
      // For now, store the image as base64 in Firestore (you may replace with Firebase Storage later)
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await dbService.update('profiles', profile.id, { avatar_url: reader.result as string });
          await refreshProfile();
          toast({
            title: "Avatar Updated",
            description: "Your profile picture has been updated successfully.",
          });
        } catch (err: any) {
          toast({
            variant: "destructive",
            title: "Update Failed",
            description: err.message,
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={(profile as any).avatar_url || undefined} alt={profile.full_name} />
              <AvatarFallback className="text-2xl">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 cursor-pointer">
              <div className="bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90">
                <Upload className="h-3 w-3" />
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            <p className="text-muted-foreground">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
              <Badge className={roleColors[profile.role]}>
                {profile.role.replace('_', ' ').toUpperCase()}
              </Badge>
              {profile.department_id && (
                <span className="text-sm text-muted-foreground">
                  Department • Section {profile.section_id ? 'Assigned' : 'Pending'}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Public Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
