"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserCheck,
  Trophy,
  Calendar,
  FileText,
  TrendingUp,
  Bell,
  Award,
} from "lucide-react";
import { addToast } from "@/components/admin/admin-toaster";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    addToast(`تم التبديل إلى تبويب ${value === "overview" ? "النظرة العامة" : "الإحصائيات"}`, "info");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" onValueChange={handleTabChange}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overview">النظرة العامة</TabsTrigger>
          <TabsTrigger value="statistics">الإحصائيات</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي المشاركين
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">152</div>
                <p className="text-xs text-muted-foreground">
                  +12% من الأسبوع الماضي
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  عدد الفرق
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">
                  +4% من الأسبوع الماضي
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  عدد الحكام
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 من الأسبوع الماضي
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  عدد الموجهين
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  نفس العدد من الأسبوع الماضي
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>الفعاليات القادمة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full ml-4">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">ورشة عمل تطوير الواجهات</h4>
                      <p className="text-xs text-muted-foreground">
                        22 يوليو، 2025 - 10:00 صباحاً
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full ml-4">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">جلسة إرشادية للفرق</h4>
                      <p className="text-xs text-muted-foreground">
                        24 يوليو، 2025 - 2:00 مساءً
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full ml-4">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">عرض المشاريع الأولي</h4>
                      <p className="text-xs text-muted-foreground">
                        26 يوليو، 2025 - 11:00 صباحاً
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full ml-4">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">العرض النهائي والتقييم</h4>
                      <p className="text-xs text-muted-foreground">
                        30 يوليو، 2025 - 9:00 صباحاً
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>آخر الإشعارات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full ml-4">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">تم تسجيل فريق جديد</h4>
                      <p className="text-xs text-muted-foreground">
                        منذ 2 ساعة
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full ml-4">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">تم تقديم مشروع جديد</h4>
                      <p className="text-xs text-muted-foreground">
                        منذ 5 ساعات
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-full ml-4">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">تم تعيين حكم جديد</h4>
                      <p className="text-xs text-muted-foreground">
                        منذ يوم واحد
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-full ml-4">
                      <Calendar className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">تم تعديل موعد ورشة العمل</h4>
                      <p className="text-xs text-muted-foreground">
                        منذ يومين
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>المشاريع المقدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full ml-4">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">منصة تعليمية ذكية</h4>
                      <p className="text-xs text-muted-foreground">
                        فريق ألفا - تم التقديم منذ 3 أيام
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    <span className="text-green-600">4.8</span>/5
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full ml-4">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">تطبيق صحة رقمية</h4>
                      <p className="text-xs text-muted-foreground">
                        فريق بيتا - تم التقديم منذ 2 أيام
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    <span className="text-green-600">4.5</span>/5
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full ml-4">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">حلول ذكاء اصطناعي</h4>
                      <p className="text-xs text-muted-foreground">
                        فريق جاما - تم التقديم منذ 1 يوم
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    <span className="text-green-600">4.7</span>/5
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full ml-4">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">منصة تجارة إلكترونية</h4>
                      <p className="text-xs text-muted-foreground">
                        فريق دلتا - تم التقديم منذ 5 ساعات
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    <span className="text-yellow-600">3.9</span>/5
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات المشاركين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      هنا سيتم عرض رسم بياني لإحصائيات المشاركين
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع الفرق</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      هنا سيتم عرض رسم بياني لتوزيع الفرق
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تقييمات المشاريع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      هنا سيتم عرض رسم بياني لتقييمات المشاريع
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>نشاط المنصة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      هنا سيتم عرض رسم بياني لنشاط المنصة
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
