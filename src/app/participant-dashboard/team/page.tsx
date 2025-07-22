"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Plus, Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Progress } from "../../../../components/ui/progress";

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

  if (loading) return (
    <div className="space-y-4 p-8 text-center">
      <Progress value={40} className="w-full max-w-xl mx-auto" />
      <div className="flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p>جاري تحميل بيانات الفريق...</p>
      </div>
    </div>
  );

  if (error) return (
    <Alert variant="destructive" className="mx-auto max-w-2xl m-4">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );

  if (!teamData) return (
    <Alert className="mx-auto max-w-2xl m-4">
      <AlertDescription>لم يتم العثور على بيانات الفريق.</AlertDescription>
    </Alert>
  );

  const { currentUser } = teamData;

  return (
    <div className="space-y-6 p-4">
      <Tabs defaultValue="team-info" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="team-info">معلومات الفريق</TabsTrigger>
          <TabsTrigger value="members">الأعضاء</TabsTrigger>
        </TabsList>

        <TabsContent value="team-info" className="mt-6">
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
        <CardContent>
            <div className="space-y-6 text-right" dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/10">
                    <div className="space-y-2">
                        <Label>اسم الفكرة</Label>
                        <p className="font-medium">{teamData.ideaName}</p>
                    </div>
                    <div className="space-y-2">
                        <Label>التحدي</Label>
                        <p className="font-medium">{teamData.challenge}</p>
                    </div>
                    <div className="space-y-2">
                        <Label>مرحلة الفكرة</Label>
                        <p className="font-medium">{teamData.ideaStage}</p>
                    </div>
                    <div className="space-y-2">
                        <Label>حالة الفريق</Label>
                        <p className="font-medium">{teamData.status}</p>
                    </div>
                </div>

                <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                    <div className="space-y-2">
                        <Label>وصف الفكرة</Label>
                        <p className="font-medium leading-relaxed">{teamData.ideaDescription}</p>
                    </div>
                    <div className="space-y-2">
                        <Label>سبب اختيار التحدي</Label>
                        <p className="font-medium leading-relaxed">{teamData.challengeReason}</p>
                    </div>
                    <div className="space-y-2">
                        <Label>الحل المقترح</Label>
                        <p className="font-medium leading-relaxed">{teamData.ideaSolution}</p>
                    </div>
                    <div className="space-y-2">
                        <Label>النتائج المتوقعة</Label>
                        <p className="font-medium leading-relaxed">{teamData.ideaResults}</p>
                    </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/10">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>هل شاركت الفكرة من قبل؟</Label>
                            <span className="font-medium">{teamData.hasParticipated ? 'نعم' : 'لا'}</span>
                        </div>
                        {teamData.hasParticipated && (
                            <div className="space-y-2">
                                <Label>تفاصيل المشاركة السابقة</Label>
                                <p className="font-medium">{teamData.participationDetails}</p>
                            </div>
                        )}
                        {teamData.attachmentPath && (
                            <div className="space-y-2">
                                <Label>المرفقات</Label>
                                <div>
                                    <Button variant="link" asChild className="p-0 h-auto font-medium">
                                        <a href={teamData.attachmentPath} target="_blank" rel="noopener noreferrer">
                                            عرض المرفق
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>أعضاء الفريق</CardTitle>
          {currentUser.isLeader && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة عضو
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border" dir="rtl">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-right font-medium text-muted-foreground">الاسم الكامل</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">البريد الإلكتروني</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">رقم الهوية</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">تاريخ الميلاد</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">رقم الهاتف</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">المؤهل</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">الجامعة</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">التخصص</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">الحالة الوظيفية</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">الجنسية</th>
                  <th className="p-4 text-right font-medium text-muted-foreground">الإقامة</th>
                  <th className="p-4 text-center font-medium text-muted-foreground">يمكنه الحضور</th>
                  <th className="p-4 text-center font-medium text-muted-foreground">قائد</th>
                  <th className="p-4 text-center font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {teamData.participants.map((participant) => {
                  const canEdit = currentUser.isLeader;
                  const canDelete = currentUser.isLeader && currentUser.id !== participant.id;

                  return (
                    <tr key={participant.id} className="border-t hover:bg-muted/10 transition-colors">
                      <td className="p-4 text-right">{participant.fullName}</td>
                      <td className="p-4 text-right">{participant.email}</td>
                      <td className="p-4 text-right">{participant.nationalId}</td>
                      <td className="p-4 text-right">{participant.dob}</td>
                      <td className="p-4 text-right">{participant.phoneNumber}</td>
                      <td className="p-4 text-right">{participant.education}</td>
                      <td className="p-4 text-right">{participant.university}</td>
                      <td className="p-4 text-right">{participant.major}</td>
                      <td className="p-4 text-right">{participant.employmentStatus}</td>
                      <td className="p-4 text-right">{participant.nationality}</td>
                      <td className="p-4 text-right">{participant.residence}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${participant.canAttend ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {participant.canAttend ? 'نعم' : 'لا'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {participant.isLeader && (
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">قائد</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="حذف"
                              onClick={() => {
                                setSelectedParticipant(participant);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
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
        </TabsContent>
      </Tabs>

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
                    <Checkbox id="canAttend-edit" checked={editedParticipant.canAttend} onCheckedChange={(checked: boolean) => setEditedParticipant({ ...editedParticipant, canAttend: checked })} />
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
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">تأكيد الحذف</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              هل أنت متأكد أنك تريد حذف المشارك "{selectedParticipant?.fullName}"؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>إلغاء</Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedParticipant && handleDeleteParticipant(selectedParticipant.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">إضافة عضو جديد</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              أدخل معلومات العضو الجديد في الفريق
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddParticipant}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 max-h-[70vh] overflow-y-auto px-4">
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
                <Checkbox id="canAttend-add" checked={newParticipant.canAttend} onCheckedChange={(checked: boolean) => setNewParticipant({ ...newParticipant, canAttend: checked })} />
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
