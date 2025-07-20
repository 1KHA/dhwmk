"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  UserCheck, 
  Trophy, 
  Calendar, 
  FileText, 
  TrendingUp,
  Award,
  BookOpen,
  Rocket,
  Bell,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { RouteGuard } from "@/components/auth/RouteGuard"
import { UserRole } from "@prisma/client"

export default function HackathonAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <RouteGuard 
      requiredPermission={{ category: 'dashboard', action: 'view' }}
      requiredRole={'HACKATHON_ADMIN' as any}
    >
      <div className="space-y-6 text-right">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              هاكاثون جديد
            </Button>
            <Button variant="outline">
              <Bell className="ml-2 h-4 w-4" />
              إرسال إعلان
            </Button>
          </div>
          <h1 className="text-3xl font-bold">لوحة تحكم إدارة الهاكاثون</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="justify-end">
            <TabsTrigger value="submissions">المشاريع المقدمة</TabsTrigger>
            <TabsTrigger value="teams">الفرق</TabsTrigger>
            <TabsTrigger value="participants">المشاركون</TabsTrigger>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي المشاركين</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">245</div>
                    <p className="text-xs text-muted-foreground">+12% من الحدث السابق</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">إجمالي الفرق</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">48</div>
                    <p className="text-xs text-muted-foreground">6 بانتظار الموافقة</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">المشاريع المقدمة</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">معدل التقديم 87.5%</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الحكام</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">جميعهم تم تعيينهم</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الموجهون</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">15 نشط اليوم</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">الفعاليات النشطة</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">2 اليوم</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>النشاط الأخير</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-r-4 border-blue-500 pr-4 py-2">
                      <h3 className="font-bold">تسجيل مشارك جديد</h3>
                      <p className="text-muted-foreground">تم تسجيل أحمد محمد في الهاكاثون</p>
                      <p className="text-xs text-muted-foreground">منذ 5 دقائق</p>
                    </div>
                    <div className="border-r-4 border-green-500 pr-4 py-2">
                      <h3 className="font-bold">تقديم مشروع</h3>
                      <p className="text-muted-foreground">فريق ألفا قدم مشروعهم</p>
                      <p className="text-xs text-muted-foreground">منذ 15 دقيقة</p>
                    </div>
                    <div className="border-r-4 border-purple-500 pr-4 py-2">
                      <h3 className="font-bold">تشكيل فريق جديد</h3>
                      <p className="text-muted-foreground">تم تشكيل فريق الابتكار</p>
                      <p className="text-xs text-muted-foreground">منذ ساعة</p>
                    </div>
                    <div className="border-r-4 border-amber-500 pr-4 py-2">
                      <h3 className="font-bold">تعيين حكم</h3>
                      <p className="text-muted-foreground">تم تعيين سارة أحمد لتقييم 5 مشاريع</p>
                      <p className="text-xs text-muted-foreground">منذ ساعتين</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>المواعيد النهائية القادمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">موعد انتهاء التسجيل</h4>
                        <p className="text-sm text-muted-foreground">20 يوليو 2025</p>
                      </div>
                      <span className="text-sm font-medium text-orange-600">باقي 4 أيام</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">تقديم المشاريع</h4>
                        <p className="text-sm text-muted-foreground">25 يوليو 2025</p>
                      </div>
                      <span className="text-sm font-medium text-orange-600">باقي 9 أيام</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">العروض النهائية</h4>
                        <p className="text-sm text-muted-foreground">28 يوليو 2025</p>
                      </div>
                      <span className="text-sm font-medium text-orange-600">باقي 12 يوم</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>تقدم الهاكاثون</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
                  <div className="absolute left-0 top-1/2 w-1/3 h-1 bg-blue-500 -translate-y-1/2"></div>
                  <div className="relative flex justify-between">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mb-2">✓</div>
                      <p className="text-xs">فتح التسجيل</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mb-2">✓</div>
                      <p className="text-xs">تشكيل الفرق</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm mb-2">3</div>
                      <p className="text-xs">مرحلة التطوير</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm mb-2">4</div>
                      <p className="text-xs">التقديم</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm mb-2">5</div>
                      <p className="text-xs">التحكيم</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات المشاركين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Users className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-bold text-xl">245</h3>
                    <p className="text-muted-foreground">إجمالي المشاركين</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <UserCheck className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-bold text-xl">230</h3>
                    <p className="text-muted-foreground">مشاركين مؤكدين</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Rocket className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-bold text-xl">48</h3>
                    <p className="text-muted-foreground">فرق مشكلة</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Award className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-bold text-xl">15</h3>
                    <p className="text-muted-foreground">مشاركين فرديين</p>
                  </div>
                </div>

                <h3 className="font-bold mb-4">أحدث المشاركين المسجلين</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">أحمد محمد</h4>
                      <p className="text-sm text-muted-foreground">مطور برمجيات - فريق ألفا</p>
                    </div>
                    <p className="text-sm">منذ 5 دقائق</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">فاطمة علي</h4>
                      <p className="text-sm text-muted-foreground">مصممة UI/UX - فريق بيتا</p>
                    </div>
                    <p className="text-sm">منذ 20 دقيقة</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">خالد العمري</h4>
                      <p className="text-sm text-muted-foreground">مهندس بيانات - بدون فريق</p>
                    </div>
                    <p className="text-sm">منذ ساعة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الفرق</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-4">الفرق النشطة</h3>
                    <div className="space-y-4">
                      <div className="border-r-4 border-blue-500 pr-4 py-2">
                        <h4 className="font-bold">فريق ألفا</h4>
                        <p className="text-muted-foreground">5 أعضاء - مشروع: منصة تعليمية ذكية</p>
                        <p className="text-sm">الموجه: د. سامي أحمد</p>
                      </div>
                      <div className="border-r-4 border-purple-500 pr-4 py-2">
                        <h4 className="font-bold">فريق بيتا</h4>
                        <p className="text-muted-foreground">4 أعضاء - مشروع: تطبيق صحة رقمية</p>
                        <p className="text-sm">الموجه: م. ليلى محمد</p>
                      </div>
                      <div className="border-r-4 border-green-500 pr-4 py-2">
                        <h4 className="font-bold">فريق جاما</h4>
                        <p className="text-muted-foreground">6 أعضاء - مشروع: حلول ذكاء اصطناعي</p>
                        <p className="text-sm">الموجه: د. عبدالله الشمري</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mb-4">الفرق بانتظار الموافقة</h3>
                    <div className="space-y-4">
                      <div className="border-r-4 border-amber-500 pr-4 py-2">
                        <h4 className="font-bold">فريق دلتا</h4>
                        <p className="text-muted-foreground">3 أعضاء - مشروع: منصة تجارة إلكترونية</p>
                        <p className="text-sm text-amber-600">بانتظار الموافقة</p>
                      </div>
                      <div className="border-r-4 border-amber-500 pr-4 py-2">
                        <h4 className="font-bold">فريق إبسيلون</h4>
                        <p className="text-muted-foreground">4 أعضاء - مشروع: تطبيق توصيل</p>
                        <p className="text-sm text-amber-600">بانتظار الموافقة</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>المشاريع المقدمة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <h3 className="font-bold text-xl">42</h3>
                    <p className="text-muted-foreground">إجمالي المشاريع</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <h3 className="font-bold text-xl">35</h3>
                    <p className="text-muted-foreground">تمت الموافقة عليها</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <h3 className="font-bold text-xl">7</h3>
                    <p className="text-muted-foreground">قيد المراجعة</p>
                  </div>
                </div>

                <h3 className="font-bold mb-4">أحدث المشاريع المقدمة</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">منصة تعليمية ذكية</h4>
                      <p className="text-sm text-muted-foreground">فريق ألفا - تقنيات التعليم</p>
                    </div>
                    <p className="text-sm text-green-500">تمت الموافقة</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">تطبيق صحة رقمية</h4>
                      <p className="text-sm text-muted-foreground">فريق بيتا - التقنيات الصحية</p>
                    </div>
                    <p className="text-sm text-amber-500">قيد المراجعة</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">حلول ذكاء اصطناعي</h4>
                      <p className="text-sm text-muted-foreground">فريق جاما - الذكاء الاصطناعي</p>
                    </div>
                    <p className="text-sm text-green-500">تمت الموافقة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  )
}
