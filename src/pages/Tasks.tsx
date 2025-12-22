import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dbService } from "@/services/database";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
    SelectGroup,
    SelectLabel
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
import { CheckSquare, Calendar, AlertCircle, Plus, ArrowRight, MoreVertical, Edit, Trash2, Users, User } from "lucide-react";
import { format } from "date-fns";

export default function Tasks() {
    const { profile } = useAuth();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Assignment Data
    const [students, setStudents] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [taskToDelete, setTaskToDelete] = useState<any>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "Medium",
        due_date: "",
        assigned_to: "all"
    });

    useEffect(() => {
        fetchTasks();
        if (profile?.role === 'admin' || profile?.role === 'team_lead') {
            fetchAssignmentData();
        }
    }, [profile]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const data = await dbService.getAll("tasks");
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignmentData = async () => {
        try {
            const [studentsData, teamsData] = await Promise.all([
                dbService.query("profiles", { where: [["role", "==", "student"]] }),
                dbService.getAll("teams")
            ]);
            setStudents(studentsData);
            setTeams(teamsData);
        } catch (error) {
            console.error("Error fetching assignment data:", error);
        }
    };

    const handleOpenAddModal = () => {
        setEditingTask(null);
        setFormData({
            title: "",
            description: "",
            difficulty: "Medium",
            due_date: "",
            assigned_to: "all"
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (task: any) => {
        setEditingTask(task);
        setFormData({
            title: task.title || "",
            description: task.description || "",
            difficulty: task.difficulty || "Medium",
            due_date: task.due_date || "",
            assigned_to: task.assigned_to || "all"
        });
        setIsModalOpen(true);
    };

    const handleOpenDeleteAlert = (task: any) => {
        setTaskToDelete(task);
        setIsDeleteAlertOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingTask) {
                await dbService.update("tasks", editingTask.id, {
                    ...formData,
                    updated_at: new Date().toISOString()
                });
                toast.success("Task updated successfully");
            } else {
                await dbService.create("tasks", {
                    ...formData,
                    created_by: profile?.id,
                    status: "not_started",
                    created_at: new Date().toISOString()
                });
                toast.success("Task created successfully");
            }

            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error("Error saving task:", error);
            toast.error(editingTask ? "Failed to update task" : "Failed to add task");
        }
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            await dbService.delete("tasks", taskToDelete.id);
            toast.success("Task deleted successfully");
            setIsDeleteAlertOpen(false);
            setTaskToDelete(null);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task");
        }
    };

    const handleStatusUpdate = async (taskId: string, newStatus: string) => {
        try {
            await dbService.update("tasks", taskId, { status: newStatus });
            toast.success("Task status updated");
            fetchTasks();
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task");
        }
    };

    const difficultyColors: Record<string, string> = {
        Easy: "bg-green-100 text-green-800",
        Medium: "bg-yellow-100 text-yellow-800",
        Hard: "bg-red-100 text-red-800",
    };

    const statusColors: Record<string, string> = {
        not_started: "bg-slate-100 text-slate-800",
        in_progress: "bg-blue-100 text-blue-800",
        completed: "bg-green-100 text-green-800",
    };

    // Filter tasks based on user role and assignment
    const filteredTasks = tasks.filter(task => {
        if (profile?.role === 'admin' || profile?.role === 'team_lead') return true;

        // For students:
        // 1. Assigned to 'all'
        if (task.assigned_to === 'all') return true;

        // 2. Assigned to me specifically
        if (task.assigned_to === profile?.id || task.assigned_to === profile?.user_id) return true;

        // 3. Assigned to my team
        // We need to find if the user is in the team that the task is assigned to
        // This would ideally be done on the backend or with a more efficient lookup
        // For now, we'll assume we can't easily check team membership without fetching all teams
        // or having team_id on profile. 
        // If we fetched teams, we can check:
        const assignedTeam = teams.find(t => t.id === task.assigned_to);
        if (assignedTeam && assignedTeam.members?.includes(profile?.user_id)) return true;

        return false;
    });

    if (loading) {
        return <div className="p-8 text-center">Loading tasks...</div>;
    }

    const canEdit = profile?.role === 'admin' || profile?.role === 'team_lead';

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks & Practice</h1>
                    <p className="text-muted-foreground">
                        Manage assignments, practice plans, and track progress.
                    </p>
                </div>

                {canEdit && (
                    <Button onClick={handleOpenAddModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                        <CheckSquare className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No tasks assigned</h3>
                        <p>You're all caught up! Check back later for new assignments.</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <Card key={task.id} className="flex flex-col relative group">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className={difficultyColors[task.difficulty]}>
                                        {task.difficulty}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={statusColors[task.status]}>
                                            {task.status.replace('_', ' ')}
                                        </Badge>
                                        {canEdit && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleOpenEditModal(task)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleOpenDeleteAlert(task)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                                <CardTitle className="text-lg">{task.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {task.description}
                                </CardDescription>
                                {task.assigned_to !== 'all' && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                        {teams.find(t => t.id === task.assigned_to) ? (
                                            <><Users className="h-3 w-3" /> Assigned to Team</>
                                        ) : (
                                            <><User className="h-3 w-3" /> Assigned to Student</>
                                        )}
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-center text-sm text-muted-foreground mt-2">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Due: {task.due_date ? format(new Date(task.due_date), "PPP") : "No deadline"}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-4 border-t">
                                {task.status !== 'completed' ? (
                                    <Button
                                        className="w-full"
                                        variant={task.status === 'not_started' ? 'default' : 'secondary'}
                                        onClick={() => handleStatusUpdate(task.id, task.status === 'not_started' ? 'in_progress' : 'completed')}
                                    >
                                        {task.status === 'not_started' ? 'Start Task' : 'Mark Complete'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button className="w-full" variant="outline" disabled>
                                        Completed
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            {/* Add/Edit Task Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Solve 5 DP Problems"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Focus on 1D DP..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Difficulty</label>
                                <Select
                                    value={formData.difficulty}
                                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Due Date</label>
                                <Input
                                    type="date"
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Assign To</label>
                            <Select
                                value={formData.assigned_to}
                                onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select assignment" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Students</SelectItem>
                                    {teams.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Teams</SelectLabel>
                                            {teams.map(team => (
                                                <SelectItem key={team.id} value={team.id}>
                                                    {team.name || `Team ${team.id.substring(0, 4)}`}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                    {students.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Students</SelectLabel>
                                            {students.map(student => (
                                                <SelectItem key={student.id} value={student.id}>
                                                    {student.fullName}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full" onClick={handleSubmit}>
                            {editingTask ? 'Update Task' : 'Assign Task'}
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
                            This action cannot be undone. This will permanently delete the task
                            "{taskToDelete?.title}" and remove it from all assignments.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
