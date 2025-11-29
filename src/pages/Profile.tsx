import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalInfoSection } from "@/components/profile/PersonalInfoSection";
import { AcademicInfoSection } from "@/components/profile/AcademicInfoSection";
import { AboutSection } from "@/components/profile/AboutSection";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { EducationSection } from "@/components/profile/EducationSection";
import { ResumeSection } from "@/components/profile/ResumeSection";

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-destructive">Profile not found</div>
      </div>
    );
  }

  const isTeamLead = profile.role === 'team_lead';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <ProfileHeader />

      <div className="grid gap-6">
        <PersonalInfoSection />

        <AcademicInfoSection />

        <AboutSection />

        <SkillsSection />

        {isTeamLead && (
          <>
            <ResumeSection />
            <ExperienceSection />
            <EducationSection />
          </>
        )}
      </div>
    </div>
  );
}
