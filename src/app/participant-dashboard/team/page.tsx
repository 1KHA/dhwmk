"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "../../../../components/ui/use-toast";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Checkbox } from "../../../../components/ui/checkbox";

// Define types for our data
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

interface TeamData {
  id: string;
  teamName: string;
  ideaName: string;
  status: string;
  challenge: string;
  ideaDescription: string;
  challengeReason: string;
  ideaSolution: string;
  ideaResults: string;
  ideaStage: string;
  hasParticipated: boolean;
  participationDetails: string | null;
  attachmentPath: string | null;
  participants: Participant[];
  currentUser: {
    id: string;
    isLeader: boolean;
  };
}

const initialParticipantState: Omit<Participant, 'id' | 'isLeader' | 'fullName'> = {
  firstName: '', secondName: '', familyName: '', nationalId: '', dob: '',
  email: '', phoneNumber: '', education: '', university: '', major: '',
  employmentStatus: '', nationality: '', residence: '', canAttend: false,
};

const fieldLabels: { [key in keyof typeof initialParticipantState]: string } = {
    firstName: 'الاسم الأول', secondName: 'الاسم الثاني', familyName: 'اسم العائلة',
    nationalId: 'رقم الهوية', dob: 'تاريخ الميلاد', email: 'البريد الإلكتروني',
    phoneNumber: 'رقم الهاتف', education: 'المؤهل التعليمي', university: 'الجامعة',
    major: 'التخصص', employmentStatus: 'الحالة الوظيفية', nationality: 'الجنسية',
    residence: 'منطقة الإقامة', canAttend: 'يمكنه الحضور؟',
};

