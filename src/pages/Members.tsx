import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dbService } from "@/services/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { UserPlus, Search, Filter, MoreHorizontal, Mail, Shield, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Members() {
    const { profile } = useAuth();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [memberToDelete, setMemberToDelete] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        role: "student",
        department_id: "",
        year: "",
        reg_no: ""
    });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const data = await dbService.getAll("profiles");
            setMembers(data);
        } catch (error) {
            console.error("Error fetching members:", error);
            toast.error("Failed to load members");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingMember(null);
        setFormData({
            email: "",
            fullName: "",
            role: "student",
            department_id: "",
            year: "",
            reg_no: ""
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (member: any) => {
        setEditingMember(member);
        setFormData({
            email: member.email || "",
            fullName: member.fullName || "",
            role: member.role || "student",
            department_id: member.department_id || "",
            year: member.year || "",
            reg_no: member.reg_no || ""
        });
        setIsModalOpen(true);
    };

    const handleOpenDeleteAlert = (member: any) => {
        setMemberToDelete(member);
        setIsDeleteAlertOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingMember) {
                // Update existing member
                await dbService.update("profiles", editingMember.id, {
                    ...formData,
                    updated_at: new Date().toISOString()
                });
                toast.success("Member updated successfully");
            } else {
                // Create new member
                await dbService.create("profiles", {
                    ...formData,
                    created_at: new Date().toISOString(),
                    status: "active"
                });
                toast.success("Member added successfully");
            }

            setIsModalOpen(false);
            fetchMembers();
        } catch (error) {
            console.error("Error saving member:", error);
            toast.error(editingMember ? "Failed to update member" : "Failed to add member");
        }
    };

    const handleDeleteMember = async () => {
        if (!memberToDelete) return;

        try {
            await dbService.delete("profiles", memberToDelete.id);
            toast.success("Member deleted successfully");
            setIsDeleteAlertOpen(false);
            setMemberToDelete(null);
            fetchMembers();
        } catch (error) {
            console.error("Error deleting member:", error);
            toast.error("Failed to delete member");
        }
    };

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.reg_no?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || member.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getInitials = (name: string) => {
        return name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "??";
    };

    const roleColors: Record<string, string> = {
        student: "bg-blue-100 text-blue-800",
        team_lead: "bg-purple-100 text-purple-800",
        advisor: "bg-green-100 text-green-800",
        hod: "bg-orange-100 text-orange-800",
        admin: "bg-red-100 text-red-800",
    };

    if (loading) {
        return <div className="p-8 text-center">Loading members...</div>;
    }

    const canEdit = profile?.role === 'admin' || profile?.role === 'team_lead';

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Members</h1>
                    <p className="text-muted-foreground">
                        Manage team members, roles, and access permissions.
                    </p>
                </div>

                {canEdit && (
                    <Button onClick={handleOpenAddModal}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Member
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search members..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="team_lead">Team Lead</SelectItem>
                                    <SelectItem value="advisor">Advisor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Status</TableHead>
                                    {canEdit && <TableHead className="text-right">Actions</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={canEdit ? 5 : 4} className="text-center py-8 text-muted-foreground">
                                            No members found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={member.avatar_url} />
                                                        <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{member.fullName}</div>
                                                        <div className="text-sm text-muted-foreground">{member.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={roleColors[member.role]}>
                                                    {member.role.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{member.department_id || '-'}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {member.year ? `Year ${member.year}` : ''}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    Active
                                                </Badge>
                                            </TableCell>
                                            {canEdit && (
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleOpenEditModal(member)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleOpenDeleteAlert(member)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Member Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingMember ? 'Edit Member' : 'Add New Member'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Name</label>
                            <Input
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@example.com"
                                type="email"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="team_lead">Team Lead</SelectItem>
                                        <SelectItem value="advisor">Advisor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reg No</label>
                                <Input
                                    value={formData.reg_no}
                                    onChange={(e) => setFormData({ ...formData, reg_no: e.target.value })}
                                    placeholder="REG123"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Department</label>
                                <Input
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                    placeholder="CSE"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Year</label>
                                <Input
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    placeholder="3"
                                    type="number"
                                />
                            </div>
                        </div>
                        <Button className="w-full" onClick={handleSubmit}>
                            {editingMember ? 'Update Member' : 'Create Member'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the member
                            "{memberToDelete?.fullName}" and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
