'use client';

import { useState, useEffect } from 'react';
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
  Clock,
  Edit,
  Trash2
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '../../../../components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ar'; // Import Arabic locale
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('ar'); // Set moment to use Arabic
const localizer = momentLocalizer(moment);

const messages = {
  allDay: 'يوم كامل',
  previous: 'السابق',
  next: 'التالي',
  today: 'اليوم',
  month: 'شهر',
  week: 'أسبوع',
  day: 'يوم',
  agenda: 'أجندة',
  date: 'تاريخ',
  time: 'وقت',
  event: 'حدث',
  showMore: (total: number) => `+${total} المزيد`,
};

interface AvailabilityEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
}

// Define the Mentor type
interface Mentor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  phone: string;
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  // The following fields are for display and might not be in the DB model directly
  assignedTeams?: number;
  availability?: string;
  sessionsCompleted?: number;
  rating?: number;
  teams?: string[];
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mentorToEdit, setMentorToEdit] = useState<Mentor | null>(null);
  const [mentorToDelete, setMentorToDelete] = useState<Mentor | null>(null);
  const [isAvailabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [mentorForAvailability, setMentorForAvailability] = useState<Mentor | null>(null);
  const [availabilityEvents, setAvailabilityEvents] = useState<AvailabilityEvent[]>([]);
  const [slotToAdd, setSlotToAdd] = useState<{ start: Date; end: Date } | null>(null);
  const [eventToDelete, setEventToDelete] = useState<AvailabilityEvent | null>(null);
  const [newMentor, setNewMentor] = useState({
    name: '',
    email: '',
    specialty: '',
    phone: '',
    password: '',
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const { toast } = useToast();

  const fetchMentorAvailability = async (mentorId: string) => {
    try {
      const response = await fetch(`/api/admin/mentors/${mentorId}/availability`);
      if (response.ok) {
        const data = await response.json();
        const formattedEvents = data.map((avail: any) => ({
          id: avail.id,
          start: new Date(avail.startTime),
          end: new Date(avail.endTime),
          title: 'Available',
        }));
        setAvailabilityEvents(formattedEvents);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch mentor availability.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching availability.",
        variant: "destructive",
      })
    }
  };

  const handleAddAvailability = async () => {
    if (!mentorForAvailability || !slotToAdd) return;

    try {
      const response = await fetch(`/api/admin/mentors/${mentorForAvailability.id}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: slotToAdd.start, end: slotToAdd.end }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Availability added successfully.',
        });
        fetchMentorAvailability(mentorForAvailability.id); // Refresh events
      } else {
        throw new Error('Failed to add availability');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while adding availability.',
        variant: 'destructive',
      });
    } finally {
      setSlotToAdd(null);
    }
  };

  const handleDeleteAvailability = async () => {
    if (!mentorForAvailability || !eventToDelete) return;

    try {
      const response = await fetch(`/api/admin/mentors/${mentorForAvailability.id}/availability`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availabilityId: eventToDelete.id }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Availability removed successfully.',
        });
        fetchMentorAvailability(mentorForAvailability.id); // Refresh events
      } else {
        throw new Error('Failed to remove availability');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while removing availability.',
        variant: 'destructive',
      });
    } finally {
      setEventToDelete(null);
    }
  };

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/admin/mentors');
      if (!response.ok) {
        throw new Error('Failed to fetch mentors');
      }
      const data = await response.json();
      // Add mock display data for now
      const mentorsWithMockData = data.map((mentor: Mentor) => ({
        ...mentor,
        assignedTeams: Math.floor(Math.random() * 5),
        availability: ['متاح', 'مشغول', 'متاح جزئياً'][Math.floor(Math.random() * 3)],
        sessionsCompleted: Math.floor(Math.random() * 20),
        rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
        teams: ['فريق ألفا', 'فريق بيتا'].slice(0, Math.floor(Math.random() * 3)),
      }));
      setMentors(mentorsWithMockData);
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطأ',
        description: 'فشل في جلب قائمة الموجهين.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleAddMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/mentors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMentor),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add mentor');
      }

      const addedMentor = await response.json();
      toast({
        title: 'نجاح',
        description: `تمت إضافة الموجه بنجاح. كلمة المرور الافتراضية: ${newMentor.password}`,
      });
      setAddDialogOpen(false);
      setNewMentor({ name: '', email: '', specialty: '', phone: '', password: '' });
      fetchMentors(); // Refresh the list
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في إضافة الموجه.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorToEdit) return;

    try {
      const response = await fetch('/api/admin/mentors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mentorToEdit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update mentor');
      }

      toast({
        title: 'نجاح',
        description: 'تم تحديث بيانات الموجه بنجاح.',
      });
      setEditDialogOpen(false);
      setMentorToEdit(null);
      fetchMentors(); // Refresh the list
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في تحديث بيانات الموجه.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMentor = async () => {
    if (!mentorToDelete) return;

    try {
      const response = await fetch('/api/admin/mentors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: mentorToDelete.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete mentor');
      }

      toast({
        title: 'نجاح',
        description: 'تم إزالة الموجه بنجاح.',
      });
      setDeleteDialogOpen(false);
      setMentorToDelete(null);
      fetchMentors(); // Refresh the list
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل في إزالة الموجه.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (mentor: Mentor) => {
    setMentorToEdit(mentor);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (mentor: Mentor) => {
    setMentorToDelete(mentor);
    setDeleteDialogOpen(true);
  };

  const openAvailabilityDialog = (mentor: Mentor) => {
    setMentorForAvailability(mentor);
    fetchMentorAvailability(mentor.id);
    setAvailabilityDialogOpen(true);
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getAvailabilityBadge = (availability?: string) => {
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
          <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="ml-2 h-4 w-4" />
                إضافة موجه جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إضافة موجه جديد</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل الموجه الجديد. سيتم إرسال دعوة له عبر البريد الإلكتروني.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMentor}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      الاسم
                    </Label>
                    <Input
                      id="name"
                      value={newMentor.name}
                      onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMentor.email}
                      onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="specialty" className="text-right">
                      التخصص
                    </Label>
                    <Input
                      id="specialty"
                      value={newMentor.specialty}
                      onChange={(e) => setNewMentor({ ...newMentor, specialty: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      رقم الجوال
                    </Label>
                    <Input
                      id="phone"
                      value={newMentor.phone}
                      onChange={(e) => setNewMentor({ ...newMentor, phone: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      كلمة المرور
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newMentor.password}
                      onChange={(e) => setNewMentor({ ...newMentor, password: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">إضافة الموجه</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
            <CardTitle className="text-sm font-medium">إجمالي الموجهين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentors.length}</div>
            <p className="text-xs text-muted-foreground">
              {mentors.filter(m => m.status === 'active').length} نشط، {mentors.filter(m => m.status === 'pending').length} بانتظار
            </p>
          </CardContent>
        </Card>
        {/* Other stat cards can be updated similarly */}
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
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="pending">بانتظار التفعيل</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
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
                  <TableCell className="font-medium">
                    <div>{mentor.name}</div>
                    <div className="text-sm text-gray-500">{mentor.email}</div>
                  </TableCell>
                  <TableCell>{mentor.specialty}</TableCell>
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
                    {mentor.rating && mentor.rating > 0 ? (
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
                        <DropdownMenuItem onSelect={() => setSelectedMentor(mentor)}>
                          <Users className="ml-2 h-4 w-4" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openEditDialog(mentor)}>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل المعلومات
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => openAvailabilityDialog(mentor)}>
                          <Clock className="ml-2 h-4 w-4" />
                          إدارة الوقت
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={() => openDeleteDialog(mentor)}
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
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

      {/* View Details Dialog */}
      <Dialog open={!!selectedMentor} onOpenChange={(isOpen) => !isOpen && setSelectedMentor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الموجه: {selectedMentor?.name}</DialogTitle>
            <DialogDescription>
              معلومات تفصيلية عن الموجه والفرق المعينة له.
            </DialogDescription>
          </DialogHeader>
          {selectedMentor && (
            <div className="space-y-4 py-4">
              {/* Details content here */}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Mentor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الموجه</DialogTitle>
            <DialogDescription>
              قم بتحديث معلومات الموجه.
            </DialogDescription>
          </DialogHeader>
          {mentorToEdit && (
            <form onSubmit={handleUpdateMentor}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    الاسم
                  </Label>
                  <Input
                    id="edit-name"
                    value={mentorToEdit.name}
                    onChange={(e) => setMentorToEdit({ ...mentorToEdit, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={mentorToEdit.email}
                    onChange={(e) => setMentorToEdit({ ...mentorToEdit, email: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-specialty" className="text-right">
                    التخصص
                  </Label>
                  <Input
                    id="edit-specialty"
                    value={mentorToEdit.specialty}
                    onChange={(e) => setMentorToEdit({ ...mentorToEdit, specialty: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    رقم الجوال
                  </Label>
                  <Input
                    id="edit-phone"
                    value={mentorToEdit.phone}
                    onChange={(e) => setMentorToEdit({ ...mentorToEdit, phone: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    الحالة
                  </Label>
                  <Select
                    value={mentorToEdit.status}
                    onValueChange={(value) => setMentorToEdit({ ...mentorToEdit, status: value as 'pending' | 'active' | 'inactive' })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="pending">بانتظار التفعيل</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">حفظ التغييرات</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Mentor Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد إزالة الموجه "{mentorToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteMentor}>
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Availability Dialog */}
      <Dialog open={isAvailabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>إدارة جدول توفر الموجه: {mentorForAvailability?.name}</DialogTitle>
            <DialogDescription>
              انقر على خانة زمنية لإضافتها، أو انقر على موعد موجود لإزالته.
            </DialogDescription>
          </DialogHeader>
          <div style={{ height: '70vh', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <BigCalendar
              localizer={localizer}
              events={availabilityEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['month', 'week', 'day']}
              defaultView="week"
              rtl={true}
              selectable
              onSelectSlot={(slotInfo) => setSlotToAdd(slotInfo)}
              onSelectEvent={(event) => setEventToDelete(event)}
              messages={messages}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvailabilityDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Availability Confirmation */}
      <Dialog open={!!slotToAdd} onOpenChange={() => setSlotToAdd(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة فترة توفر</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد إضافة فترة التوفر هذه؟
              <br />
              <strong>من:</strong> {slotToAdd?.start.toLocaleString()}
              <br />
              <strong>إلى:</strong> {slotToAdd?.end.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlotToAdd(null)}>
              إلغاء
            </Button>
            <Button onClick={handleAddAvailability}>تأكيد الإضافة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Availability Confirmation */}
      <Dialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إزالة فترة توفر</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد إزالة فترة التوفر هذه؟
              <br />
              <strong>من:</strong> {eventToDelete?.start.toLocaleString()}
              <br />
              <strong>إلى:</strong> {eventToDelete?.end.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventToDelete(null)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteAvailability}>
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
