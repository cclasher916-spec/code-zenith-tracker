import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Edit, ExternalLink, Download, Upload } from "lucide-react";
import { dbService } from "@/services/database";
import { storageService } from "@/services/storage";

const roleColors: Record<string, string> = {
  student: "bg-blue-500",
  team_lead: "bg-purple-500",
  advisor: "bg-green-500",
  hod: "bg-orange-500",
  admin: "bg-red-500",
};

export function ProfileHeader() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
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

      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${profile.uid}/${Date.now()}.${fileExt}`;

      // Upload to Firebase Storage
      const downloadURL = await storageService.uploadFile(filePath, file);

      // Update profile with new avatar URL
      await dbService.update('profiles', profile.id, { avatarUrl: downloadURL });
      await refreshProfile();

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return null;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback>{getInitials(profile.fullName)}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-3 w-3" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold">{profile.fullName}</h2>
            <p className="text-muted-foreground">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
              <Badge className={roleColors[profile.role]}>
                {profile.role.replace('_', ' ').toUpperCase()}
              </Badge>
              {profile.departmentId && (
                <span className="text-sm text-muted-foreground">
                  Department • Section {profile.sectionId ? 'Assigned' : 'Pending'}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
              <Edit className="h-4 w-4 mr-2" />
              Settings
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
