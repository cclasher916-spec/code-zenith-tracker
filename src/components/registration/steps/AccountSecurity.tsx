import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

interface AccountSecurityProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  onChange: (field: string, value: string) => void;
}

export const AccountSecurity = ({ formData, onChange }: AccountSecurityProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    match: formData.password && formData.password === formData.confirmPassword,
  };

  const PasswordCheck = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center space-x-2 text-sm">
      {met ? (
        <CheckCircle2 className="w-4 h-4 text-success" />
      ) : (
        <XCircle className="w-4 h-4 text-muted-foreground" />
      )}
      <span className={met ? 'text-success' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Account Security</h2>
        <p className="text-muted-foreground mt-2">
          Create a strong password to protect your account
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              placeholder="Create a strong password"
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium text-foreground mb-2">Password Requirements:</p>
          <PasswordCheck met={passwordChecks.length} label="At least 8 characters" />
          <PasswordCheck met={passwordChecks.uppercase} label="One uppercase letter" />
          <PasswordCheck met={passwordChecks.lowercase} label="One lowercase letter" />
          <PasswordCheck met={passwordChecks.number} label="One number" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => onChange('confirmPassword', e.target.value)}
              placeholder="Confirm your password"
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formData.confirmPassword && (
            <PasswordCheck 
              met={passwordChecks.match} 
              label={passwordChecks.match ? "Passwords match" : "Passwords don't match"} 
            />
          )}
        </div>
      </div>
    </div>
  );
};