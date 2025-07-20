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
  Trophy,
  Mail,
  FileText,
  BarChart
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

export default function JudgesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJudge, setSelectedJudge] = useState<any>(null);

  // Mock data
  const judges = [
    { 
      id: '1', 
      name: 'د. سامي أحمد', 
      email: 'sami@example.com',
      expertise: 'الذكاء الاصطناعي والتعلم الآلي',
      assignedProjects: 5,
      completedReviews: 3,
      averageScore: 8.5,
      status: 'active'
    },
    { 
      id: '2', 
      name: 'م. ليلى محمد', 
      email: 'layla@example.com',
      expertise: 'تطوير البرمجيات وهندسة النظم',
      assignedProjects: 4,
      completedReviews: 4,
      averageScore: 7.8,
      status: 'active'
    },
    { 
      id: '3', 
      name: 'د. عبدالله الشمري', 
      email: 'abdullah@example.com',
      expertise: 'ريادة الأعمال والابتكار',
      assignedProjects: 6,
      completedReviews: 2,
      averageScore: 9.2,
      status: 'active'
    },
    { 
      id: '4', 
      name: 'أ. فاطمة العلي', 
      email: 'fatima@example.com',
      expertise: 'التصميم وتجربة المستخدم',
      assignedProjects: 3,
      completedReviews: 0,
      averageScore: 0,
      status: 'pending'
    },
    { 
      id: '5', 
      name: 'د. محمد الحربي', 
      email: 'mohammed@example.com',
      expertise: 'التقنيات الصحية والطبية',
      assignedProjects: 5,
      completedReviews: 5,
      averageScore: 8.9,
      status: 'active'
    },
  ];

  const filteredJudges = judges.filter(judge => {
    const matchesSearch = judge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         judge.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         judge.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || judge.status === filterStatus;
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

  const getProgressColor = (completed: number, total: number) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage > 0) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className="p-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة الحكام</h1>
        <div className="flex gap-4">
          <Button>
            <UserPlus className="ml-2 h-4 w-4" />
            إضافة حكم جديد
          </Button>
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            تصدير قائمة الحكام
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحكام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">10 نشط، 2 بانتظار</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">المشاريع المعينة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">متوسط 3.5 لكل حكم</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">التقييمات المكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">66.7% معدل الإنجاز</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.4</div>
            <p className="text-xs text-muted-foreground">من 10</p>
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
                <SelectValue placeholder="حالة الحكم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحكام</SelectItem>
                <SelectItem value="active">الحكام النشطين</SelectItem>
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

      {/* Judges Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>التخصص</TableHead>
                <TableHead>المشاريع المعينة</TableHead>
                <TableHead>التقدم</TableHead>
                <TableHead>متوسط التقييم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJudges.map((judge) => (
                <TableRow key={judge.id}>
                  <TableCell className="font-medium">{judge.name}</TableCell>
                  <TableCell>{judge.email}</TableCell>
                  <TableCell>{judge.expertise}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>{judge.assignedProjects} مشاريع</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(judge.completedReviews, judge.assignedProjects)}`}
                          style={{ width: `${judge.assignedProjects > 0 ? (judge.completedReviews / judge.assignedProjects) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm">{judge.completedReviews}/{judge.assignedProjects}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {judge.averageScore > 0 ? (
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span>{judge.averageScore}/10</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(judge.status)}</TableCell>
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
                              setSelectedJudge(judge);
                            }}>
                              <BarChart className="ml-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل الحكم: {selectedJudge?.name}</DialogTitle>
                              <DialogDescription>
                                معلومات تفصيلية عن الحكم والمشاريع المعينة
                              </DialogDescription>
                            </DialogHeader>
                            {selectedJudge && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-semibold mb-1">البريد الإلكتروني</h3>
                                    <p className="text-gray-600">{selectedJudge.email}</p>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-1">التخصص</h3>
                                    <p className="text-gray-600">{selectedJudge.expertise}</p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">إحصائيات التحكيم</h3>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-3 rounded">
                                      <p className="text-sm text-gray-500">المشاريع المعينة</p>
                                      <p className="text-xl font-bold">{selectedJudge.assignedProjects}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                      <p className="text-sm text-gray-500">التقييمات المكتملة</p>
                                      <p className="text-xl font-bold">{selectedJudge.completedReviews}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded">
                                      <p className="text-sm text-gray-500">متوسط التقييم</p>
                                      <p className="text-xl font-bold">{selectedJudge.averageScore || '-'}</p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">التقدم</h3>
                                  <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div 
                                      className={`h-4 rounded-full ${getProgressColor(selectedJudge.completedReviews, selectedJudge.assignedProjects)}`}
                                      style={{ width: `${selectedJudge.assignedProjects > 0 ? (selectedJudge.completedReviews / selectedJudge.assignedProjects) * 100 : 0}%` }}
                                    />
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {selectedJudge.completedReviews} من {selectedJudge.assignedProjects} مشروع تم تقييمه
                                  </p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem>
                          تعيين مشاريع
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          عرض المشاريع المعينة
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
                          إزالة الحكم
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
