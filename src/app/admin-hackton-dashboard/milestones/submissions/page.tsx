"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Download, FileText, Flag, User } from "lucide-react";
import Link from "next/link";

// Mock data for milestone submissions
const milestoneSubmissions = [
  {
    id: "1",
    milestoneTitle: "تسليم النموذج الأولي",
    teamName: "فريق الابتكار",
    submittedBy: "أحمد محمد",
    submittedAt: "2025-07-25T14:30:00",
    status: "pending",
    attachments: [
      { name: "presentation.pdf", size: "2.4 MB" },
      { name: "prototype-demo.mp4", size: "15.8 MB" },
    ],
    notes: "تم تقديم النموذج الأولي مع عرض تقديمي يشرح الفكرة وآلية العمل.",
  },
  {
    id: "2",
    milestoneTitle: "تقرير تقدم المشروع",
    teamName: "فريق التقنية",
    submittedBy: "سارة خالد",
    submittedAt: "2025-07-26T10:15:00",
    status: "reviewed",
    attachments: [
      { name: "progress-report.pdf", size: "1.8 MB" },
      { name: "code-repository.zip", size: "4.2 MB" },
    ],
    notes: "تقرير مفصل عن التقدم المحرز في المشروع مع توثيق للتحديات والحلول.",
  },
];

export default function MilestoneSubmissionsPage() {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">قيد المراجعة</Badge>;
      case "reviewed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">تمت المراجعة</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">مرفوض</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مراجعة التسليمات</h1>
        <Link href="/admin-hackton-dashboard/milestones">
          <Button variant="outline">
            العودة
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {milestoneSubmissions.length > 0 ? (
        <div className="space-y-4">
          {milestoneSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold flex items-center">
                      <Flag className="ml-2 h-5 w-5 text-blue-500" />
                      {submission.milestoneTitle}
                    </h2>
                    
                    <div className="mt-2 flex items-center text-sm text-muted-foreground">
                      <User className="ml-1 h-4 w-4" />
                      <span className="ml-4">الفريق: {submission.teamName}</span>
                      <span>المقدم: {submission.submittedBy}</span>
                    </div>
                    
                    <div className="mt-1 flex items-center text-sm text-muted-foreground">
                      <Calendar className="ml-1 h-4 w-4" />
                      <span>تاريخ التقديم: {formatDate(submission.submittedAt)}</span>
                    </div>
                    
                    <p className="mt-4 text-muted-foreground">{submission.notes}</p>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold mb-2">المرفقات:</h3>
                      <div className="space-y-2">
                        {submission.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <FileText className="ml-2 h-4 w-4 text-blue-500" />
                            <span className="ml-1">{attachment.name}</span>
                            <span className="text-muted-foreground">({attachment.size})</span>
                            <Button variant="ghost" size="sm" className="mr-auto p-0 h-auto">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {getStatusBadge(submission.status)}
                    
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">مراجعة</Button>
                      <Button variant="outline" size="sm">إرسال ملاحظات</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">لا توجد تسليمات للمراجعة</h2>
          <p className="mt-2 text-muted-foreground">ستظهر هنا التسليمات المقدمة من الفرق المشاركة</p>
        </div>
      )}
    </div>
  );
}
