import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, X, Mail } from "lucide-react";
import { useState } from "react";

interface TeamCreationProps {
  formData: {
    teamName: string;
    teamDescription: string;
    teamGoals: string;
    maxMembers: number;
    memberEmails: string[];
    invitationMessage: string;
  };
  onChange: (field: string, value: any) => void;
}

export const TeamCreation = ({ formData, onChange }: TeamCreationProps) => {
  const [emailInput, setEmailInput] = useState('');

  const addEmail = () => {
    if (emailInput && formData.memberEmails.length < formData.maxMembers - 1) {
      onChange('memberEmails', [...formData.memberEmails, emailInput]);
      setEmailInput('');
    }
  };

  const removeEmail = (index: number) => {
    onChange('memberEmails', formData.memberEmails.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Create Your Team</h2>
        <p className="text-muted-foreground mt-2">
          Set up your coding team and invite members to join
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="teamName">
            Team Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="teamName"
            value={formData.teamName}
            onChange={(e) => onChange('teamName', e.target.value)}
            placeholder="Enter a unique team name"
            required
          />
          <p className="text-xs text-muted-foreground">
            Choose a unique name that represents your team's identity
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamDescription">Team Description</Label>
          <Textarea
            id="teamDescription"
            value={formData.teamDescription}
            onChange={(e) => onChange('teamDescription', e.target.value)}
            placeholder="Describe your team's goals, coding interests, and culture..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="teamGoals">Team Goals</Label>
          <Textarea
            id="teamGoals"
            value={formData.teamGoals}
            onChange={(e) => onChange('teamGoals', e.target.value)}
            placeholder="What does your team want to achieve?"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Maximum Team Size <span className="text-destructive">*</span>
          </Label>
          <Select 
            value={formData.maxMembers.toString()} 
            onValueChange={(value) => onChange('maxMembers', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} members (including you)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Invite Team Members</span>
          </CardTitle>
          <CardDescription>
            Add email addresses of students you want to invite (max {formData.maxMembers - 1} members)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
              placeholder="member@mvit.edu.in"
              disabled={formData.memberEmails.length >= formData.maxMembers - 1}
            />
            <Button 
              type="button"
              onClick={addEmail}
              disabled={!emailInput || formData.memberEmails.length >= formData.maxMembers - 1}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>

          {formData.memberEmails.length > 0 && (
            <div className="space-y-2">
              <Label>Invited Members ({formData.memberEmails.length}/{formData.maxMembers - 1})</Label>
              <div className="space-y-2">
                {formData.memberEmails.map((email, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{email}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmail(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="invitationMessage">Personal Message (Optional)</Label>
            <Textarea
              id="invitationMessage"
              value={formData.invitationMessage}
              onChange={(e) => onChange('invitationMessage', e.target.value)}
              placeholder="Add a personal message to your team invitations..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.invitationMessage.length}/500
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};