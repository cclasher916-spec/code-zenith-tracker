import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Code2 } from "lucide-react";
import { MultiStepRegistration } from "./MultiStepRegistration";

interface RegistrationFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationFlow = ({ isOpen, onClose }: RegistrationFlowProps) => {
  const { signIn, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const [showMultiStep, setShowMultiStep] = useState(false);
  
  // Sign-in form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle sign in
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

  // Reset form
  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  // Handle showing multi-step registration
  const handleShowRegistration = () => {
    setShowMultiStep(true);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-primary" />
              <span>Code Zenith Tracker</span>
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

            <TabsContent value="signup" className="space-y-4 text-center py-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Create Your Account</h3>
                <p className="text-sm text-muted-foreground">
                  Join Code Zenith Tracker to monitor your coding progress across multiple platforms
                </p>
                <Button onClick={handleShowRegistration} className="w-full" size="lg">
                  Start Registration
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <MultiStepRegistration 
        isOpen={showMultiStep} 
        onClose={() => setShowMultiStep(false)}
      />
    </>
  );
};

export default RegistrationFlow;