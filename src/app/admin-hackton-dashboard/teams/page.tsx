"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download, Trash, Edit, Eye, UserPlus, Check, X } from "lucide-react";
import { useToast } from "@/../../components/ui/use-toast";
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

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  specialty: string;
  isLeader: boolean;
}

interface Team {
  id: string;
  teamName: string;
  teamIdea: string;
  status: string;
  createdAt: string;
  participants: Participant[];
}

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTeam, setEditedTeam] = useState<{ teamName: string; teamIdea: string } | null>(null);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  // Fetch teams from API
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/admin/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب الفرق",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTeam = async (teamId: string) => {
    try {
      const response = await fetch('/api/admin/approve-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تمت الموافقة على الفريق وإنشاء الحسابات بنجاح",
        });
        fetchTeams(); // Refresh the list
      } else {
        const data = await response.json();
        toast({
          title: "خطأ",
          description: data.error || "فشل في الموافقة على الفريق",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الموافقة على الفريق",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const response = await fetch('/api/admin/delete-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم حذف الفريق بنجاح",
        });
        fetchTeams(); // Refresh the list
        setIsDeleteModalOpen(false);
      } else {
        toast({
          title: "خطأ",
          description: "فشل في حذف الفريق",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الفريق",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !editedTeam) return;

    try {
      const response = await fetch('/api/admin/update-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId: selectedTeam.id, ...editedTeam }),
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم تحديث الفريق بنجاح",
        });
        fetchTeams(); // Refresh the list
        setIsEditModalOpen(false);
      } else {
        toast({
          title: "خطأ",
          description: "فشل في تحديث الفريق",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الفريق",
        variant: "destructive",
      });
    }
  };

  const handleRejectTeam = async (teamId: string) => {
    try {
      const response = await fetch('/api/admin/reject-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم رفض الفريق بنجاح",
        });
        fetchTeams(); // Refresh the list
      } else {
        toast({
          title: "خطأ",
          description: "فشل في رفض الفريق",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء رفض الفريق",
        variant: "destructive",
      });
    }
  };

  // Filter teams based on search query and selected filter
  const filteredTeams = teams.filter((team) => {
    const leader = team.participants.find(p => p.isLeader);
    const matchesSearch =
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.teamIdea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (leader && leader.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "approved" && team.status === "approved") ||
      (selectedFilter === "pending" && team.status === "pending") ||
      (selectedFilter === "rejected" && team.status === "rejected");

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الفرق</h1>
        <Button onClick={() => window.location.href = '/register-team'}>
          <Plus className="ml-2 h-4 w-4" />
          إنشاء فريق
        </Button>
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
                placeholder="البحث عن الفرق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 py-2 pr-10 pl-4 rounded-md border border-input bg-background"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="all">جميع الفرق</option>
                <option value="approved">المعتمدة</option>
                <option value="pending">قيد الانتظار</option>
                <option value="rejected">المرفوضة</option>
              </select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                تصفية
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                تصدير
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-right">اسم الفريق</th>
                  <th className="border p-2 text-right">الأعضاء</th>
                  <th className="border p-2 text-right">قائد الفريق</th>
                  <th className="border p-2 text-right">فكرة المشروع</th>
                  <th className="border p-2 text-right">الحالة</th>
                  <th className="border p-2 text-right">تاريخ الإنشاء</th>
                  <th className="border p-2 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => {
                  const leader = team.participants.find(p => p.isLeader);
                  return (
                    <React.Fragment key={team.id}>
                      <tr className="hover:bg-muted/50">
                        <td className="border p-2">{team.teamName}</td>
                        <td className="border p-2">
                        {team.status === 'pending' ? (
                          <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                          >
                            {team.participants.length} (عرض التفاصيل)
                          </Button>
                        ) : (
                          team.participants.length
                        )}
                      </td>
                      <td className="border p-2">{leader?.fullName || 'غير متوفر'}</td>
                      <td className="border p-2">
                        <div className="max-w-xs truncate" title={team.teamIdea}>
                          {team.teamIdea}
                        </div>
                      </td>
                      <td className="border p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            team.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : team.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {team.status === "approved" ? "معتمد" : 
                           team.status === "rejected" ? "مرفوض" : "قيد الانتظار"}
                        </span>
                      </td>
                      <td className="border p-2">
                        {new Date(team.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="border p-2">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="p-1 rounded-md hover:bg-muted"
                            title="عرض التفاصيل"
                            onClick={() => {
                              setSelectedTeam(team);
                              setIsViewModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {team.status === "pending" && (
                            <>
                              <button 
                                className="p-1 rounded-md hover:bg-muted text-green-600"
                                title="الموافقة على الفريق"
                                onClick={() => handleApproveTeam(team.id)}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-1 rounded-md hover:bg-muted text-red-600"
                                title="رفض الفريق"
                                onClick={() => handleRejectTeam(team.id)}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            className="p-1 rounded-md hover:bg-muted"
                            onClick={() => {
                              setSelectedTeam(team);
                              setEditedTeam({ teamName: team.teamName, teamIdea: team.teamIdea });
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 rounded-md hover:bg-muted text-red-500"
                            onClick={() => {
                              setSelectedTeam(team);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                        </td>
                      </tr>
                      {expandedTeam === team.id && (
                        <tr className="bg-muted/20">
                          <td colSpan={7} className="p-0">
                            <div className="p-4">
                              <h4 className="font-bold mb-2">أعضاء الفريق:</h4>
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-muted/50">
                                    <th className="p-2 text-right font-semibold">الاسم الكامل</th>
                                    <th className="p-2 text-right font-semibold">البريد الإلكتروني</th>
                                    <th className="p-2 text-right font-semibold">رقم الهاتف</th>
                                    <th className="p-2 text-right font-semibold">التخصص</th>
                                    <th className="p-2 text-center font-semibold">قائد الفريق</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {team.participants.map(p => (
                                    <tr key={p.id} className="border-t">
                                      <td className="p-2">{p.fullName}</td>
                                      <td className="p-2">{p.email}</td>
                                      <td className="p-2">{p.phoneNumber}</td>
                                      <td className="p-2">{p.specialty}</td>
                                      <td className="p-2 text-center">
                                        {p.isLeader ? (
                                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                            نعم
                                          </span>
                                        ) : "لا"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTeams.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لم يتم العثور على فرق
            </div>
          )}

          <div className="mt-4 text-sm text-muted-foreground text-center">
            إجمالي الفرق: {teams.length} | المعروضة: {filteredTeams.length}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إحصائيات الفرق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">{teams.length}</h3>
              <p className="text-muted-foreground">إجمالي الفرق</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.filter((team) => team.status === "approved").length}
              </h3>
              <p className="text-muted-foreground">الفرق المعتمدة</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.filter((team) => team.status === "pending").length}
              </h3>
              <p className="text-muted-foreground">قيد الانتظار</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.filter((team) => team.status === "rejected").length}
              </h3>
              <p className="text-muted-foreground">المرفوضة</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Team Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تفاصيل الفريق: {selectedTeam?.teamName}</DialogTitle>
          </DialogHeader>
          {selectedTeam && (
            <div>
              <p><strong>فكرة المشروع:</strong> {selectedTeam.teamIdea}</p>
              <p><strong>الحالة:</strong> {selectedTeam.status}</p>
              <h4 className="font-bold mt-4">الأعضاء:</h4>
              <ul>
                {selectedTeam.participants.map(p => (
                  <li key={p.id}>{p.fullName} ({p.email}) {p.isLeader && <strong>(قائد)</strong>}</li>
                ))}
              </ul>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد حذف فريق "{selectedTeam?.teamName}"؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={() => selectedTeam && handleDeleteTeam(selectedTeam.id)}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الفريق: {selectedTeam?.teamName}</DialogTitle>
          </DialogHeader>
          {editedTeam && (
            <form onSubmit={handleUpdateTeam}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="teamName" className="text-right">
                    اسم الفريق
                  </label>
                  <input
                    id="teamName"
                    value={editedTeam.teamName}
                    onChange={(e) => setEditedTeam({ ...editedTeam, teamName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="teamIdea" className="text-right">
                    فكرة المشروع
                  </label>
                  <textarea
                    id="teamIdea"
                    value={editedTeam.teamIdea}
                    onChange={(e) => setEditedTeam({ ...editedTeam, teamIdea: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
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
