"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Flag } from "lucide-react";
import Link from "next/link";

export default function MilestonesPage() {
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
        <p className="text-muted-foreground">
          لا توجد تسليمات مجدولة حالياً. قم بإنشاء تسليم جديد للبدء.
        </p>
      </div>
    </div>
  );
}
