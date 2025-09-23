import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Code2, User, Building, Users } from "lucide-react";

interface AuthModalProps {
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

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { signIn, signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [role, setRole] = useState<'student' | 'team_lead' | 'advisor' | 'hod' | 'admin'>('student');

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

  // Filter sections by department
  const filteredSections = sections.filter(section => section.department_id === departmentId);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      onClose();
      resetForm();
    } catch (error) {
      // Error is handled in useAuth hook
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, {
        full_name: fullName,
        roll_number: rollNumber || undefined,
        phone: phone || undefined,
        department_id: departmentId || undefined,
        section_id: sectionId || undefined,
        role,
        academic_year: '2024-25',
      });
      onClose();
      resetForm();
    } catch (error) {
      // Error is handled in useAuth hook
    }
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span>MVIT Coding Tracker</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
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

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@mvit.edu.in"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
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

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Student</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="team_lead">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Team Lead</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="advisor">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4" />
                        <span>Class Advisor</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hod">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4" />
                        <span>HOD</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={departmentId} onValueChange={setDepartmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {departmentId && (
                <div className="space-y-2">
                  <Label>Section</Label>
                  <Select value={sectionId} onValueChange={setSectionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          Section {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;