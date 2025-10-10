import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Section {
  id: string;
  name: string;
  code: string;
}

export function AcademicInfoSection() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<Department | null>(null);
  const [section, setSection] = useState<Section | null>(null);

  useEffect(() => {
    const loadAcademicData = async () => {
      if (!profile) return;

      try {
        setLoading(true);

        if (profile.department_id) {
          const { data: deptData } = await supabase
            .from('departments')
            .select('*')
            .eq('id', profile.department_id)
            .single();
          
          if (deptData) setDepartment(deptData);
        }

        if (profile.section_id) {
          const { data: sectionData } = await supabase
            .from('sections')
            .select('*')
            .eq('id', profile.section_id)
            .single();
          
          if (sectionData) setSection(sectionData);
        }
      } catch (error) {
        console.error('Error loading academic data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAcademicData();
  }, [profile]);

  if (!profile) return null;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Information</CardTitle>
        <CardDescription>Your academic details and affiliations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {department && (
            <div className="space-y-2">
              <Label>Department</Label>
              <div className="text-sm font-medium p-3 bg-muted rounded-md">
                {department.name} ({department.code})
              </div>
            </div>
          )}

          {section && (
            <div className="space-y-2">
              <Label>Section</Label>
              <div className="text-sm font-medium p-3 bg-muted rounded-md">
                Section {section.code}
              </div>
            </div>
          )}

          {profile.academic_year && (
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <div className="text-sm font-medium p-3 bg-muted rounded-md">
                {profile.academic_year}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Status</Label>
            <div className={`text-sm font-medium p-3 rounded-md ${profile.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
              {profile.is_active ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
