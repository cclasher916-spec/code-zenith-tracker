import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { RoleSelection } from "./steps/RoleSelection";
import { PersonalDetails } from "./steps/PersonalDetails";
import { AcademicDetails } from "./steps/AcademicDetails";
import { AccountSecurity } from "./steps/AccountSecurity";
import { PlatformProfiles } from "./steps/PlatformProfiles";
import { NotificationPreferences } from "./steps/NotificationPreferences";
import { TeamCreation } from "./steps/TeamCreation";
import { ReviewAndSubmit } from "./steps/ReviewAndSubmit";

interface MultiStepRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData = {
  // Personal
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  rollNumber: '',
  // Academic
  departmentId: '',
  sectionId: '',
  academicYear: '2025-26',
  semester: '',
  // Security
  password: '',
  confirmPassword: '',
  // Platforms
  platforms: {
    leetcode: '',
    skillrack: '',
    codechef: '',
    hackerrank: '',
    github: '',
  },
  // Notifications
  emailNotifications: true,
  whatsappNotifications: false,
  inAppNotifications: true,
  // Team
  teamName: '',
  teamDescription: '',
  teamGoals: '',
  maxMembers: 5,
  memberEmails: [] as string[],
  invitationMessage: '',
};

const initialAgreements = {
  terms: false,
  dataAccuracy: false,
  platformProfiles: false,
};

export const MultiStepRegistration = ({ isOpen, onClose }: MultiStepRegistrationProps) => {
  const { signUp, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState(initialFormData);
  const [agreements, setAgreements] = useState(initialAgreements);
  const [departments, setDepartments] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  // Load departments and sections (will be loaded in AcademicDetails)
  const updateFormData = (field: string, value: any) => {
    if (field.startsWith('platforms.')) {
      const platform = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        platforms: { ...prev.platforms, [platform]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const updateAgreement = (field: string, value: boolean) => {
    setAgreements(prev => ({ ...prev, [field]: value }));
  };

  // Define steps based on role
  const getSteps = () => {
    const commonSteps = [
      { component: RoleSelection, title: 'Select Role' },
      { component: PersonalDetails, title: 'Personal Details' },
      { component: AcademicDetails, title: 'Academic Info' },
      { component: AccountSecurity, title: 'Security' },
    ];

    const roleSpecificSteps: Record<string, any[]> = {
      student: [
        { component: NotificationPreferences, title: 'Notifications' },
        { component: PlatformProfiles, title: 'Platforms' },
        { component: ReviewAndSubmit, title: 'Review' },
      ],
      team_lead: [
        { component: PlatformProfiles, title: 'Platforms' },
        { component: TeamCreation, title: 'Create Team' },
        { component: NotificationPreferences, title: 'Notifications' },
        { component: ReviewAndSubmit, title: 'Review' },
      ],
      advisor: [
        { component: ReviewAndSubmit, title: 'Review' },
      ],
      hod: [
        { component: ReviewAndSubmit, title: 'Review' },
      ],
      admin: [
        { component: ReviewAndSubmit, title: 'Review' },
      ],
    };

    return [...commonSteps, ...(roleSpecificSteps[selectedRole] || [])];
  };

  const steps = getSteps();
  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const canProceed = () => {
    // Validation logic for each step
    switch (currentStep) {
      case 0: // Role selection
        return selectedRole !== '';
      case 1: // Personal details
        return formData.firstName && formData.lastName && formData.email &&
               (!['student', 'team_lead'].includes(selectedRole) || formData.rollNumber);
      case 2: // Academic details
        return formData.departmentId && formData.academicYear &&
               (!['student', 'team_lead', 'advisor'].includes(selectedRole) || formData.sectionId);
      case 3: // Security
        return formData.password.length >= 8 && 
               formData.password === formData.confirmPassword &&
               /[A-Z]/.test(formData.password) &&
               /[a-z]/.test(formData.password) &&
               /[0-9]/.test(formData.password);
      case steps.length - 1: // Review
        return agreements.terms && agreements.dataAccuracy;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    try {
      // Register user
      await signUp(formData.email, formData.password, {
        full_name: `${formData.firstName} ${formData.lastName}`,
        roll_number: formData.rollNumber || undefined,
        phone: formData.phone || undefined,
        department_id: formData.departmentId,
        section_id: formData.sectionId || undefined,
        role: selectedRole as any,
        academic_year: formData.academicYear,
      });

      toast({
        title: "Registration Successful!",
        description: selectedRole === 'team_lead' 
          ? "Your team has been created and invitations will be sent."
          : "Welcome to Code Zenith Tracker!",
      });

      resetForm();
      onClose();
      
      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate(`/dashboard/${selectedRole}`);
      }, 500);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const resetForm = () => {
    setCurrentStep(0);
    setSelectedRole('student');
    setFormData(initialFormData);
    setAgreements(initialAgreements);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </DialogTitle>
        </DialogHeader>

        <Progress value={progress} className="w-full" />

        <div className="flex-1 overflow-y-auto py-6">
          {CurrentStepComponent === RoleSelection && (
            <RoleSelection 
              selectedRole={selectedRole} 
              onRoleChange={setSelectedRole} 
            />
          )}
          {CurrentStepComponent === PersonalDetails && (
            <PersonalDetails 
              formData={formData} 
              onChange={updateFormData}
              role={selectedRole}
            />
          )}
          {CurrentStepComponent === AcademicDetails && (
            <AcademicDetails 
              formData={formData} 
              onChange={updateFormData}
              role={selectedRole}
            />
          )}
          {CurrentStepComponent === AccountSecurity && (
            <AccountSecurity 
              formData={formData} 
              onChange={updateFormData}
            />
          )}
          {CurrentStepComponent === PlatformProfiles && (
            <PlatformProfiles 
              formData={formData.platforms} 
              onChange={(field, value) => updateFormData(`platforms.${field}`, value)}
              role={selectedRole}
            />
          )}
          {CurrentStepComponent === NotificationPreferences && (
            <NotificationPreferences 
              formData={formData} 
              onChange={updateFormData}
              hasPhone={!!formData.phone}
            />
          )}
          {CurrentStepComponent === TeamCreation && (
            <TeamCreation 
              formData={formData} 
              onChange={updateFormData}
            />
          )}
          {CurrentStepComponent === ReviewAndSubmit && (
            <ReviewAndSubmit 
              formData={formData}
              role={selectedRole}
              agreements={agreements}
              onAgreementChange={updateAgreement}
              departments={departments}
              sections={sections}
            />
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!canProceed() || loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};