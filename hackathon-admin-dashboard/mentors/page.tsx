'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  UserPlus,
  MoreHorizontal,
  Users,
  Mail,
  Calendar,
  Award,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState<any>(null);

  // Mock data
  const mentors = [
    { 
      id: '1', 
      name: 'د. أحمد السالم', 
      email: 'ahmad.salem@example.com',
      expertise: 'تطوير الأعمال والاستراتيجية',
      assignedTeams: 3,
      availability: 'متاح',
      sessionsCompleted: 12,
      rating: 4.8,
      status: 'active',
      teams: ['فريق ألفا', 'فريق بيتا', 'فريق جاما']
    },
    { 
      id: '2', 
      name: 'م. سارة الخالد', 
      email: 'sara.khaled@example.com',
      expertise: 'التصميم وتجربة المستخدم',
      assignedTeams: 2,
      availability: 'مشغول',
      sessionsCompleted: 8,
      rating: 4.9,
      status: 'active',
      teams: ['فريق دلتا', 'فريق إبسيلون']
    },
    { 
      id: '3', 
      name: 'د. محمد العتيبي', 
      email: 'mohammed.otaibi@example.com',
      expertise: 'التقنيات الناشئة والابتكار',
      assignedTeams: 4,
      availability: 'متاح جزئياً',
      sessionsCompleted: 15,
      rating: 4.7,
      status: 'active',
      teams: ['فريق زيتا', 'فريق إيتا', 'فريق ثيتا', 'فريق يوتا']
    },
    { 
      id: '4', 
      name: 'أ. نورا القحطاني', 
      email: 'nora.qahtani@example.com',
      expertise: 'التسويق الرقمي والنمو',
      assignedTeams: 0,
      availability: 'متاح',
      sessionsCompleted: 0,
      rating: 0,
      status: 'pending',
      teams: []
    },
    { 
      id: '5', 
      name: 'م. خالد الشمري', 
      email: 'khalid.shammari@example.com',
      expertise: 'البرمجة وتطوير التطبيقات',
      assignedTeams: 3,
      availability: 'متاح',
      sessionsCompleted: 20,
      rating: 4.6,
      status: 'active',
      teams: ['فريق كابا', 'فريق لامدا', 'فريق مو']
    },
  ];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || mentor.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">بانتظار التفعيل</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">غير نشط</Badge>;
      default:
        return null;
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'متاح':
        return <Badge className="bg-green-100 text-green-800">متاح</Badge>;
      case 'مشغول':
        return <Badge className="bg-red-100 text-red-800">مشغول</Badge>;
      case 'متاح جزئياً':
        return <Badge className="bg-yellow-100 text-yellow-800">متاح جزئياً</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة الموجهين</h1>
        <div className="flex gap-4">
          <Button>
            <UserPlus className="ml-2 h-4 w-4" />
            إضافة موجه جديد
          </Button>
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            تصدير قائمة الموجهين
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموجهين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">15 نشط، 3 بانتظار</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الفرق المعينة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground">متوسط 2 فريق لكل موجه</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الجلسات المكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75</div>
            <p className="text-xs text-muted-foreground">هذا الأسبوع</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">من 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="البحث بالاسم، البريد الإلكتروني، أو التخصص..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="حالة الموجه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الموجهين</SelectItem>
                <SelectItem value="active">الموجهين النشطين</SelectItem>
                <SelectItem value="pending">بانتظار التفعيل</SelectItem>
                <SelectItem value="inactive">غير نشطين</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              المزيد من الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mentors Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>التخصص</TableHead>
                <TableHead>الفرق المعينة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الجلسات</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMentors.map((mentor) => (
                <TableRow key={mentor.id}>
                  <TableCell className="font-medium">{mentor.name}</TableCell>
                  <TableCell>{mentor.email}</TableCell>
                  <TableCell>{mentor.expertise}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{mentor.assignedTeams} فرق</span>
                    </div>
                  </TableCell>
                  <TableCell>{getAvailabilityBadge(mentor.availability)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{mentor.sessionsCompleted}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {mentor.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span>{mentor.rating}/5</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(mentor.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">فتح القائمة</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => {
                              e.preventDefault();
                              setSelectedMentor(mentor);
                            }}>
                              <Users className="ml-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل الموجه: {selectedMentor?.name}</DialogTitle>
                              <DialogDescription>
                                معلومات تفصيلية عن الموجه والفرق المعينة
                              </DialogDescription>
                            </DialogHeader>
                            {selectedMentor && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                                    <p className="text-gray-600">{selectedMentor.email}</p>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-1">التخصص</h3>
                                    <p className="text-gray-600">{selectedMentor.expertise}</p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">إحصائيات التوجيه</h3>
                                  <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-gray-50 p-3 rounded">
                                      <p className="text-sm text-gray-500">الفرق المعينة</p>
                                      <p className="text-xl font-bold">{selectedMentor.assignedTeams}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                      <p className="text-sm text-gray-500">الجلسات المكتملة</p>
                                      <p className="text-xl font-bold">{selectedMentor.sessionsCompleted}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                      <p className="text-sm text-gray-500">التقييم</p>
                                      <p className="text-xl font-bold">{selectedMentor.rating || '-'}/5</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                      <p className="text-sm text-gray-500">الحالة</p>
                                      <p className="text-sm font-bold">{selectedMentor.availability}</p>
                                    </div>
                                  </div>
                                </div>
                                {selectedMentor.teams.length > 0 && (
                                  <div>
                                    <h3 className="font-semibold mb-2">الفرق المعينة</h3>
                                    <div className="space-y-2">
                                      {selectedMentor.teams.map((team: string, index: number) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                          <Users className="h-4 w-4 text-gray-500" />
                                          <span>{team}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem>
                          <Clock className="ml-2 h-4 w-4" />
                          عرض الجدول الزمني
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          تعيين فرق
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Mail className="ml-2 h-4 w-4" />
                          إرسال بريد
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          تعديل المعلومات
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          إزالة الموجه
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
    </div>
  );
}
