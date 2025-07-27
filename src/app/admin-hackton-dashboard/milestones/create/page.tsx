"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

export default function CreateMilestonePage() {
  const [milestone, setMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    requirements: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be implemented later to save the milestone
    console.log("Milestone data:", milestone);
    // For now, just show an alert
    alert("تم إنشاء التسليم بنجاح!");
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">إنشاء تسليم جديد</h1>
        <Link href="/admin-hackton-dashboard/milestones">
          <Button variant="outline">
            العودة
            <ArrowRight className="mr-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان التسليم</Label>
              <Input
                id="title"
                value={milestone.title}
                onChange={(e) => setMilestone({ ...milestone, title: e.target.value })}
                placeholder="مثال: تسليم النموذج الأولي"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">وصف التسليم</Label>
              <Textarea
                id="description"
                value={milestone.description}
                onChange={(e) => setMilestone({ ...milestone, description: e.target.value })}
                placeholder="اشرح ما هو مطلوب من المشاركين في هذا التسليم"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">الموعد النهائي</Label>
              <div className="flex items-center">
                <Calendar className="ml-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={milestone.dueDate}
                  onChange={(e) => setMilestone({ ...milestone, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">متطلبات التسليم</Label>
              <Textarea
                id="requirements"
                value={milestone.requirements}
                onChange={(e) => setMilestone({ ...milestone, requirements: e.target.value })}
                placeholder="حدد المتطلبات التفصيلية والمعايير التي سيتم تقييم التسليم بناءً عليها"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">إنشاء التسليم</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
