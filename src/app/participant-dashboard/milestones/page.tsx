"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";
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

export default function ParticipantMilestonesPage() {
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

  // Submit a milestone
  const submitMilestone = (id: string) => {
    // This would be implemented with an API call in a real application
    alert(`سيتم تنفيذ تسليم المشروع للتسليم رقم ${id}`);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">التسليمات</h1>
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
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{milestone.title}</h3>
                        {getStatusBadge(milestone.status, milestone.dueDate)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{milestone.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
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
                  
                  <div className="mt-6 flex justify-end">
                    {milestone.status === "completed" ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>تم التسليم</span>
                      </div>
                    ) : (
                      <Button 
                        className="gap-2"
                        onClick={() => submitMilestone(milestone.id)}
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
    </div>
  );
}
