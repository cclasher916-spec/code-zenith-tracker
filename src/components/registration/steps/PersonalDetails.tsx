import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalDetailsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    rollNumber: string;
  };
  onChange: (field: string, value: string) => void;
  role: string;
}

export const PersonalDetails = ({ formData, onChange, role }: PersonalDetailsProps) => {
  const requiresRollNumber = ['student', 'team_lead'].includes(role);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
        <p className="text-muted-foreground mt-2">
          Enter your basic details to create your account
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="John"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="your.email@mvit.edu.in"
          required
        />
        <p className="text-xs text-muted-foreground">
          Preferably use your MVIT institutional email
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+91 9876543210"
          />
          <p className="text-xs text-muted-foreground">
            For WhatsApp notifications (optional)
          </p>
        </div>

        {requiresRollNumber && (
          <div className="space-y-2">
            <Label htmlFor="rollNumber">
              Roll Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rollNumber"
              value={formData.rollNumber}
              onChange={(e) => onChange('rollNumber', e.target.value)}
              placeholder="22AIML001"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
};