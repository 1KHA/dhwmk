'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Briefcase, Calendar, Clock, UserCheck } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  phone: string;
  status: 'pending' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

function MentorProfile() {
  const searchParams = useSearchParams();
  const mentorId = searchParams.get('id');
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorId) {
      setError('Mentor ID is required.');
      setLoading(false);
      return;
    }

    const fetchMentor = async () => {
      try {
        const response = await fetch(`/api/admin/mentors?id=${mentorId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch mentor data');
        }
        const data = await response.json();
        setMentor(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [mentorId]);

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

  if (loading) {
    return <div className="p-8 text-center">جاري تحميل بيانات الموجه...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600" dir="rtl">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>خطأ</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mentor) {
    return (
        <div className="p-8 text-center" dir="rtl">
            <Card className="max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle>لم يتم العثور على الموجه</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>لم نتمكن من العثور على بيانات الموجه المطلوب.</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (mentor.status !== 'active') {
    return (
      <div className="p-8 text-center" dir="rtl">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>الحساب غير نشط</CardTitle>
          </CardHeader>
          <CardContent>
            <p>حساب الموجه هذا ليس نشطًا حاليًا. لا يمكن عرض الملف الشخصي.</p>
            <div className="mt-4">
                {getStatusBadge(mentor.status)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8" dir="rtl">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${mentor.name}`} />
            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-right">
            <CardTitle className="text-3xl font-bold">{mentor.name}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">{mentor.specialty}</CardDescription>
            <div className="mt-2">
                {getStatusBadge(mentor.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                <p className="font-medium">{mentor.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">رقم الجوال</p>
                <p className="font-medium">{mentor.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Briefcase className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">التخصص</p>
                <p className="font-medium">{mentor.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <UserCheck className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">الحالة</p>
                <p className="font-medium">
                    {mentor.status === 'active' ? 'نشط' : (mentor.status === 'pending' ? 'بانتظار التفعيل' : 'غير نشط')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الإنشاء</p>
                <p className="font-medium">{new Date(mentor.createdAt).toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">آخر تحديث</p>
                <p className="font-medium">{new Date(mentor.updatedAt).toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MentorProfilePage() {
    return (
        <Suspense fallback={<div className="p-8 text-center">جاري التحميل...</div>}>
            <MentorProfile />
        </Suspense>
    );
}
