import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, GraduationCap, Trash2, Edit } from "lucide-react";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_year: number;
  end_year: number | null;
  percentage_cgpa: number | null;
  achievements: string | null;
}

export function EducationSection() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [educations, setEducations] = useState<Education[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    field: '',
    start_year: new Date().getFullYear(),
    end_year: new Date().getFullYear() + 4,
    percentage_cgpa: '',
    achievements: '',
  });

  useEffect(() => {
    loadEducations();
  }, [profile]);

  const loadEducations = async () => {
    if (!profile) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', profile.user_id)
        .order('start_year', { ascending: false });

      if (error) throw error;
      setEducations(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    if (!formData.institution || !formData.degree || !formData.field) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const payload = {
        user_id: profile.user_id,
        ...formData,
        percentage_cgpa: formData.percentage_cgpa ? parseFloat(formData.percentage_cgpa) : null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('education')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('education')
          .insert(payload);
        if (error) throw error;
      }

      await loadEducations();
      setDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: `Education ${editingId ? 'updated' : 'added'} successfully.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadEducations();
      toast({
        title: "Deleted",
        description: "Education entry removed successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      start_year: new Date().getFullYear(),
      end_year: new Date().getFullYear() + 4,
      percentage_cgpa: '',
      achievements: '',
    });
    setEditingId(null);
  };

  const openEditDialog = (edu: Education) => {
    setEditingId(edu.id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      start_year: edu.start_year,
      end_year: edu.end_year || new Date().getFullYear(),
      percentage_cgpa: edu.percentage_cgpa?.toString() || '',
      achievements: edu.achievements || '',
    });
    setDialogOpen(true);
  };

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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Education</CardTitle>
            <CardDescription>Your academic background</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit' : 'Add'} Education</DialogTitle>
                <DialogDescription>Fill in your educational details</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="School/College/University name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Degree *</Label>
                    <Input
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="B.Tech, M.Tech, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study *</Label>
                    <Input
                      value={formData.field}
                      onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                      placeholder="Computer Science, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Start Year *</Label>
                    <Input
                      type="number"
                      value={formData.start_year}
                      onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Year</Label>
                    <Input
                      type="number"
                      value={formData.end_year}
                      onChange={(e) => setFormData({ ...formData, end_year: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage/CGPA</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.percentage_cgpa}
                      onChange={(e) => setFormData({ ...formData, percentage_cgpa: e.target.value })}
                      placeholder="8.5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Achievements</Label>
                  <Textarea
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    placeholder="Awards, honors, notable projects..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {educations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No education added yet</p>
          </div>
        ) : (
          educations.map((edu) => (
            <div key={edu.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{edu.degree} in {edu.field}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(edu)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(edu.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {edu.start_year} - {edu.end_year || 'Present'}
                {edu.percentage_cgpa && ` • CGPA: ${edu.percentage_cgpa}`}
              </p>
              {edu.achievements && (
                <p className="text-sm mt-2">{edu.achievements}</p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
