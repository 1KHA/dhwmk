"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash,
  Bell,
  Download,
  Eye,
  CalendarDays,
  List,
  Video,
  Building,
  UserCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Mock data for events
const mockEvents = [
  {
    id: 1,
    name: "ورشة عمل: أساسيات البرمجة",
    nameEn: "Workshop: Programming Basics",
    type: "workshop",
    description: "ورشة تدريبية للمبتدئين في البرمجة",
    date: "2024-01-20",
    startTime: "10:00",
    endTime: "12:00",
    location: "قاعة A - المبنى الرئيسي",
    locationType: "physical",
    facilitator: "د. أحمد السالم",
    maxAttendees: 50,
    registeredAttendees: 45,
    status: "upcoming",
    attendanceMarked: false,
  },
  {
    id: 2,
    name: "حفل الافتتاح",
    nameEn: "Opening Ceremony",
    type: "ceremony",
    description: "حفل افتتاح الهاكاثون والترحيب بالمشاركين",
    date: "2024-01-19",
    startTime: "09:00",
    endTime: "10:00",
    location: "القاعة الكبرى",
    locationType: "physical",
    facilitator: "إدارة الهاكاثون",
    maxAttendees: 200,
    registeredAttendees: 180,
    status: "completed",
    attendanceMarked: true,
  },
  {
    id: 3,
    name: "جلسة إرشادية: كيفية العرض التقديمي",
    nameEn: "Mentoring Session: How to Pitch",
    type: "mentoring",
    description: "نصائح وإرشادات لتقديم عرض مميز أمام لجنة التحكيم",
    date: "2024-01-21",
    startTime: "14:00",
    endTime: "15:30",
    location: "https://zoom.us/j/123456789",
    locationType: "virtual",
    facilitator: "م. سارة الخالد",
    maxAttendees: 100,
    registeredAttendees: 78,
    status: "upcoming",
    attendanceMarked: false,
  },
  {
    id: 4,
    name: "موعد نهائي: تسليم المشاريع",
    nameEn: "Deadline: Project Submission",
    type: "deadline",
    description: "آخر موعد لتسليم المشاريع النهائية",
    date: "2024-01-22",
    startTime: "23:59",
    endTime: "23:59",
    location: "منصة التسليم الإلكترونية",
    locationType: "online",
    facilitator: "-",
    maxAttendees: 0,
    registeredAttendees: 0,
    status: "upcoming",
    attendanceMarked: false,
  },
  {
    id: 5,
    name: "محاضرة: الذكاء الاصطناعي في الأعمال",
    nameEn: "Talk: AI in Business",
    type: "talk",
    description: "محاضرة عن تطبيقات الذكاء الاصطناعي في عالم الأعمال",
    date: "2024-01-20",
    startTime: "16:00",
    endTime: "17:00",
    location: "قاعة المحاضرات",
    locationType: "physical",
    facilitator: "د. محمد العتيبي",
    maxAttendees: 80,
    registeredAttendees: 72,
    status: "ongoing",
    attendanceMarked: false,
  },
];

const eventTypes = [
  { value: "all", label: "جميع الأنواع" },
  { value: "workshop", label: "ورشة عمل" },
  { value: "talk", label: "محاضرة" },
  { value: "ceremony", label: "حفل" },
  { value: "mentoring", label: "جلسة إرشادية" },
  { value: "deadline", label: "موعد نهائي" },
  { value: "networking", label: "جلسة تواصل" },
];

