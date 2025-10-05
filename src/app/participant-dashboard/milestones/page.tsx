"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, CheckCircle, AlertCircle, Loader2, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from "@/lib/constants";
import { 
  startChunkedUpload, 
  DEFAULT_CHUNK_SIZE,
  shouldUseChunkedUpload, 
  UploadProgressInfo 
} from "@/lib/chunked-upload";

// Define the Milestone type
type Milestone = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status: string;
  requirements: string[];
  submissionCount: number;
  submissionLink?: string | null;
  createdAt: string;
  updatedAt: string;
  hasSubmitted?: boolean; // Track if the current participant has submitted
};

// Define the submission response type
type SubmissionResponse = {
  success: boolean;
  message: string;
  error?: string;
  submission?: any;
};

export default function ParticipantMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressInfo | null>(null);
  const [isUsingChunkedUpload, setIsUsingChunkedUpload] = useState(false);

  // Fetch milestones from API
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch('/api/milestones');
        
        if (!response.ok) {
          throw new Error('Failed to fetch milestones');
        }
        
        const data = await response.json();
        setMilestones(data);
      } catch (err) {
        console.error('Error fetching milestones:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMilestones();
  }, []);

  // Format date to Arabic format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  // Get days remaining until due date
  const getDaysRemaining = (dateString: string) => {
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status badge based on milestone status and days remaining
  const getStatusBadge = (status: string, dueDate: string) => {
    const daysRemaining = getDaysRemaining(dueDate);
    
    if (status === "completed") {
      return (
        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
          <CheckCircle className="h-3 w-3" />
          <span>مكتمل</span>
        </div>
      );
    } else if (status === "overdue") {
      return (
        <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>متأخر</span>
        </div>
      );
    } else if (daysRemaining <= 3) {
      return (
        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs">
          <Clock className="h-3 w-3" />
          <span>قريب ({daysRemaining} أيام)</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
          <Clock className="h-3 w-3" />
          <span>{daysRemaining} أيام متبقية</span>
        </div>
      );
    }
  };

  // Open the submission dialog
  const openSubmissionDialog = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setSelectedFile(null);
    setSubmissionStatus(null);
    setIsDialogOpen(true);
  };

  // Handle file selection with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Reset previous errors and progress
      setSubmissionStatus(null);
      setUploadProgress(null);
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setSubmissionStatus({
          success: false,
          message: `حجم الملف كبير جدًا. الحد الأقصى هو ${MAX_FILE_SIZE_MB} ميجابايت. سيتم استخدام التحميل المجزأ.`
        });
        setIsUsingChunkedUpload(true);
      } else {
        setIsUsingChunkedUpload(false);
      }
      
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type) && file.type !== "") {
        setSubmissionStatus({
          success: false,
          message: "نوع الملف غير مدعوم"
        });
        return; // Don't set the file if type is invalid
      }
      
      setSelectedFile(file);
    }
  };

  // Submit a milestone (with support for chunked uploads)
  const submitMilestone = async () => {
    if (!selectedMilestone || !selectedFile) {
      setSubmissionStatus({
        success: false,
        message: "يرجى اختيار ملف للتسليم"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);
    setUploadProgress(null);

    try {
      let result: SubmissionResponse;

      // Determine if we need to use chunked upload
      if (shouldUseChunkedUpload(selectedFile) || isUsingChunkedUpload) {
        // Use chunked upload for large files
        result = await handleChunkedUpload();
      } else {
        // Use regular upload for small files
        result = await handleRegularUpload();
      }

      if (result.success) {
        setSubmissionStatus({
          success: true,
          message: result.message || "تم تسليم المشروع بنجاح"
        });

        // Update the milestone status in the UI
        setMilestones(milestones.map(m => 
          m.id === selectedMilestone.id 
            ? { ...m, hasSubmitted: true, submissionCount: m.submissionCount + 1 } 
            : m
        ));

        // Reset upload progress
        setUploadProgress(null);

        // Close the dialog after a delay
        setTimeout(() => {
          setIsDialogOpen(false);
        }, 2000);
      } else {
        // Handle specific error for duplicate submission
        const errorMessage = result.error || "حدث خطأ أثناء تسليم المشروع";
        
        // If this is a duplicate submission error, update the UI to reflect that
        if (errorMessage.includes("لقد قمت بتسليم هذا المشروع بالفعل")) {
          // Update the milestone status in the UI to prevent further attempts
          setMilestones(milestones.map(m => 
            m.id === selectedMilestone.id 
              ? { ...m, hasSubmitted: true } 
              : m
          ));
        }
        
        setSubmissionStatus({
          success: false,
          message: errorMessage
        });
      }
    } catch (err) {
      console.error("Error submitting milestone:", err);
      setSubmissionStatus({
        success: false,
        message: "حدث خطأ أثناء الاتصال بالخادم"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle regular (non-chunked) upload
  const handleRegularUpload = async (): Promise<SubmissionResponse> => {
    const formData = new FormData();
    formData.append("milestoneId", selectedMilestone!.id);
    formData.append("file", selectedFile!);

    const response = await fetch("/api/participant/submit-milestone", {
      method: "POST",
      body: formData,
    });

    // Handle 413 error specifically
    if (response.status === 413) {
      setIsUsingChunkedUpload(true);
      setSubmissionStatus({
        success: false,
        message: "الملف كبير جداً، جاري التحويل إلى وضع التحميل المجزأ..."
      });
      
      // Retry with chunked upload
      return handleChunkedUpload();
    }

    return await response.json();
  };

  // Handle chunked upload
  const handleChunkedUpload = async (): Promise<SubmissionResponse> => {
    return new Promise((resolve, reject) => {
      if (!selectedFile || !selectedMilestone) {
        reject(new Error("ملف أو مرحلة غير محددة"));
        return;
      }

      // Additional data to include with each chunk
      const additionalData = {
        milestoneId: selectedMilestone.id
      };

      startChunkedUpload({
        file: selectedFile,
        endpoint: "/api/upload-chunk",
        additionalData,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
        onError: (error) => {
          console.error("Chunked upload error:", error);
          reject(error);
        },
        onComplete: (result) => {
          resolve({
            success: true,
            message: "تم تسليم المشروع بنجاح",
            ...result
          });
        },
        // Smaller chunk size for potentially slower connections
        chunkSize: DEFAULT_CHUNK_SIZE,
        retryAttempts: 3
      }).catch(error => {
        reject(error);
      });
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">التسليمات</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {milestones.length > 0 ? (
            milestones.map((milestone) => (
              <Card key={milestone.id} className="overflow-hidden border-r-4 border-r-primary">
                <div className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="text-xl font-semibold">{milestone.title}</h3>
                        {getStatusBadge(milestone.status, milestone.dueDate)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{milestone.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm mt-2 sm:mt-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>الموعد النهائي: {formatDate(milestone.dueDate)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3">المتطلبات:</h4>
                    <ul className="text-sm space-y-2 bg-muted p-4 rounded-lg">
                      {milestone.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 flex justify-center sm:justify-end">
                    {milestone.hasSubmitted || milestone.status === "completed" ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>تم التسليم</span>
                      </div>
                    ) : (
                      <Button 
                        className="gap-2 w-full sm:w-auto"
                        onClick={() => openSubmissionDialog(milestone)}
                      >
                        <FileText className="h-4 w-4" />
                        تسليم المشروع
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                لا توجد تسليمات مجدولة حالياً.
              </p>
            </div>
          )}
        </div>
      )}

      {/* File Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تسليم المشروع</DialogTitle>
            <DialogDescription>
              {selectedMilestone && (
                <span>تسليم مشروع لـ: {selectedMilestone.title}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">اختر ملف المشروع</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                الملفات المدعومة: PDF, Word, ZIP, RAR, JPEG, PNG (الحد الأقصى: 25 ميجابايت)
              </p>
            </div>

            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm flex-1 truncate">
                  {selectedFile.name} 
                  <span className="text-xs text-muted-foreground">
                    ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null);
                    setUploadProgress(null);
                    setIsUsingChunkedUpload(false);
                  }}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* File upload progress indicator */}
            {uploadProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>جاري تحميل الملف...</span>
                  <span>{uploadProgress.percentComplete}%</span>
                </div>
                <Progress value={uploadProgress.percentComplete} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  قطعة {uploadProgress.uploadedChunks} من {uploadProgress.totalChunks}
                </p>
              </div>
            )}

            {submissionStatus && (
              <div className={`p-3 rounded-md ${
                submissionStatus.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                <p className="text-sm">{submissionStatus.message}</p>
              </div>
            )}

            {isUsingChunkedUpload && !uploadProgress && !submissionStatus?.success && (
              <div className="p-3 bg-blue-50 text-blue-600 rounded-md">
                <p className="text-sm">
                  سيتم استخدام التحميل المجزأ لهذا الملف نظرًا لحجمه الكبير.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex-col sm:flex-row sm:justify-start gap-2">
            <Button
              type="submit"
              onClick={submitMilestone}
              disabled={!selectedFile || isSubmitting}
              className="gap-2 w-full sm:w-auto order-1 sm:order-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري التسليم...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  تأكيد التسليم
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
