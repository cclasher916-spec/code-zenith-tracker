import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AcademicDetailsProps {
  formData: {
    departmentId: string;
    sectionId: string;
    academicYear: string;
    semester: string;
  };
  onChange: (field: string, value: string) => void;
  role: string;
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

export const AcademicDetails = ({ formData, onChange, role }: AcademicDetailsProps) => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  const requiresSection = ['student', 'team_lead', 'advisor'].includes(role);
  const requiresSemester = ['student', 'team_lead'].includes(role);

  useEffect(() => {
    loadDepartments();
  }, []);

  useEffect(() => {
    if (formData.departmentId) {
      loadSections(formData.departmentId);
    }
  }, [formData.departmentId]);

  const loadDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load departments",
      });
    }
  };

  const loadSections = async (departmentId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('department_id', departmentId)
        .order('code');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error loading sections:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sections",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (value: string) => {
    onChange('departmentId', value);
    onChange('sectionId', ''); // Reset section when department changes
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Academic Information</h2>
        <p className="text-muted-foreground mt-2">
          Help us organize your account by department and section
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Department <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.departmentId} onValueChange={handleDepartmentChange}>
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

        {requiresSection && formData.departmentId && (
          <div className="space-y-2">
            <Label>
              Section <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.sectionId} 
              onValueChange={(value) => onChange('sectionId', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading..." : "Select section"} />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    Section {section.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Academic Year <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.academicYear} onValueChange={(value) => onChange('academicYear', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select academic year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-25">2024-25</SelectItem>
              <SelectItem value="2025-26">2025-26</SelectItem>
              <SelectItem value="2026-27">2026-27</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {requiresSemester && (
          <div className="space-y-2">
            <Label>Semester</Label>
            <Select value={formData.semester} onValueChange={(value) => onChange('semester', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <SelectItem key={sem} value={sem.toString()}>
                    Semester {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};