export default function TeamManagementPage() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // State for modals
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editedParticipant, setEditedParticipant] = useState<Participant | null>(null);
  const [newParticipant, setNewParticipant] = useState(initialParticipantState);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/participant/team-details');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch team details');
      }
      const data: TeamData = await response.json();
      setTeamData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, []);

  const handleDeleteParticipant = async (participantId: string) => {
    try {
      const response = await fetch('/api/admin/delete-participant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId }),
      });
      if (response.ok) {
        toast({ title: "نجح", description: "تم حذف المشارك بنجاح" });
        fetchTeamDetails();
        setIsDeleteModalOpen(false);
      } else {
        const errorData = await response.json();
        toast({ title: "خطأ", description: errorData.error || "فشل الحذف", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحذف", variant: "destructive" });
    }
  };

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
      toast({ title: "تم التحديث بنجاح", description: "تم حفظ تغييرات المشارك." });
      fetchTeamDetails();
      setIsEditModalOpen(false);
    } catch (error) {
      toast({ title: "خطأ في التحديث", description: (error as Error).message, variant: "destructive" });
    }
  };

  const handleAddParticipant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await fetch('/api/participant/add-member', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newParticipant),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add member');
        }
        toast({ title: "تمت الإضافة بنجاح", description: "تمت إضافة العضو الجديد للفريق." });
        fetchTeamDetails();
        setIsAddModalOpen(false);
        setNewParticipant(initialParticipantState);
    } catch (error) {
        toast({ title: "خطأ في الإضافة", description: (error as Error).message, variant: "destructive" });
    }
  };

  if (loading) return <p className="text-center p-4">جاري تحميل بيانات الفريق...</p>;
  if (error) return <p className="text-center p-4 text-red-500">خطأ: {error}</p>;
  if (!teamData) return <p className="text-center p-4">لم يتم العثور على بيانات الفريق.</p>;

  const { currentUser } = teamData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">فريق: {teamData.teamName}</CardTitle>
            <CardDescription>تفاصيل الفريق والفكرة</CardDescription>
          </div>
          {currentUser.isLeader && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة عضو
            </Button>
          )}
        </CardHeader>
        <CardContent className="text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 border-t">
                <p><strong>اسم الفكرة:</strong> {teamData.ideaName}</p>
                <p><strong>التحدي:</strong> {teamData.challenge}</p>
                <p><strong>مرحلة الفكرة:</strong> {teamData.ideaStage}</p>
                <p><strong>حالة الفريق:</strong> {teamData.status}</p>
                <p className="col-span-2"><strong>وصف الفكرة:</strong> {teamData.ideaDescription}</p>
                <p className="col-span-2"><strong>سبب اختيار التحدي:</strong> {teamData.challengeReason}</p>
                <p className="col-span-2"><strong>الحل المقترح:</strong> {teamData.ideaSolution}</p>
                <p className="col-span-2"><strong>النتائج المتوقعة:</strong> {teamData.ideaResults}</p>
                <p><strong>هل شاركت الفكرة من قبل؟</strong> {teamData.hasParticipated ? 'نعم' : 'لا'}</p>
                {teamData.hasParticipated && <p><strong>تفاصيل المشاركة السابقة:</strong> {teamData.participationDetails}</p>}
                {teamData.attachmentPath && <p><strong>المرفقات:</strong> <a href={teamData.attachmentPath} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">عرض المرفق</a></p>}
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>أعضاء الفريق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-right font-semibold">الاسم الكامل</th>
                  <th className="p-3 text-right font-semibold">البريد الإلكتروني</th>
                  <th className="p-3 text-right font-semibold">رقم الهوية</th>
                  <th className="p-3 text-right font-semibold">تاريخ الميلاد</th>
                  <th className="p-3 text-right font-semibold">رقم الهاتف</th>
                  <th className="p-3 text-right font-semibold">المؤهل</th>
                  <th className="p-3 text-right font-semibold">الجامعة</th>
                  <th className="p-3 text-right font-semibold">التخصص</th>
                  <th className="p-3 text-right font-semibold">الحالة الوظيفية</th>
                  <th className="p-3 text-right font-semibold">الجنسية</th>
                  <th className="p-3 text-right font-semibold">الإقامة</th>
                  <th className="p-3 text-center font-semibold">يمكنه الحضور</th>
                  <th className="p-3 text-center font-semibold">قائد</th>
                  <th className="p-3 text-center font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {teamData.participants.map((participant) => {
                  const canEdit = currentUser.isLeader;
                  const canDelete = currentUser.isLeader && currentUser.id !== participant.id;

                  return (
                    <tr key={participant.id} className="border-t hover:bg-muted/20 whitespace-nowrap">
                      <td className="p-3">{participant.fullName}</td>
                      <td className="p-3">{participant.email}</td>
                      <td className="p-3">{participant.nationalId}</td>
                      <td className="p-3">{participant.dob}</td>
                      <td className="p-3">{participant.phoneNumber}</td>
                      <td className="p-3">{participant.education}</td>
                      <td className="p-3">{participant.university}</td>
                      <td className="p-3">{participant.major}</td>
                      <td className="p-3">{participant.employmentStatus}</td>
                      <td className="p-3">{participant.nationality}</td>
                      <td className="p-3">{participant.residence}</td>
                      <td className="p-3 text-center">{participant.canAttend ? 'نعم' : 'لا'}</td>
                      <td className="p-3 text-center">
                        {participant.isLeader && <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">نعم</span>}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          {canEdit && <button title="تعديل" onClick={() => { setSelectedParticipant(participant); setEditedParticipant(participant); setIsEditModalOpen(true); }} className="p-1 rounded-md hover:bg-muted"><Edit className="h-4 w-4" /></button>}
                          {canDelete && <button title="حذف" onClick={() => { setSelectedParticipant(participant); setIsDeleteModalOpen(true); }} className="p-1 rounded-md hover:bg-muted text-red-500"><Trash className="h-4 w-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Participant Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>تعديل المشارك: {selectedParticipant?.fullName}</DialogTitle></DialogHeader>
          {editedParticipant && (
            <form onSubmit={handleUpdateParticipant}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-right max-h-[70vh] overflow-y-auto p-2">
                {Object.keys(fieldLabels).map((key) => {
                    const fieldKey = key as keyof typeof initialParticipantState;
                    if (fieldKey === 'canAttend') return null;
                    return (
                        <div key={key}>
                            <Label htmlFor={key}>{fieldLabels[fieldKey]}</Label>
                            <Input id={key} value={editedParticipant[fieldKey] as string} onChange={(e) => setEditedParticipant({ ...editedParticipant, [key]: e.target.value })} className="w-full p-2 border rounded-md mt-1" />
                        </div>
                    )
                })}
                <div className="flex items-center space-x-2">
                    <Checkbox id="canAttend-edit" checked={editedParticipant.canAttend} onCheckedChange={(checked) => setEditedParticipant({ ...editedParticipant, canAttend: !!checked })} />
                    <Label htmlFor="canAttend-edit">{fieldLabels.canAttend}</Label>
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

      {/* Delete Participant Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>هل أنت متأكد أنك تريد حذف المشارك "{selectedParticipant?.fullName}"؟</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={() => selectedParticipant && handleDeleteParticipant(selectedParticipant.id)}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>إضافة عضو جديد</DialogTitle></DialogHeader>
          <form onSubmit={handleAddParticipant}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-right max-h-[70vh] overflow-y-auto p-2">
              {Object.keys(fieldLabels).map((key) => {
                const fieldKey = key as keyof typeof initialParticipantState;
                if (fieldKey === 'canAttend') return null;
                return (
                    <div key={key}>
                        <Label htmlFor={`add-${key}`}>{fieldLabels[fieldKey]}</Label>
                        <Input id={`add-${key}`} value={newParticipant[fieldKey] as string} onChange={(e) => setNewParticipant({ ...newParticipant, [key]: e.target.value })} className="w-full p-2 border rounded-md mt-1" required />
                    </div>
                )
              })}
              <div className="flex items-center space-x-2">
                <Checkbox id="canAttend-add" checked={newParticipant.canAttend} onCheckedChange={(checked) => setNewParticipant({ ...newParticipant, canAttend: !!checked })} />
                <Label htmlFor="canAttend-add">{fieldLabels.canAttend}</Label>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
              <Button type="submit">إضافة العضو</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
