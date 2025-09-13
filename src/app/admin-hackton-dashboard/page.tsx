"use client";

import { useState, useEffect } from "react";
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
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { showAdminToast } from "@/components/admin/admin-toaster";
import { LineChart, BarChart, PieChart } from "../../../components/Charts";

// Define the dashboard statistics type
interface DashboardStats {
  totalParticipants: number;
  totalTeams: number;
  individualParticipants: number;
  totalMentors: number;
  totalEvents: number;
  completedEvents: number;
  upcomingEvents: number;
  totalEventRegistrations: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  acceptedSubmissions: number;
  totalMentorBookings: number;
  completedMentorBookings: number;
  teamDistribution: { name: string; count: number }[];
  milestones: { id: string; title: string; submissionCount: number }[];
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/dashboard/stats");
        
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard statistics");
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("حدث خطأ أثناء جلب إحصائيات لوحة التحكم");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    showAdminToast({
      title: "تبديل التبويب",
      description: `تم التبديل إلى تبويب ${value === "overview" ? "النظرة العامة" : "الإحصائيات"}`,
      variant: "default",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2 text-lg">جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
        <p className="font-bold">خطأ</p>
        <p>{error}</p>
      </div>
    );
  }

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
                <div className="text-2xl font-bold">{stats?.totalParticipants || 0}</div>
                <p className="text-xs text-muted-foreground">
                  إجمالي عدد المشاركين المسجلين
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
                <div className="text-2xl font-bold">{stats?.totalTeams || 0}</div>
                <p className="text-xs text-muted-foreground">
                  إجمالي عدد الفرق المسجلة
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  المشاركات الفردية
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.individualParticipants || 0}</div>
                <p className="text-xs text-muted-foreground">
                  عدد المشاركين بدون فرق
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
                <div className="text-2xl font-bold">{stats?.totalMentors || 0}</div>
                <p className="text-xs text-muted-foreground">
                  إجمالي عدد الموجهين المسجلين
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الفعاليات
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalEvents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  عدد الفعاليات المخططة
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الفعاليات المكتملة
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completedEvents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  عدد الفعاليات التي تم إكمالها
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الفعاليات القادمة
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.upcomingEvents || 0}</div>
                <p className="text-xs text-muted-foreground">
                  عدد الفعاليات المستقبلية
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي التسجيلات
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalEventRegistrations || 0}</div>
                <p className="text-xs text-muted-foreground">
                  عدد التسجيلات في الفعاليات
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي التسليمات
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalSubmissions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  عدد تسليمات المراحل
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  التسليمات المقبولة
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.acceptedSubmissions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  عدد التسليمات المقبولة
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  التسليمات المعلقة
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingSubmissions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  عدد التسليمات قيد المراجعة
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
                <CardTitle>توزيع المشاركين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع الفرق حسب المسار</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تسليمات المراحل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {stats?.milestones && stats.milestones.length > 0 ? (
                    <div className="space-y-4">
                      {stats.milestones.map((milestone) => (
                        <div key={milestone.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{milestone.title}</span>
                            <span className="text-sm text-muted-foreground">{milestone.submissionCount} تسليم</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ 
                                width: `${Math.min(100, (milestone.submissionCount / Math.max(stats.totalTeams, 1)) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">لا توجد مراحل مسجلة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>حالة التسليمات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <div className="flex flex-col h-full justify-center">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">التسليمات المقبولة</span>
                          <span className="text-sm text-muted-foreground">
                            {stats?.acceptedSubmissions || 0} من {stats?.totalSubmissions || 0}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ 
                              width: `${stats?.totalSubmissions ? (stats.acceptedSubmissions / stats.totalSubmissions) * 100 : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">التسليمات المعلقة</span>
                          <span className="text-sm text-muted-foreground">
                            {stats?.pendingSubmissions || 0} من {stats?.totalSubmissions || 0}
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-500" 
                            style={{ 
                              width: `${stats?.totalSubmissions ? (stats.pendingSubmissions / stats.totalSubmissions) * 100 : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">نسبة الإكمال</span>
                          <span className="text-sm text-muted-foreground">
                            {stats?.totalSubmissions && stats?.totalTeams && stats.milestones?.length
                              ? Math.round((stats.totalSubmissions / (stats.totalTeams * stats.milestones.length)) * 100)
                              : 0}%
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ 
                              width: `${stats?.totalSubmissions && stats?.totalTeams && stats.milestones?.length
                                ? (stats.totalSubmissions / (stats.totalTeams * stats.milestones.length)) * 100
                                : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
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
