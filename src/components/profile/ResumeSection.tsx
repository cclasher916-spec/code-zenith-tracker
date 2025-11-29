import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Download, Edit, Sparkles, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { storageService } from "@/services/storage";
import { dbService } from "@/services/database";

export function ResumeSection() {
    const { profile, refreshProfile } = useAuth();
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [optimizing, setOptimizing] = useState(false);

    // Mock resume data if not in profile yet
    const resumeUrl = (profile as any)?.resumeUrl;
    const resumeUpdatedAt = (profile as any)?.resumeUpdatedAt;

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile || !event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];

        // Validate file type (PDF/DOCX)
        if (!file.type.match('application/pdf') && !file.type.match('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
            toast({
                variant: "destructive",
                title: "Invalid File",
                description: "Please upload a PDF or DOCX file.",
            });
            return;
        }

        // Validate size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "File Too Large",
                description: "Please upload a file smaller than 5MB.",
            });
            return;
        }

        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const filePath = `resumes/${profile.uid}/${Date.now()}.${fileExt}`;

            const downloadURL = await storageService.uploadFile(filePath, file);

            await dbService.update('profiles', profile.id, {
                resumeUrl: downloadURL,
                resumeUpdatedAt: new Date().toISOString()
            });

            await refreshProfile();

            toast({
                title: "Resume Uploaded",
                description: "Your resume has been successfully uploaded.",
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: "Failed to upload resume.",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleAIOptimize = () => {
        setOptimizing(true);
        // Simulate AI optimization
        setTimeout(() => {
            setOptimizing(false);
            toast({
                title: "AI Optimization Complete",
                description: "We've generated some suggestions for your resume. Check your email.",
            });
        }, 2000);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Resume
                        </CardTitle>
                        <CardDescription>Manage your professional resume and CV</CardDescription>
                    </div>
                    {resumeUrl && (
                        <div className="text-sm text-muted-foreground">
                            Last updated: {new Date(resumeUpdatedAt).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {resumeUrl ? (
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="font-medium">Current Resume</p>
                                <p className="text-xs text-muted-foreground">PDF Document</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            <Button variant="outline" size="sm" asChild>
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a href={resumeUrl} download>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleAIOptimize} disabled={optimizing}>
                                <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                                {optimizing ? "Optimizing..." : "AI Optimize"}
                            </Button>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="resume-replace"
                                    className="hidden"
                                    accept=".pdf,.docx"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <Button variant="outline" size="sm" asChild disabled={uploading}>
                                    <label htmlFor="resume-replace" className="cursor-pointer">
                                        <Upload className="w-4 h-4 mr-2" />
                                        {uploading ? "Uploading..." : "Replace"}
                                    </label>
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4 hover:bg-muted/50 transition-colors">
                        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium">Upload your Resume</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Drag and drop or click to upload (PDF, DOCX up to 5MB)
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <input
                                type="file"
                                id="resume-upload"
                                className="hidden"
                                accept=".pdf,.docx"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                            <Button disabled={uploading} asChild>
                                <label htmlFor="resume-upload" className="cursor-pointer">
                                    {uploading ? "Uploading..." : "Select File"}
                                </label>
                            </Button>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg flex gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">AI Resume Optimization</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                            Our AI analyzes your resume against job descriptions to suggest improvements and increase your chances of getting shortlisted.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
