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
  Eye,
  Edit,
  UserCheck,
  Award
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

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  // Mock data
  const teams = [
    { 
      id: '1', 
      name: 'فريق ألفا', 
      project: 'منصة تعليمية ذكية',
      members: [
        { name: 'أحمد محمد', role: 'قائد الفريق', email: 'ahmed@example.com' },
        { name: 'سارة أحمد', role: 'مطور', email: 'sara@example.com' },
        { name: 'محمد علي', role: 'مصمم', email: 'mohammed@example.com' },
        { name: 'فاطمة خالد', role: 'محلل بيانات', email: 'fatima@example.com' },
        { name: 'عمر حسن', role: 'مطور', email: 'omar@example.com' },
      ],
      mentor: 'د. سامي أحمد',
      status: 'active',
      createdAt: '2025-07-10'
    },
    { 
      id: '2', 
      name: 'فريق بيتا', 
      project: 'تطبيق صحة رقمية',
      members: [
        { name: 'ليلى محمد', role: 'قائد الفريق', email: 'layla@example.com' },
        { name: 'خالد العمري', role: 'مطور', email: 'khalid@example.com' },
        { name: 'نورا سالم', role: 'مصمم UX', email: 'nora@example.com' },
        { name: 'حسام أحمد', role: 'مطور backend', email: 'hussam@example.com' },
      ],
      mentor: 'م. ليلى محمد',
      status: 'active',
      createdAt: '2025-07-11'
    },
    { 
      id: '3', 
      name: 'فريق جاما', 
      project: 'حلول ذكاء اصطناعي',
      members: [
        { name: 'عبدالله الشمري', role: 'قائد الفريق', email: 'abdullah@example.com' },
        { name: 'مريم حسن', role: 'عالم بيانات', email: 'mariam@example.com' },
        { name: 'يوسف علي', role: 'مهندس ML', email: 'yousef@example.com' },
        { name: 'زينب أحمد', role: 'مطور', email: 'zainab@example.com' },
        { name: 'طارق محمد', role: 'محلل أعمال', email: 'tariq@example.com' },
        { name: 'هدى سالم', role: 'مصمم', email: 'huda@example.com' },
      ],
      mentor: 'د. عبدالله الشمري',
      status: 'active',
      createdAt: '2025-07-12'
    },
    { 
      id: '4', 
      name: 'فريق دلتا', 
      project: 'منصة تجارة إلكترونية',
      members: [
        { name: 'رامي خالد', role: 'قائد الفريق', email: 'rami@example.com' },
        { name: 'سلمى أحمد', role: 'مطور', email: 'salma@example.com' },
        { name: 'باسل محمد', role: 'مصمم', email: 'basel@example.com' },
      ],
      mentor: null,
      status: 'pending',
      createdAt: '2025-07-13'
    },
  ];

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (team.mentor && team.mentor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || team.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">بانتظار الموافقة</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">غير نشط</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة الفرق</h1>
        <div className="flex gap-4">
          <Button>
            <UserPlus className="ml-2 h-4 w-4" />
            إنشاء فريق جديد
          </Button>
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            تصدير قائمة الفرق
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الفرق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">+8 من الحدث السابق</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الفرق النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">87.5% معدل النشاط</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">بانتظار الموافقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">يحتاج مراجعة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">متوسط حجم الفريق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5</div>
            <p className="text-xs text-muted-foreground">عضو لكل فريق</p>
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
                  placeholder="البحث باسم الفريق، المشروع، أو الموجه..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="حالة الفريق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفرق</SelectItem>
                <SelectItem value="active">الفرق النشطة</SelectItem>
                <SelectItem value="pending">بانتظار الموافقة</SelectItem>
                <SelectItem value="inactive">غير نشطة</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              المزيد من الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teams Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الفريق</TableHead>
                <TableHead>المشروع</TableHead>
                <TableHead>الأعضاء</TableHead>
                <TableHead>الموجه</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.project}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{team.members.length} أعضاء</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {team.mentor ? (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span>{team.mentor}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">لم يتم التعيين</span>
                    )}
                  </TableCell>
                  <TableCell>{team.createdAt}</TableCell>
                  <TableCell>{getStatusBadge(team.status)}</TableCell>
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
                              setSelectedTeam(team);
                            }}>
                              <Eye className="ml-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل الفريق: {selectedTeam?.name}</DialogTitle>
                              <DialogDescription>
                                معلومات تفصيلية عن الفريق وأعضائه
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTeam && (
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold mb-2">المشروع</h3>
                                  <p className="text-gray-600">{selectedTeam.project}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">الموجه</h3>
                                  <p className="text-gray-600">{selectedTeam.mentor || 'لم يتم التعيين'}</p>
                                </div>
                                <div>
                                  <h3 className="font-semibold mb-2">أعضاء الفريق ({selectedTeam.members.length})</h3>
                                  <div className="space-y-2">
                                    {selectedTeam.members.map((member: any, index: number) => (
                                      <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                        <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                                          {member.name.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium">{member.name}</p>
                                          <p className="text-sm text-gray-500">{member.role} • {member.email}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل معلومات الفريق
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserCheck className="ml-2 h-4 w-4" />
                          تعيين موجه
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {team.status === 'pending' && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              الموافقة على الفريق
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              رفض الفريق
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>
                          إضافة/إزالة أعضاء
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          حذف الفريق
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
