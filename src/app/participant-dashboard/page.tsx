"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "../../../components/ui/use-toast";

// Define type for our data
interface Participant {
  id: string;
  firstName: string;
  secondName: string;
  familyName: string;
  nationalId: string;
  dob: string;
  email: string;
  phoneNumber: string;
  education: string;
  university: string;
  major: string;
  employmentStatus: string;
  nationality: string;
  residence: string;
  canAttend: boolean;
  isLeader: boolean;
  fullName?: string;
}

export default function ParticipantDashboardPage() {
  const [participantData, setParticipantData] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedParticipant, setEditedParticipant] = useState<Participant | null>(null);

  const fetchParticipantDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/participant/me');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch your details');
      }
      const data: Participant = await response.json();
      setParticipantData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipantDetails();
  }, []);

  const handleUpdateParticipant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editedParticipant) return;

    try {
      const response = await fetch('/api/admin/update-participant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedParticipant),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update participant');
      }
      
      toast({ title: "تم التحديث بنجاح", description: "تم حفظ بياناتك." });
      fetchParticipantDetails(); // Refresh data
      setIsEditModalOpen(false);
    } catch (error) {
      toast({ title: "خطأ في التحديث", description: (error as Error).message, variant: "destructive" });
    }
  };

  if (loading) return <p className="text-center p-4">جاري تحميل بياناتك...</p>;
  if (error) return <p className="text-center p-4 text-red-500">خطأ: {error}</p>;
  if (!participantData) return <p className="text-center p-4">لم يتم العثور على بياناتك.</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">ملفي الشخصي</CardTitle>
            <CardDescription>هنا يمكنك عرض وتعديل بياناتك الشخصية.</CardDescription>
          </div>
          <Button onClick={() => {
            setEditedParticipant(participantData);
            setIsEditModalOpen(true);
          }}>
            <Edit className="ml-2 h-4 w-4" />
            تعديل بياناتي
          </Button>
        </CardHeader>
        <CardContent className="text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 p-4">
                <p><strong>الاسم الكامل:</strong> {participantData.fullName}</p>
                <p><strong>البريد الإلكتروني:</strong> {participantData.email}</p>
                <p><strong>رقم الهوية:</strong> {participantData.nationalId}</p>
                <p><strong>تاريخ الميلاد:</strong> {participantData.dob}</p>
                <p><strong>رقم الجوال:</strong> {participantData.phoneNumber}</p>
                <p><strong>المؤهل التعليمي:</strong> {participantData.education}</p>
                <p><strong>الجامعة:</strong> {participantData.university}</p>
                <p><strong>التخصص:</strong> {participantData.major}</p>
                <p><strong>الحالة الوظيفية:</strong> {participantData.employmentStatus}</p>
                <p><strong>الجنسية:</strong> {participantData.nationality}</p>
                <p><strong>منطقة الإقامة:</strong> {participantData.residence}</p>
                <p><strong>يمكنه الحضور؟</strong> {participantData.canAttend ? 'نعم' : 'لا'}</p>
                <p><strong>قائد الفريق:</strong> {participantData.isLeader ? 'نعم' : 'لا'}</p>
            </div>
        </CardContent>
      </Card>

      {/* Edit Participant Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل بياناتي</DialogTitle>
          </DialogHeader>
          {editedParticipant && (
            <form onSubmit={handleUpdateParticipant}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-right max-h-[70vh] overflow-y-auto p-2">
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium">الاسم الأول</label>
                  <input id="firstName" value={editedParticipant.firstName} onChange={(e) => setEditedParticipant({ ...editedParticipant, firstName: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="secondName" className="text-sm font-medium">الاسم الثاني</label>
                  <input id="secondName" value={editedParticipant.secondName} onChange={(e) => setEditedParticipant({ ...editedParticipant, secondName: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="familyName" className="text-sm font-medium">اسم العائلة</label>
                  <input id="familyName" value={editedParticipant.familyName} onChange={(e) => setEditedParticipant({ ...editedParticipant, familyName: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                  <input id="email" type="email" value={editedParticipant.email} onChange={(e) => setEditedParticipant({ ...editedParticipant, email: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="text-sm font-medium">رقم الهاتف</label>
                  <input id="phoneNumber" value={editedParticipant.phoneNumber} onChange={(e) => setEditedParticipant({ ...editedParticipant, phoneNumber: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="nationalId" className="text-sm font-medium">رقم الهوية</label>
                  <input id="nationalId" value={editedParticipant.nationalId} onChange={(e) => setEditedParticipant({ ...editedParticipant, nationalId: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="major" className="text-sm font-medium">التخصص</label>
                  <input id="major" value={editedParticipant.major} onChange={(e) => setEditedParticipant({ ...editedParticipant, major: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="university" className="text-sm font-medium">الجامعة</label>
                  <input id="university" value={editedParticipant.university} onChange={(e) => setEditedParticipant({ ...editedParticipant, university: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                 <div>
                  <label htmlFor="education" className="text-sm font-medium">المؤهل التعليمي</label>
                  <input id="education" value={editedParticipant.education} onChange={(e) => setEditedParticipant({ ...editedParticipant, education: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="employmentStatus" className="text-sm font-medium">الحالة الوظيفية</label>
                  <input id="employmentStatus" value={editedParticipant.employmentStatus} onChange={(e) => setEditedParticipant({ ...editedParticipant, employmentStatus: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="nationality" className="text-sm font-medium">الجنسية</label>
                  <input id="nationality" value={editedParticipant.nationality} onChange={(e) => setEditedParticipant({ ...editedParticipant, nationality: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
                <div>
                  <label htmlFor="residence" className="text-sm font-medium">منطقة الإقامة</label>
                  <input id="residence" value={editedParticipant.residence} onChange={(e) => setEditedParticipant({ ...editedParticipant, residence: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>إلغاء</Button>
                <Button type="submit">حفظ التغييرات</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
