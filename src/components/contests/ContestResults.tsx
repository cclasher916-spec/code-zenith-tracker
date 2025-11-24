import { useState, useEffect } from "react";
import { dbService } from "@/services/database";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Trophy, Plus, Trash2, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ContestResultsProps {
    contestId: string;
    contestName: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ContestResults({ contestId, contestName, isOpen, onClose }: ContestResultsProps) {
    const { profile } = useAuth();
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);

    // Form state for new result
    const [newResult, setNewResult] = useState({
        user_id: "",
        rank: "",
        score: "",
        problems_solved: ""
    });

    useEffect(() => {
        if (isOpen && contestId) {
            fetchResults();
            fetchUsers();
        }
    }, [isOpen, contestId]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await dbService.query("contest_results", {
                where: [["contest_id", "==", contestId]],
                orderBy: [["rank", "asc"]]
            });

            // Enrich with user data if possible, or just fetch users separately and map
            // For simplicity, we'll fetch users separately and map in render
            setResults(data);
        } catch (error) {
            console.error("Error fetching results:", error);
            // toast.error("Failed to load results");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await dbService.getAll("profiles");
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleAddResult = async () => {
        if (!newResult.user_id || !newResult.rank) {
            toast.error("Please select a user and assign a rank");
            return;
        }

        try {
            await dbService.create("contest_results", {
                ...newResult,
                contest_id: contestId,
                rank: parseInt(newResult.rank),
                score: parseInt(newResult.score) || 0,
                problems_solved: parseInt(newResult.problems_solved) || 0,
                created_at: new Date().toISOString()
            });

            toast.success("Result added successfully");
            fetchResults();
            setNewResult({
                user_id: "",
                rank: "",
                score: "",
                problems_solved: ""
            });
        } catch (error) {
            console.error("Error adding result:", error);
            toast.error("Failed to add result");
        }
    };

    const handleDeleteResult = async (resultId: string) => {
        try {
            await dbService.delete("contest_results", resultId);
            toast.success("Result deleted");
            fetchResults();
        } catch (error) {
            console.error("Error deleting result:", error);
            toast.error("Failed to delete result");
        }
    };

    const getUserName = (userId: string) => {
        const user = users.find(u => u.id === userId || u.user_id === userId);
        return user ? user.full_name : "Unknown User";
    };

    const getUserAvatar = (userId: string) => {
        const user = users.find(u => u.id === userId || u.user_id === userId);
        return user ? user.avatar_url : null;
    };

    const getInitials = (name: string) => {
        return name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "??";
    };

    const canEdit = profile?.role === 'admin' || profile?.role === 'team_lead';

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Results: {contestName}
                    </DialogTitle>
                    <DialogDescription>
                        View and manage performance results for this contest.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {canEdit && (
                        <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                            <h3 className="font-medium text-sm">Add Participant Result</h3>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                <div className="md:col-span-2">
                                    <Select
                                        value={newResult.user_id}
                                        onValueChange={(val) => setNewResult({ ...newResult, user_id: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Student" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users
                                                .filter(u => u.role === 'student')
                                                .map(user => (
                                                    <SelectItem key={user.id} value={user.id}>
                                                        {user.full_name} ({user.reg_no || 'No Reg'})
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Input
                                    placeholder="Rank"
                                    type="number"
                                    value={newResult.rank}
                                    onChange={(e) => setNewResult({ ...newResult, rank: e.target.value })}
                                />
                                <Input
                                    placeholder="Score"
                                    type="number"
                                    value={newResult.score}
                                    onChange={(e) => setNewResult({ ...newResult, score: e.target.value })}
                                />
                                <Button onClick={handleAddResult} size="icon">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Rank</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead className="text-right">Problems</TableHead>
                                    {canEdit && <TableHead className="w-[50px]"></TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={canEdit ? 5 : 4} className="text-center py-4">
                                            Loading results...
                                        </TableCell>
                                    </TableRow>
                                ) : results.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={canEdit ? 5 : 4} className="text-center py-8 text-muted-foreground">
                                            No results recorded yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    results.map((result) => (
                                        <TableRow key={result.id}>
                                            <TableCell className="font-medium">
                                                <div className={`
                                                    flex items-center justify-center w-8 h-8 rounded-full font-bold
                                                    ${result.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                                        result.rank === 2 ? 'bg-slate-100 text-slate-700' :
                                                            result.rank === 3 ? 'bg-orange-100 text-orange-700' : ''}
                                                `}>
                                                    {result.rank}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={getUserAvatar(result.user_id)} />
                                                        <AvatarFallback>{getInitials(getUserName(result.user_id))}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{getUserName(result.user_id)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{result.score}</TableCell>
                                            <TableCell className="text-right">{result.problems_solved || '-'}</TableCell>
                                            {canEdit && (
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-700"
                                                        onClick={() => handleDeleteResult(result.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
