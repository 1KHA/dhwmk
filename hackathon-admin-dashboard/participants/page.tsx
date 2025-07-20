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
  Mail, 
  UserPlus,
  MoreHorizontal,
  Check,
  X,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ParticipantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  // Mock data
  const participants = [
    { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', team: 'فريق ألفا', registrationDate: '2025-07-10', status: 'approved' },
    { id: '2', name: 'فاطمة علي', email: 'fatima@example.com', team: 'فريق بيتا', registrationDate: '2025-07-11', status: 'approved' },
    { id: '3', name: 'خالد العمري', email: 'khalid@example.com', team: 'بدون فريق', registrationDate: '2025-07-12', status: 'pending' },
    { id: '4', name: 'سارة أحمد', email: 'sara@example.com', team: 'فريق جاما', registrationDate: '2025-07-12', status: 'approved' },
    { id: '5', name: 'محمد الشمري', email: 'mohammed@example.com', team: 'فريق دلتا', registrationDate: '2025-07-13', status: 'pending' },
    { id: '6', name: 'نورا خالد', email: 'nora@example.com', team: 'بدون فريق', registrationDate: '2025-07-13', status: 'rejected' },
  ];

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || participant.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectAll = () => {
    if (selectedParticipants.length === filteredParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(filteredParticipants.map(p => p.id));
    }
  };

  const handleSelectParticipant = (id: string) => {
    if (selectedParticipants.includes(id)) {
      setSelectedParticipants(selectedParticipants.filter(p => p !== id));
    } else {
      setSelectedParticipants([...selectedParticipants, id]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">موافق عليه</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">قيد المراجعة</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة المشاركين</h1>
        <div className="flex gap-4">
          <Button>
            <UserPlus className="ml-2 h-4 w-4" />
            إضافة مشارك
          </Button>
          <Button variant="outline">
            <Download className="ml-2 h-4 w-4" />
            تصدير القائمة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المشاركين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12% من الحدث السابق</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">مشاركين مؤكدين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">230</div>
            <p className="text-xs text-muted-foreground">94% معدل التأكيد</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">بانتظار الموافقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">يحتاج مراجعة</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">مرفوضين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2% معدل الرفض</p>
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
                  placeholder="البحث بالاسم، البريد الإلكتروني، أو الفريق..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="حالة المشارك" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المشاركين</SelectItem>
                <SelectItem value="approved">موافق عليهم</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="rejected">مرفوضين</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="ml-2 h-4 w-4" />
              المزيد من الفلاتر
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedParticipants.length > 0 && (
        <Card className="mb-4 bg-blue-50 border-blue-200">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                تم تحديد {selectedParticipants.length} مشارك
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Check className="ml-2 h-4 w-4" />
                  الموافقة على المحدد
                </Button>
                <Button size="sm" variant="outline">
                  <X className="ml-2 h-4 w-4" />
                  رفض المحدد
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="ml-2 h-4 w-4" />
                  إرسال بريد جماعي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Participants Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الفريق</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedParticipants.includes(participant.id)}
                      onChange={() => handleSelectParticipant(participant.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>{participant.team}</TableCell>
                  <TableCell>{participant.registrationDate}</TableCell>
                  <TableCell>{getStatusBadge(participant.status)}</TableCell>
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
                        <DropdownMenuItem>
                          <Eye className="ml-2 h-4 w-4" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          تعديل المعلومات
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {participant.status === 'pending' && (
                          <>
                            <DropdownMenuItem className="text-green-600">
                              <Check className="ml-2 h-4 w-4" />
                              الموافقة
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <X className="ml-2 h-4 w-4" />
                              الرفض
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>
                          <Mail className="ml-2 h-4 w-4" />
                          إرسال بريد
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          حذف المشارك
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
