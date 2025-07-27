"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Flag, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useEffect, useState } from "react";

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
};

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Delete a milestone
  const deleteMilestone = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التسليم؟')) {
      return;
    }
    
    try {
      const response = await fetch('/api/admin/milestones', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete milestone');
      }
      
      // Remove the deleted milestone from the state
      setMilestones(milestones.filter(milestone => milestone.id !== id));
      
      alert('تم حذف التسليم بنجاح');
    } catch (err) {
      console.error('Error deleting milestone:', err);
      alert('حدث خطأ أثناء حذف التسليم');
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">التسليمات</h1>
        <Link href="/admin-hackton-dashboard/milestones/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة تسليم جديد
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flag className="h-5 w-5 text-blue-500" />
              التسليمات القادمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              عرض جميع التسليمات المستقبلية المجدولة للمشاركين.
            </p>
            <Link href="/admin-hackton-dashboard/milestones/upcoming">
              <Button variant="outline" className="w-full">عرض التسليمات القادمة</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              إنشاء تسليم جديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              إنشاء تسليم جديد وتحديد التفاصيل والمواعيد النهائية.
            </p>
            <Link href="/admin-hackton-dashboard/milestones/create">
              <Button variant="outline" className="w-full">إنشاء تسليم جديد</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flag className="h-5 w-5 text-yellow-500" />
              مراجعة التسليمات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              عرض ومراجعة التسليمات المقدمة من المشاركين.
            </p>
            <Link href="/admin-hackton-dashboard/milestones/submissions">
              <Button variant="outline" className="w-full">عرض التسليمات المقدمة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">نظرة عامة على التسليمات</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            <p>{error}</p>
          </div>
        ) : milestones.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {milestones.map((milestone) => (
              <Card key={milestone.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>الموعد النهائي: {formatDate(milestone.dueDate)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">المتطلبات:</h4>
                    <ul className="text-sm space-y-1">
                      {milestone.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">التسليمات: </span>
                      <span>{milestone.submissionCount || 0}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => deleteMilestone(milestone.id)}
                      >
                        حذف
                      </Button>
                      <Button variant="outline" size="sm">تعديل</Button>
                      <Button variant="default" size="sm">عرض التفاصيل</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            لا توجد تسليمات مجدولة حالياً. قم بإنشاء تسليم جديد للبدء.
          </p>
        )}
      </div>
    </div>
  );
}
