import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dbService } from "@/services/database";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Calendar, Trophy, ExternalLink, Plus, Clock, CheckCircle2, MoreVertical, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { ContestResults } from "@/components/contests/ContestResults";

export default function Contests() {
    const { profile } = useAuth();
    const [contests, setContests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [editingContest, setEditingContest] = useState<any>(null);
    const [contestToDelete, setContestToDelete] = useState<any>(null);

    // Results Modal State
    const [selectedContest, setSelectedContest] = useState<any>(null);
    const [isResultsOpen, setIsResultsOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        platform: "Codeforces",
        date: "",
        link: "",
        type: "External"
    });

    useEffect(() => {
        fetchContests();
    }, []);

    const fetchContests = async () => {
        try {
            setLoading(true);
            const data = await dbService.getAll("contests");
            setContests(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } catch (error) {
            console.error("Error fetching contests:", error);
            toast.error("Failed to load contests");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingContest(null);
        setFormData({
            name: "",
            platform: "Codeforces",
            date: "",
            link: "",
            type: "External"
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (contest: any) => {
        setEditingContest(contest);
        setFormData({
            name: contest.name || "",
            platform: contest.platform || "Codeforces",
            date: contest.date || "",
            link: contest.link || "",
            type: contest.type || "External"
        });
        setIsModalOpen(true);
    };

    const handleOpenDeleteAlert = (contest: any) => {
        setContestToDelete(contest);
        setIsDeleteAlertOpen(true);
    };

    const handleViewResults = (contest: any) => {
        setSelectedContest(contest);
        setIsResultsOpen(true);
    };

    const handleSubmit = async () => {
        try {
            if (editingContest) {
                await dbService.update("contests", editingContest.id, {
                    ...formData,
                    updated_at: new Date().toISOString()
                });
                toast.success("Contest updated successfully");
            } else {
                await dbService.create("contests", {
                    ...formData,
                    created_by: profile?.id,
                    status: "upcoming",
                    created_at: new Date().toISOString()
                });
                toast.success("Contest added successfully");
            }

            setIsModalOpen(false);
            fetchContests();
        } catch (error) {
            console.error("Error saving contest:", error);
            toast.error(editingContest ? "Failed to update contest" : "Failed to add contest");
        }
    };

    const handleDeleteContest = async () => {
        if (!contestToDelete) return;

        try {
            await dbService.delete("contests", contestToDelete.id);
            toast.success("Contest deleted successfully");
            setIsDeleteAlertOpen(false);
            setContestToDelete(null);
            fetchContests();
        } catch (error) {
            console.error("Error deleting contest:", error);
            toast.error("Failed to delete contest");
        }
    };

    const platformColors: Record<string, string> = {
        Codeforces: "bg-red-100 text-red-800",
        CodeChef: "bg-orange-100 text-orange-800",
        LeetCode: "bg-yellow-100 text-yellow-800",
        AtCoder: "bg-slate-100 text-slate-800",
        HackerRank: "bg-green-100 text-green-800",
    };

    if (loading) {
        return <div className="p-8 text-center">Loading contests...</div>;
    }

    const upcomingContests = contests.filter(c => new Date(c.date) > new Date());
    const pastContests = contests.filter(c => new Date(c.date) <= new Date()).reverse();
    const canEdit = profile?.role === 'admin' || profile?.role === 'team_lead';

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contests</h1>
                    <p className="text-muted-foreground">
                        Track upcoming coding contests and view past results.
                    </p>
                </div>

                {canEdit && (
                    <Button onClick={handleOpenAddModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Contest
                    </Button>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Upcoming Contests
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingContests.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                                No upcoming contests scheduled.
                            </div>
                        ) : (
                            upcomingContests.map((contest) => (
                                <Card key={contest.id} className="hover:shadow-md transition-shadow relative group">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className={platformColors[contest.platform]}>
                                                {contest.platform}
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{contest.type}</Badge>
                                                {canEdit && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleOpenEditModal(contest)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleOpenDeleteAlert(contest)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </div>
                                        <CardTitle className="mt-2 text-lg">{contest.name}</CardTitle>
                                        <CardDescription>
                                            {format(new Date(contest.date), "PPP p")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-sm text-muted-foreground">
                                                {/* Placeholder for participant count */}
                                                0 participants
                                            </div>
                                            <Button size="sm" variant="outline" asChild>
                                                <a href={contest.link} target="_blank" rel="noopener noreferrer">
                                                    View <ExternalLink className="ml-2 h-3 w-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        Past Contests
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pastContests.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                                No past contests found.
                            </div>
                        ) : (
                            pastContests.map((contest) => (
                                <Card key={contest.id} className="opacity-80 hover:opacity-100 transition-opacity relative">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                                {contest.platform}
                                            </Badge>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">Completed</Badge>
                                                {canEdit && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleOpenEditModal(contest)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleOpenDeleteAlert(contest)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </div>
                                        <CardTitle className="mt-2 text-lg">{contest.name}</CardTitle>
                                        <CardDescription>
                                            {format(new Date(contest.date), "PPP")}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="w-full mt-2"
                                            onClick={() => handleViewResults(contest)}
                                        >
                                            View Results
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Contest Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingContest ? 'Edit Contest' : 'Add New Contest'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contest Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Codeforces Round #900"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Platform</label>
                                <Select
                                    value={formData.platform}
                                    onValueChange={(value) => setFormData({ ...formData, platform: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Codeforces">Codeforces</SelectItem>
                                        <SelectItem value="CodeChef">CodeChef</SelectItem>
                                        <SelectItem value="LeetCode">LeetCode</SelectItem>
                                        <SelectItem value="AtCoder">AtCoder</SelectItem>
                                        <SelectItem value="HackerRank">HackerRank</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="External">External</SelectItem>
                                        <SelectItem value="Internal">Internal Mock</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date & Time</label>
                            <Input
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link</label>
                            <Input
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                        <Button className="w-full" onClick={handleSubmit}>
                            {editingContest ? 'Update Contest' : 'Create Contest'}
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
                            This action cannot be undone. This will permanently delete the contest
                            "{contestToDelete?.name}" and remove it from the schedule.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteContest} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Contest Results Modal */}
            <ContestResults
                contestId={selectedContest?.id}
                contestName={selectedContest?.name}
                isOpen={isResultsOpen}
                onClose={() => setIsResultsOpen(false)}
            />
        </div>
    );
}
