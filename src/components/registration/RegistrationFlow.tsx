import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Code2, User, Building, Users, UserPlus, Trophy, Mail } from "lucide-react";

interface RegistrationFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Section {
  id: string;
  name: string;
  code: string;
  department_id: string;
}

const RegistrationFlow = ({ isOpen, onClose }: RegistrationFlowProps) => {
  const { signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("signin");
  const [registrationType, setRegistrationType] = useState<"individual" | "team_leader">("individual");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  
  // Basic form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [role, setRole] = useState<'student' | 'team_lead' | 'advisor' | 'hod' | 'admin'>('student');

  // Team creation states
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [memberEmails, setMemberEmails] = useState<string[]>(['', '', '', '']);

  // Platform profile states
  const [platforms, setPlatforms] = useState([
    { name: 'leetcode', display: 'LeetCode', required: false },
    { name: 'codeforces', display: 'Codeforces', required: false },
    { name: 'hackerrank', display: 'HackerRank', required: false },
    { name: 'codechef', display: 'CodeChef', required: false },
  ]);
  const [platformProfiles, setPlatformProfiles] = useState<{[key: string]: string}>({});

  // Load departments and sections
  useEffect(() => {
    const loadData = async () => {
      const { data: deptData } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      
      if (deptData) setDepartments(deptData);

      const { data: sectionData } = await supabase
        .from('sections')
        .select('*')
        .order('name');
      
      if (sectionData) setSections(sectionData);
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const filteredSections = sections.filter(section => section.department_id === departmentId);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      onClose();
      resetForm();
    } catch (error) {
      // Error handled in useAuth
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user account
      await signUp(email, password, {
        full_name: fullName,
        roll_number: rollNumber || undefined,
        phone: phone || undefined,
        department_id: departmentId || undefined,
        section_id: sectionId || undefined,
        role: registrationType === 'team_leader' ? 'team_lead' : role,
        academic_year: '2024-25',
      });

      // Create platform profiles if provided
      if (Object.keys(platformProfiles).length > 0) {
        await createPlatformProfiles();
      }

      // Create team if team leader registration
      if (registrationType === 'team_leader' && teamName) {
        await createTeamAndInviteMembers();
      }

      // Create initial daily stats entry
      await createInitialStats();

      toast({
        title: "Registration Successful!",
        description: registrationType === 'team_leader' 
          ? "Account created and team invitations sent!"
          : "Welcome to MVIT Coding Tracker!",
      });

      onClose();
      resetForm();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const createPlatformProfiles = async () => {
    try {
      // This would be called after successful registration
      const profileEntries = Object.entries(platformProfiles)
        .filter(([_, username]) => username.trim())
        .map(([platform, username]) => ({
          platform,
          username: username.trim(),
          profile_url: generateProfileUrl(platform, username.trim()),
        }));

      if (profileEntries.length > 0) {
        // Note: This would need to be done after user creation
        console.log('Platform profiles to create:', profileEntries);
      }
    } catch (error) {
      console.error('Error creating platform profiles:', error);
    }
  };

  const createTeamAndInviteMembers = async () => {
    try {
      // Note: This would be implemented after user creation
      console.log('Team to create:', {
        name: teamName,
        description: teamDescription,
        maxMembers,
        memberEmails: memberEmails.filter(email => email.trim())
      });
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const createInitialStats = async () => {
    try {
      // Create initial stats entry for the user
      console.log('Creating initial stats for user');
    } catch (error) {
      console.error('Error creating initial stats:', error);
    }
  };

  const generateProfileUrl = (platform: string, username: string) => {
    const patterns: {[key: string]: string} = {
      leetcode: `https://leetcode.com/u/${username}/`,
      codeforces: `https://codeforces.com/profile/${username}`,
      hackerrank: `https://www.hackerrank.com/profile/${username}`,
      codechef: `https://www.codechef.com/users/${username}`,
    };
    return patterns[platform] || '';
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setRollNumber("");
    setPhone("");
    setDepartmentId("");
    setSectionId("");
    setRole('student');
    setRegistrationType('individual');
    setTeamName("");
    setTeamDescription("");
    setMaxMembers(5);
    setMemberEmails(['', '', '', '']);
    setPlatformProfiles({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span>MVIT Coding Tracker</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@mvit.edu.in"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-6">
            {/* Registration Type Selection */}
            <div className="space-y-4">
              <Label>Registration Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer transition-all ${registrationType === 'individual' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setRegistrationType('individual')}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Individual Student</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Register and join teams later</p>
                  </CardContent>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all ${registrationType === 'team_leader' ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setRegistrationType('team_leader')}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Team Leader</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Create team and invite members</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name *</Label>
                    <Input
                      id="signup-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@mvit.edu.in"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roll-number">Roll Number</Label>
                    <Input
                      id="roll-number"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="22AIML001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Academic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select value={departmentId} onValueChange={setDepartmentId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.length > 0 ? departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </SelectItem>
                        )) : (
                          <SelectItem value="" disabled>Loading departments...</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {departmentId && (
                    <div className="space-y-2">
                      <Label>Section *</Label>
                      <Select value={sectionId} onValueChange={setSectionId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSections.length > 0 ? filteredSections.map((section) => (
                            <SelectItem key={section.id} value={section.id}>
                              Section {section.code}
                            </SelectItem>
                          )) : (
                            <SelectItem value="" disabled>
                              {departmentId ? 'Loading sections...' : 'Select department first'}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {registrationType === 'individual' && (
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(value: any) => setRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="advisor">Class Advisor</SelectItem>
                        <SelectItem value="hod">HOD</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Platform Profiles */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Coding Platform Profiles (Optional)</h3>
                <p className="text-xs text-muted-foreground">Add your coding platform usernames to enable automatic progress tracking. All fields are optional.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  {platforms.map((platform) => (
                    <div key={platform.name} className="space-y-2">
                      <Label className="flex items-center space-x-2">
                        <span>{platform.display}</span>
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                      </Label>
                      <Input
                        value={platformProfiles[platform.name] || ''}
                        onChange={(e) => setPlatformProfiles(prev => ({
                          ...prev,
                          [platform.name]: e.target.value
                        }))}
                        placeholder={`Your ${platform.display} username (optional)`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Creation (for team leaders) */}
              {registrationType === 'team_leader' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Team Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name *</Label>
                    <Input
                      id="team-name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team-description">Team Description</Label>
                    <Textarea
                      id="team-description"
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      placeholder="Describe your team's goals and culture"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum Team Size</Label>
                    <Select value={maxMembers.toString()} onValueChange={(value) => setMaxMembers(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 members</SelectItem>
                        <SelectItem value="4">4 members</SelectItem>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="6">6 members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Invite Team Members (Email Addresses)</Label>
                    {memberEmails.map((email, index) => (
                      <Input
                        key={index}
                        value={email}
                        onChange={(e) => {
                          const newEmails = [...memberEmails];
                          newEmails[index] = e.target.value;
                          setMemberEmails(newEmails);
                        }}
                        placeholder={`Member ${index + 1} email (optional)`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : registrationType === 'team_leader' ? "Create Account & Team" : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationFlow;