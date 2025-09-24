import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Building2, Settings, Plus, Edit2, Trash2, UserCheck, AlertTriangle } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
  hod_id?: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  roll_number?: string;
  phone?: string;
  department_id?: string;
  section_id?: string;
  role: 'student' | 'team_lead' | 'advisor' | 'hod' | 'admin';
  academic_year?: string;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export default function Admin() {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [newDepartment, setNewDepartment] = useState({ name: '', code: '' });
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);

  // Check if user is admin
  if (!loading && (!user || profile?.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadAdminData();
    }
  }, [profile]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load departments
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      
      if (deptError) throw deptError;
      setDepartments(deptData || []);

      // Load users
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (userError) throw userError;
      setUsers(userData || []);

      // Load system settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('system_settings')
        .select('*')
        .order('setting_key');
      
      if (settingsError) throw settingsError;
      setSettings(settingsData || []);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading admin data",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDepartment.name || !newDepartment.code) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in both name and code",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('departments')
        .insert([newDepartment])
        .select()
        .single();

      if (error) throw error;

      setDepartments([...departments, data]);
      setNewDepartment({ name: '', code: '' });
      
      toast({
        title: "Department created",
        description: `${data.name} has been added successfully`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating department",
        description: error.message,
      });
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDepartment) return;

    try {
      const { data, error } = await supabase
        .from('departments')
        .update({ 
          name: editingDepartment.name, 
          code: editingDepartment.code 
        })
        .eq('id', editingDepartment.id)
        .select()
        .single();

      if (error) throw error;

      setDepartments(departments.map(dept => 
        dept.id === data.id ? data : dept
      ));
      setEditingDepartment(null);
      
      toast({
        title: "Department updated",
        description: "Changes saved successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating department",
        description: error.message,
      });
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;

    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDepartments(departments.filter(dept => dept.id !== id));
      
      toast({
        title: "Department deleted",
        description: "Department has been removed successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting department",
        description: error.message,
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: editingUser.full_name,
          role: editingUser.role,
          department_id: editingUser.department_id,
          section_id: editingUser.section_id,
          is_active: editingUser.is_active,
        })
        .eq('id', editingUser.id)
        .select()
        .single();

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === data.id ? data : user
      ));
      setEditingUser(null);
      
      toast({
        title: "User updated",
        description: "Changes saved successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating user",
        description: error.message,
      });
    }
  };

  const handleUpdateSetting = async () => {
    if (!editingSetting) return;

    try {
      const { data, error } = await supabase
        .from('system_settings')
        .update({
          setting_value: editingSetting.setting_value,
          description: editingSetting.description,
          is_public: editingSetting.is_public,
        })
        .eq('id', editingSetting.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(settings.map(setting => 
        setting.id === data.id ? data : setting
      ));
      setEditingSetting(null);
      
      toast({
        title: "Setting updated",
        description: "Configuration saved successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating setting",
        description: error.message,
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">MVIT Admin Panel</h1>
            <Badge variant="secondary" className="ml-auto">
              {profile?.email}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="departments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Management</CardTitle>
                <CardDescription>
                  Manage college departments and assign HODs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Department name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  />
                  <Input
                    placeholder="Code (e.g., CSE)"
                    value={newDepartment.code}
                    onChange={(e) => setNewDepartment({...newDepartment, code: e.target.value})}
                  />
                  <Button onClick={handleCreateDepartment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>HOD</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departments.map((dept) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{dept.code}</Badge>
                        </TableCell>
                        <TableCell>
                          {dept.hod_id ? (
                            <Badge variant="secondary">Assigned</Badge>
                          ) : (
                            <Badge variant="outline">Not assigned</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(dept.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingDepartment(dept)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDepartment(dept.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {departments.find(d => d.id === user.department_id)?.code || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'destructive'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser(user)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure platform behavior and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{setting.setting_key}</h4>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Current: {JSON.stringify(setting.setting_value)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={setting.is_public ? 'default' : 'secondary'}>
                          {setting.is_public ? 'Public' : 'Private'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSetting(setting)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>
                  Monitor admin actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Activity logging will be available in the next update</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={!!editingDepartment} onOpenChange={() => setEditingDepartment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information
            </DialogDescription>
          </DialogHeader>
          {editingDepartment && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="dept-name">Department Name</Label>
                <Input
                  id="dept-name"
                  value={editingDepartment.name}
                  onChange={(e) => setEditingDepartment({
                    ...editingDepartment,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="dept-code">Department Code</Label>
                <Input
                  id="dept-code"
                  value={editingDepartment.code}
                  onChange={(e) => setEditingDepartment({
                    ...editingDepartment,
                    code: e.target.value
                  })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateDepartment}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingDepartment(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user profile and permissions
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-name">Full Name</Label>
                <Input
                  id="user-name"
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    full_name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="user-role">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value: any) => setEditingUser({
                    ...editingUser,
                    role: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="team_lead">Team Lead</SelectItem>
                    <SelectItem value="advisor">Advisor</SelectItem>
                    <SelectItem value="hod">HOD</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="user-department">Department</Label>
                <Select
                  value={editingUser.department_id || ''}
                  onValueChange={(value) => setEditingUser({
                    ...editingUser,
                    department_id: value
                  })}
                >
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="user-active"
                  checked={editingUser.is_active}
                  onCheckedChange={(checked) => setEditingUser({
                    ...editingUser,
                    is_active: checked
                  })}
                />
                <Label htmlFor="user-active">Active User</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateUser}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Setting Dialog */}
      <Dialog open={!!editingSetting} onOpenChange={() => setEditingSetting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription>
              Update system configuration
            </DialogDescription>
          </DialogHeader>
          {editingSetting && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="setting-key">Setting Key</Label>
                <Input
                  id="setting-key"
                  value={editingSetting.setting_key}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="setting-value">Value</Label>
                <Textarea
                  id="setting-value"
                  value={JSON.stringify(editingSetting.setting_value, null, 2)}
                  onChange={(e) => {
                    try {
                      const value = JSON.parse(e.target.value);
                      setEditingSetting({
                        ...editingSetting,
                        setting_value: value
                      });
                    } catch {
                      // Invalid JSON, keep as string
                      setEditingSetting({
                        ...editingSetting,
                        setting_value: e.target.value
                      });
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="setting-desc">Description</Label>
                <Input
                  id="setting-desc"
                  value={editingSetting.description || ''}
                  onChange={(e) => setEditingSetting({
                    ...editingSetting,
                    description: e.target.value
                  })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="setting-public"
                  checked={editingSetting.is_public}
                  onCheckedChange={(checked) => setEditingSetting({
                    ...editingSetting,
                    is_public: checked
                  })}
                />
                <Label htmlFor="setting-public">Public Setting</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateSetting}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditingSetting(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
