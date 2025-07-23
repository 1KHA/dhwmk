"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/ar'; // Import Arabic locale
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '../../../../components/ui/button';
import { useToast } from "../../../../components/ui/use-toast"

moment.locale('ar'); // Set moment to use Arabic
const localizer = momentLocalizer(moment);

interface Availability {
  id: string;
  start: Date;
  end: Date;
  title: string;
}

const AvailabilityPage = () => {
  const [events, setEvents] = useState<Availability[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const fetchAvailabilities = async () => {
    try {
      const response = await fetch('/api/mentor/availability', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        const formattedEvents = data.map((avail: any) => ({
          id: avail.id,
          start: new Date(avail.startTime),
          end: new Date(avail.endTime),
          title: 'متاح',
        }));
        setEvents(formattedEvents);
      } else if (response.status === 401) {
        toast({
          title: "غير مصرح",
          description: "يجب تسجيل الدخول لعرض هذه الصفحة. جاري التحويل...",
          variant: "destructive",
        });
        router.push('/login');
      } else {
        toast({
          title: "خطأ",
          description: "فشل في جلب أوقات التوافر.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب أوقات التوافر.",
        variant: "destructive",
      })
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const handleSelectSlot = async ({ start, end }: { start: Date; end: Date }) => {
    try {
      const response = await fetch('/api/mentor/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startTime: start, endTime: end }),
        credentials: 'include',
      });

      if (response.ok) {
        fetchAvailabilities();
        toast({
          title: "تم بنجاح",
          description: "تمت إضافة وقت التوافر بنجاح.",
        })
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إضافة وقت التوافر.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة وقت التوافر.",
        variant: "destructive",
      })
    }
  };

  const handleSelectEvent = async (event: Availability) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف وقت التوافر هذا؟')) {
      try {
        const response = await fetch(`/api/mentor/availability/${event.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          fetchAvailabilities();
          toast({
            title: "تم بنجاح",
            description: "تم حذف وقت التوافر بنجاح.",
          })
        } else {
          toast({
            title: "خطأ",
            description: "فشل في حذف وقت التوافر.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء حذف وقت التوافر.",
          variant: "destructive",
        })
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">إدارة أوقات التوافر الخاصة بك</h1>
      <p className="mb-4">انقر واسحب على التقويم لإنشاء فترات توافر جديدة. انقر على فترة موجودة لحذفها.</p>
      <div style={{ height: '70vh', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          defaultView="week"
          views={['day', 'week', 'agenda']}
        />
      </div>
    </div>
  );
};

export default AvailabilityPage;