const statusOptions = [
  { value: "all", label: "جميع الحالات" },
  { value: "upcoming", label: "قادمة" },
  { value: "ongoing", label: "جارية" },
  { value: "completed", label: "مكتملة" },
  { value: "cancelled", label: "ملغاة" },
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "workshop":
        return "bg-blue-100 text-blue-800";
      case "talk":
        return "bg-purple-100 text-purple-800";
      case "ceremony":
        return "bg-green-100 text-green-800";
      case "mentoring":
        return "bg-yellow-100 text-yellow-800";
      case "deadline":
        return "bg-red-100 text-red-800";
      case "networking":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeLabel = (type: string) => {
    const typeObj = eventTypes.find((t) => t.value === type);
    return typeObj ? typeObj.label : type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const statusObj = statusOptions.find((s) => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const getLocationIcon = (locationType: string) => {
    switch (locationType) {
      case "physical":
        return <Building className="h-4 w-4" />;
      case "virtual":
        return <Video className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.facilitator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">إدارة الفعاليات</h1>
        <p className="text-gray-600">جدولة وإدارة جميع فعاليات الهاكاثون</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الفعاليات</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">عبر 5 أيام</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فعاليات اليوم</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 جارية، 2 قادمة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فعاليات قادمة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">خلال الأيام القادمة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل الحضور</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">للفعاليات المكتملة</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions and View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة فعالية جديدة
          </Button>
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            تصدير الجدول
          </Button>
        </div>
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
          <TabsList>
            <TabsTrigger value="list">
              <List className="ml-2 h-4 w-4" />
              قائمة
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="ml-2 h-4 w-4" />
              تقويم
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث عن فعالية أو متحدث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="نوع الفعالية" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="ml-2 h-4 w-4" />
          المزيد من الفلاتر
        </Button>
      </div>

      {/* Events View */}
      {viewMode === "list" ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الفعالية</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">التاريخ والوقت</TableHead>
                  <TableHead className="text-right">المكان</TableHead>
                  <TableHead className="text-right">المسؤول</TableHead>
                  <TableHead className="text-right">الحضور</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{event.name}</div>
                        <div className="text-sm text-gray-500">{event.nameEn}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEventTypeColor(event.type)}>
                        {getEventTypeLabel(event.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <div>
                          <div>{event.date}</div>
                          <div className="text-sm text-gray-500">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLocationIcon(event.locationType)}
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{event.facilitator}</TableCell>
                    <TableCell>
                      {event.maxAttendees > 0 ? (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {event.registeredAttendees}/{event.maxAttendees}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedEvent(event)}>
                            <Eye className="ml-2 h-4 w-4" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="ml-2 h-4 w-4" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="ml-2 h-4 w-4" />
                            إرسال تذكير
                          </DropdownMenuItem>
                          {event.status === "completed" && !event.attendanceMarked && (
                            <DropdownMenuItem>
                              <UserCheck className="ml-2 h-4 w-4" />
                              تسجيل الحضور
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="ml-2 h-4 w-4" />
                            إلغاء الفعالية
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">عرض التقويم قيد التطوير</p>
              <p className="text-sm mt-2">سيتم إضافة عرض التقويم الشهري قريباً</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل الفعالية</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">معلومات الفعالية</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">الاسم:</span>
                      <p className="font-medium">{selectedEvent.name}</p>
                      <p className="text-sm text-gray-500">{selectedEvent.nameEn}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">النوع:</span>
                      <Badge className={`mr-2 ${getEventTypeColor(selectedEvent.type)}`}>
                        {getEventTypeLabel(selectedEvent.type)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">الوصف:</span>
                      <p className="text-sm">{selectedEvent.description}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">التوقيت والمكان</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">التاريخ:</span>
                      <p className="font-medium">{selectedEvent.date}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">الوقت:</span>
                      <p className="font-medium">
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">المكان:</span>
                      <div className="flex items-center gap-2 mt-1">
                        {getLocationIcon(selectedEvent.locationType)}
                        <p className="font-medium">{selectedEvent.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">معلومات إضافية</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">المسؤول</p>
                    <p className="font-medium">{selectedEvent.facilitator}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">الحالة</p>
                    <Badge className={getStatusColor(selectedEvent.status)}>
                      {getStatusLabel(selectedEvent.status)}
                    </Badge>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-500">الحضور</p>
                    {selectedEvent.maxAttendees > 0 ? (
                      <p className="font-medium">
                        {selectedEvent.registeredAttendees} من {selectedEvent.maxAttendees}
                      </p>
                    ) : (
                      <p className="font-medium">غير محدود</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedEvent.status === "completed" && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2">
                    {selectedEvent.attendanceMarked ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-green-600">تم تسجيل الحضور</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="text-yellow-600">لم يتم تسجيل الحضور بعد</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل
                </Button>
                <Button variant="outline">
                  <Bell className="ml-2 h-4 w-4" />
                  إرسال تذكير
                </Button>
                {selectedEvent.status === "completed" && !selectedEvent.attendanceMarked && (
                  <Button>
                    <UserCheck className="ml-2 h-4 w-4" />
                    تسجيل الحضور
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة فعالية جديدة</DialogTitle>
            <DialogDescription>أدخل تفاصيل الفعالية الجديدة</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name-ar">اسم الفعالية (عربي)</Label>
                <Input id="name-ar" placeholder="أدخل اسم الفعالية بالعربية" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name-en">اسم الفعالية (إنجليزي)</Label>
                <Input id="name-en" placeholder="Enter event name in English" dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">نوع الفعالية</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="اختر نوع الفعالية" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.slice(1).map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitator">المسؤول عن الفعالية</Label>
                <Input id="facilitator" placeholder="اسم المتحدث أو المسؤول" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">وصف الفعالية</Label>
              <Textarea
                id="description"
                placeholder="أدخل وصف مختصر للفعالية"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">التاريخ</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-time">وقت البداية</Label>
                <Input id="start-time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">وقت النهاية</Label>
                <Input id="end-time" type="time" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location-type">نوع المكان</Label>
                <Select>
                  <SelectTrigger id="location-type">
                    <SelectValue placeholder="اختر نوع المكان" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">حضوري</SelectItem>
                    <SelectItem value="virtual">افتراضي</SelectItem>
                    <SelectItem value="hybrid">مختلط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">المكان</Label>
                <Input id="location" placeholder="القاعة أو رابط الاجتماع" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-attendees">الحد الأقصى للحضور (اختياري)</Label>
              <Input
                id="max-attendees"
                type="number"
                placeholder="اتركه فارغاً إذا لم يكن هناك حد"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>حفظ الفعالية</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
