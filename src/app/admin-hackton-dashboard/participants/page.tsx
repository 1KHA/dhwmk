"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download, Trash, Edit, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "../../../../components/ui/use-toast";


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
  // Computed
  fullName?: string;
}

interface Team {
  id: string;
  teamName: string;
  ideaName: string;
  status: string;
  participants: Participant[];
}

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("approved");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();


  // State for modals
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedParticipant, setEditedParticipant] = useState<Participant | null>(null);

  const handleDeleteParticipant = async (participantId: string) => {
    try {
      const response = await fetch('/api/admin/delete-participant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantId }),
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف المشارك بنجاح",
        });
        // Refresh the list by filtering out the deleted participant
        setTeams(prevTeams =>
          prevTeams.map(team => ({
            ...team,
            participants: team.participants.filter(p => p.id !== participantId),
          })).filter(team => team.participants.length > 0) // Optional: remove team if no participants left
        );
        setIsDeleteModalOpen(false);
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف المشارك",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المشارك",
        variant: "destructive",
      });
    }
  };

  const handleUpdateParticipant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editedParticipant) return;

    try {
      const response = await fetch('/api/admin/update-participant', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedParticipant),
      });

      if (!response.ok) {
        throw new Error('Failed to update participant');
      }

      const updatedParticipant = await response.json();

      // Update the state
      setTeams(prevTeams =>
        prevTeams.map(team => ({
          ...team,
          participants: team.participants.map(p =>
            p.id === updatedParticipant.id ? updatedParticipant : p
          ),
        }))
      );

      toast({ title: "تم التحديث بنجاح", description: "تم حفظ تغييرات المشارك." });
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "فشل حفظ تغييرات المشارك. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      console.error("Failed to update participant:", error);
    }
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/teams');
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const allTeams: Team[] = await response.json();
        // Add computed fullName to each participant
        const teamsWithComputedNames = allTeams.map(team => ({
          ...team,
          participants: team.participants.map(p => ({
            ...p,
            fullName: `${p.firstName} ${p.secondName} ${p.familyName}`,
          })),
        }));
        setTeams(teamsWithComputedNames);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Filter teams based on search query and selected status
  const filteredTeams = teams
    .filter(team => selectedStatus === "all" || team.status === selectedStatus)
    .filter(team =>
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.ideaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.participants.some(p => p.fullName && p.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">معتمد</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">قيد المراجعة</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">مرفوض</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الفرق والمشاركون</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الفرق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="بحث عن فريق أو مشارك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 py-2 pr-10 pl-4 rounded-md border border-input bg-background text-right"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-right"
              >
                <option value="all">جميع الحالات</option>
                <option value="approved">معتمد</option>
                <option value="pending">قيد المراجعة</option>
                <option value="rejected">مرفوض</option>
              </select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                تصدير الكل
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-center p-4">جاري تحميل البيانات...</p>
          ) : error ? (
            <p className="text-center p-4 text-red-500">{error}</p>
          ) : filteredTeams.length > 0 ? (
            <div className="space-y-8">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{team.teamName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{team.ideaName}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(team.status)}
                        <Button variant="outline" size="sm" className="gap-1">
                          <Download className="h-3 w-3" />
                          تصدير الفريق
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/20">
                          <tr>
                            <th className="p-3 text-right font-semibold">الاسم الكامل</th>
                            <th className="p-3 text-right font-semibold">البريد الإلكتروني</th>
                            <th className="p-3 text-right font-semibold">رقم الهوية</th>
                            <th className="p-3 text-right font-semibold">التخصص</th>
                            <th className="p-3 text-right font-semibold">الجامعة</th>
                            <th className="p-3 text-center font-semibold">قائد الفريق</th>
                            <th className="p-3 text-center font-semibold">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team.participants.map((participant) => (
                            <tr key={participant.id} className="border-t hover:bg-muted/20">
                              <td className="p-3">{participant.fullName}</td>
                              <td className="p-3">{participant.email}</td>
                              <td className="p-3">{participant.nationalId}</td>
                              <td className="p-3">{participant.major}</td>
                              <td className="p-3">{participant.university}</td>
                              <td className="p-3 text-center">
                                {participant.isLeader && (
                                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    نعم
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2 justify-center">
                                  <button
                                    className="p-1 rounded-md hover:bg-muted"
                                    title="عرض التفاصيل"
                                    onClick={() => {
                                      setSelectedParticipant(participant);
                                      setIsViewModalOpen(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="p-1 rounded-md hover:bg-muted"
                                    title="تعديل"
                                    onClick={() => {
                                      setSelectedParticipant(participant);
                                      setEditedParticipant(participant);
                                      setIsEditModalOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="p-1 rounded-md hover:bg-muted text-red-500"
                                    title="حذف"
                                    onClick={() => {
                                      setSelectedParticipant(participant);
                                      setIsDeleteModalOpen(true);
                                    }}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center p-4">لا توجد فرق لعرضها.</p>
          )}

          <div className="mt-4 text-sm text-muted-foreground text-center">
            إجمالي الفرق: {teams.length} | تم العرض: {filteredTeams.length}
          </div>
        </CardContent>
      </Card>

      {/* View Participant Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل المشارك: {selectedParticipant?.fullName}</DialogTitle>
          </DialogHeader>
          {selectedParticipant && (
            <div className="space-y-4 p-4 max-h-[70vh] overflow-y-auto text-right">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <p><strong>الاسم الكامل:</strong> {selectedParticipant.fullName}</p>
                  <p><strong>البريد الإلكتروني:</strong> {selectedParticipant.email}</p>
                  <p><strong>رقم الهوية:</strong> {selectedParticipant.nationalId}</p>
                  <p><strong>تاريخ الميلاد:</strong> {selectedParticipant.dob}</p>
                  <p><strong>رقم الجوال:</strong> {selectedParticipant.phoneNumber}</p>
                  <p><strong>المؤهل التعليمي:</strong> {selectedParticipant.education}</p>
                  <p><strong>الجامعة:</strong> {selectedParticipant.university}</p>
                  <p><strong>التخصص:</strong> {selectedParticipant.major}</p>
                  <p><strong>الحالة الوظيفية:</strong> {selectedParticipant.employmentStatus}</p>
                  <p><strong>الجنسية:</strong> {selectedParticipant.nationality}</p>
                  <p><strong>منطقة الإقامة:</strong> {selectedParticipant.residence}</p>
                  <p><strong>يمكنه الحضور؟</strong> {selectedParticipant.canAttend ? 'نعم' : 'لا'}</p>
                  <p><strong>قائد الفريق:</strong> {selectedParticipant.isLeader ? 'نعم' : 'لا'}</p>
                </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Participant Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل المشارك: {selectedParticipant?.fullName}</DialogTitle>
          </DialogHeader>
          {editedParticipant && (
            <form onSubmit={handleUpdateParticipant}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-right max-h-[70vh] overflow-y-auto p-2">
                {/* We can't edit fullName directly, it's composed of parts */}
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
            <DialogDescription>
              هل أنت متأكد أنك تريد حذف المشارك "{selectedParticipant?.fullName}"؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={() => selectedParticipant && handleDeleteParticipant(selectedParticipant.id)}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
