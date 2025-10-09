import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, GraduationCap, Building, Code, Users, CheckCircle2 } from "lucide-react";

interface ReviewAndSubmitProps {
  formData: any;
  role: string;
  agreements: {
    terms: boolean;
    dataAccuracy: boolean;
    platformProfiles: boolean;
  };
  onAgreementChange: (field: string, value: boolean) => void;
  departments: any[];
  sections: any[];
}

export const ReviewAndSubmit = ({ 
  formData, 
  role, 
  agreements, 
  onAgreementChange,
  departments,
  sections 
}: ReviewAndSubmitProps) => {
  const department = departments.find(d => d.id === formData.departmentId);
  const section = sections.find(s => s.id === formData.sectionId);
  const fullName = `${formData.firstName} ${formData.lastName}`;

  const platformCount = Object.values(formData.platforms || {}).filter(v => v).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Review & Submit</h2>
        <p className="text-muted-foreground mt-2">
          Please review your information before submitting
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{fullName}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          {formData.phone && (
            <>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{formData.phone}</span>
              </div>
            </>
          )}
          {formData.rollNumber && (
            <>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Roll Number</span>
                <span className="font-medium">{formData.rollNumber}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            <span>Academic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <Badge>{role.replace('_', ' ').toUpperCase()}</Badge>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department</span>
            <span className="font-medium">{department?.name || 'N/A'}</span>
          </div>
          {section && (
            <>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Section</span>
                <span className="font-medium">Section {section.code}</span>
              </div>
            </>
          )}
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Academic Year</span>
            <span className="font-medium">{formData.academicYear}</span>
          </div>
        </CardContent>
      </Card>

      {/* Platform Profiles */}
      {platformCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>Coding Platforms ({platformCount})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formData.platforms && Object.entries(formData.platforms).map(([platform, username]) => 
              username && (
                <div key={platform} className="flex items-center justify-between">
                  <span className="text-muted-foreground capitalize">{platform}</span>
                  <span className="font-medium">{username as string}</span>
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}

      {/* Team Information */}
      {role === 'team_lead' && formData.teamName && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Team Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Team Name</span>
              <span className="font-medium">{formData.teamName}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Members</span>
              <span className="font-medium">{formData.maxMembers}</span>
            </div>
            {formData.memberEmails?.length > 0 && (
              <>
                <Separator />
                <div>
                  <span className="text-muted-foreground">Invited Members</span>
                  <div className="mt-2 space-y-1">
                    {formData.memberEmails.map((email: string, i: number) => (
                      <div key={i} className="text-sm font-medium">{email}</div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Agreements */}
      <Card>
        <CardHeader>
          <CardTitle>Agreements & Confirmations</CardTitle>
          <CardDescription>Please review and accept the following</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreements.terms}
              onCheckedChange={(checked) => onAgreementChange('terms', checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm cursor-pointer">
              I accept the terms and conditions and agree to follow the code of conduct
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="dataAccuracy"
              checked={agreements.dataAccuracy}
              onCheckedChange={(checked) => onAgreementChange('dataAccuracy', checked as boolean)}
            />
            <Label htmlFor="dataAccuracy" className="text-sm cursor-pointer">
              I confirm that all provided information is accurate and up-to-date
            </Label>
          </div>

          {platformCount > 0 && (
            <div className="flex items-start space-x-3">
              <Checkbox
                id="platformProfiles"
                checked={agreements.platformProfiles}
                onCheckedChange={(checked) => onAgreementChange('platformProfiles', checked as boolean)}
              />
              <Label htmlFor="platformProfiles" className="text-sm cursor-pointer">
                I verify that the coding platform profiles belong to me
              </Label>
            </div>
          )}

          {role === 'team_lead' && formData.memberEmails?.length > 0 && (
            <div className="flex items-start space-x-3">
              <Checkbox
                id="memberConsent"
                checked={agreements.terms} // Reuse terms for now
                disabled
              />
              <Label htmlFor="memberConsent" className="text-sm text-muted-foreground">
                I have obtained consent from invited members before sending invitations
              </Label>
            </div>
          )}
        </CardContent>
      </Card>

      {role === 'team_lead' && (
        <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-info mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-info-foreground">Approval Process</p>
              <p className="text-xs text-muted-foreground">
                Your team registration will be reviewed by your class representative and then by an administrator. 
                You'll receive an email once your team is approved and activated.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};