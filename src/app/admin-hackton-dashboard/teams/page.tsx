"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download, Trash, Edit, Eye, UserPlus, Check, X, Users } from "lucide-react";
import { useToast } from "@/../../components/ui/use-toast";
import * as XLSX from 'xlsx';
import AutoTeamCreationModal from "@/../../components/admin/AutoTeamCreationModal";
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
  gender?: string; // Added gender field
  // Computed property
  fullName?: string; 
}

interface Team {
  id: string;
  teamName: string;
  status: string;
  challenge: string;
  challengeReason: string;
  ideaName: string;
  ideaDescription: string;
  ideaSolution: string;
  ideaResults: string;
  ideaStage: string;
  hackathonTrack: string | null;
  attachmentsLink: string | null;
  hasParticipated: boolean;
  participationDetails: string | null;
  attachmentPath: string | null;
  createdAt: string;
  participants: Participant[];
}

export default function TeamsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAutoTeamModalOpen, setIsAutoTeamModalOpen] = useState(false);
  const [editedTeam, setEditedTeam] = useState<Partial<Team> | null>(null);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  
  // Advanced filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [trackFilter, setTrackFilter] = useState<string>("");
  const [teamTypeFilter, setTeamTypeFilter] = useState<string>("");

  // Fetch teams from API
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/admin/teams');
      if (response.ok) {
        const data = await response.json();
        // Add computed fullName to each participant
        const teamsWithComputedNames = data.map((team: Team) => ({
          ...team,
          participants: team.participants.map((p: Participant) => ({
            ...p,
            fullName: `${p.firstName} ${p.secondName} ${p.familyName}`,
          })),
        }));
        setTeams(teamsWithComputedNames);
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

  // Function to handle exporting teams data to Excel
  const handleExportToExcel = () => {
    try {
      // Create a worksheet with all teams data
      const worksheet = XLSX.utils.json_to_sheet(
        teams.map(team => {
          const leader = team.participants.find(p => p.isLeader);
          return {
            'اسم الفريق': team.teamName,
            'اسم الفكرة': team.ideaName,
            'المسار': team.hackathonTrack || '',
            'التحدي': team.challenge,
            'مرحلة الفكرة': team.ideaStage,
            'الحالة': team.status === "approved" ? "معتمد" : 
                     team.status === "rejected" ? "مرفوض" : "قيد الانتظار",
            'تاريخ الإنشاء': new Date(team.createdAt).toLocaleDateString('ar-SA'),
            'عدد الأعضاء': team.participants.length,
            'قائد الفريق': leader?.fullName || '',
            'بريد قائد الفريق': leader?.email || '',
            'رقم هوية قائد الفريق': leader?.nationalId || '',
            'وصف الفكرة': team.ideaDescription,
            'الحل المقترح': team.ideaSolution,
            'النتائج المتوقعة': team.ideaResults,
            'هل شاركت الفكرة من قبل؟': team.hasParticipated ? 'نعم' : 'لا',
            'تفاصيل المشاركة السابقة': team.participationDetails || '',
          };
        })
      );

      // Create a worksheet for participants
      const participantsData = teams.flatMap(team => 
        team.participants.map(p => ({
          'اسم الفريق': team.teamName,
          'الاسم الكامل': p.fullName || `${p.firstName} ${p.secondName} ${p.familyName}`,
          'البريد الإلكتروني': p.email,
          'رقم الهوية': p.nationalId,
          'تاريخ الميلاد': p.dob,
          'رقم الجوال': p.phoneNumber,
          'المؤهل التعليمي': p.education,
          'الجامعة': p.university,
          'التخصص': p.major,
          'الحالة الوظيفية': p.employmentStatus,
          'الجنسية': p.nationality,
          'منطقة الإقامة': p.residence,
          'يمكنه الحضور؟': p.canAttend ? 'نعم' : 'لا',
          'قائد الفريق؟': p.isLeader ? 'نعم' : 'لا',
        }))
      );
      const participantsWorksheet = XLSX.utils.json_to_sheet(participantsData);

      // Create a workbook with both worksheets
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "الفرق");
      XLSX.utils.book_append_sheet(workbook, participantsWorksheet, "الأعضاء");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "بيانات_الفرق.xlsx");

      toast({
        title: "نجح",
        description: "تم تصدير بيانات الفرق بنجاح",
      });
    } catch (error) {
      console.error('Error exporting teams:', error);
      toast({
        title: "خطأ",
        description: "فشل في تصدير بيانات الفرق",
        variant: "destructive",
      });
    }
  };

  // Static list of Arabic tracks as requested
  const ARABIC_TRACKS = [
    "إحياء اللغة العربية بحلول رقمية مبتكرة",
    "تحسين جودة الحياة لكبار السن والمكفوفين",
    "تطوير كفاءة العاملين بقطاع السياحة الدينية (الحج والعمرة)"
  ];

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter([]);
    setTrackFilter("");
    setTeamTypeFilter("");
    setIsFilterModalOpen(false);
  };

  // Apply filters
  const applyFilters = () => {
    setIsFilterModalOpen(false);
  };

  // Filter teams based on search query and all filters
  const filteredTeams = teams.filter((team) => {
    const leader = team.participants.find(p => p.isLeader);
    const matchesSearch =
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.ideaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (leader && leader.fullName && leader.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

    // Basic status filter (dropdown)
    const matchesBasicFilter =
      selectedFilter === "all" ||
      (selectedFilter === "approved" && team.status === "approved") ||
      (selectedFilter === "pending" && team.status === "pending") ||
      (selectedFilter === "rejected" && team.status === "rejected");

    // Advanced filters (from filter modal)
    const matchesStatusFilter = 
      statusFilter.length === 0 || statusFilter.includes(team.status);
    
    const matchesTrackFilter = 
      trackFilter === "" || team.hackathonTrack === trackFilter;
    
    const matchesTeamTypeFilter = 
      teamTypeFilter === "" || 
      (teamTypeFilter === "team" && team.participants.length > 1) ||
      (teamTypeFilter === "individual" && team.participants.length === 1);

    return matchesSearch && matchesBasicFilter && matchesStatusFilter && 
           matchesTrackFilter && matchesTeamTypeFilter;
  });

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الفرق</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/admin-hackton-dashboard/teams/create')}>
            <Plus className="ml-2 h-4 w-4" />
            إنشاء فريق
          </Button>
          <Button variant="outline" onClick={() => setIsAutoTeamModalOpen(true)}>
            <Users className="ml-2 h-4 w-4" />
            إضافة فريق من المشاركين
          </Button>
        </div>
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
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={() => setIsFilterModalOpen(true)}
              >
                <Filter className="h-4 w-4" />
                تصفية
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExportToExcel}>
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
                  <th className="border p-2 text-right">اسم الفكرة</th>
                  <th className="border p-2 text-right">المسار</th>
                  <th className="border p-2 text-right">الأعضاء</th>
                  <th className="border p-2 text-right">قائد الفريق</th>
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
                        <td className="border p-2">{team.ideaName}</td>
                        <td className="border p-2">{team.hackathonTrack}</td>
                        <td className="border p-2">
                          <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                          >
                            {team.participants.length} (عرض)
                          </Button>
                        </td>
                        <td className="border p-2">{leader?.fullName || 'غير متوفر'}</td>
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
                              setEditedTeam({ teamName: team.teamName, ideaName: team.ideaName });
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
                          <td colSpan={8} className="p-0">
                            <div className="p-4">
                              <h4 className="font-bold mb-2">أعضاء الفريق:</h4>
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-muted/50">
                                    <th className="p-2 text-right font-semibold">الاسم الكامل</th>
                                    <th className="p-2 text-right font-semibold">البريد الإلكتروني</th>
                                    <th className="p-2 text-right font-semibold">رقم الهوية</th>
                                    <th className="p-2 text-right font-semibold">التخصص</th>
                                    <th className="p-2 text-right font-semibold">الجامعة</th>
                                    <th className="p-2 text-center font-semibold">قائد الفريق</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {team.participants.map(p => (
                                    <tr key={p.id} className="border-t">
                                      <td className="p-2">{p.fullName}</td>
                                      <td className="p-2">{p.email}</td>
                                      <td className="p-2">{p.nationalId}</td>
                                      <td className="p-2">{p.major}</td>
                                      <td className="p-2">{p.university}</td>
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

          {/* Total Registered Users */}
          <h3 className="text-lg font-semibold mt-8 mb-4">إحصائيات المستخدمين</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.reduce((sum, team) => sum + team.participants.length, 0)}
              </h3>
              <p className="text-muted-foreground">إجمالي المستخدمين المسجلين</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.filter(team => team.participants.length > 1)
                  .reduce((sum, team) => sum + team.participants.length, 0)}
              </h3>
              <p className="text-muted-foreground">المشاركين ضمن فرق</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.filter(team => team.participants.length === 1).length}
              </h3>
              <p className="text-muted-foreground">المشاركين الفرديين</p>
            </div>
          </div>

          {/* Gender Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.flatMap(team => team.participants)
                  .filter(p => p.gender === "male" || p.gender === "ذكر").length}
              </h3>
              <p className="text-muted-foreground">الذكور</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.flatMap(team => team.participants)
                  .filter(p => p.gender === "female" || p.gender === "أنثى").length}
              </h3>
              <p className="text-muted-foreground">الإناث</p>
            </div>
          </div>

          {/* Teams per Track */}
          <h3 className="text-lg font-semibold mb-4">الفرق حسب المسار</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ARABIC_TRACKS.map(track => (
              <div key={track} className="bg-muted p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold">
                  {teams.filter(team => team.hackathonTrack === track).length}
                </h3>
                <p className="text-muted-foreground" title={track}>
                  {track.length > 30 ? `${track.substring(0, 30)}...` : track}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Team Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الفريق: {selectedTeam?.teamName}</DialogTitle>
          </DialogHeader>
          {selectedTeam && (
            <div className="space-y-6 max-h-[80vh] overflow-y-auto p-4 text-right">
              {/* Team Details */}
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-2">تفاصيل الفريق</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <p><strong>اسم الفريق:</strong> {selectedTeam.teamName}</p>
                  <p><strong>اسم الفكرة:</strong> {selectedTeam.ideaName}</p>
                  <p><strong>المسار:</strong> {selectedTeam.hackathonTrack}</p>
                  <p><strong>التحدي:</strong> {selectedTeam.challenge}</p>
                  <p><strong>مرحلة الفكرة:</strong> {selectedTeam.ideaStage}</p>
                  <p className="col-span-2"><strong>سبب اختيار التحدي:</strong> {selectedTeam.challengeReason}</p>
                  <p className="col-span-2"><strong>وصف الفكرة:</strong> {selectedTeam.ideaDescription}</p>
                  <p className="col-span-2"><strong>الحل المقترح:</strong> {selectedTeam.ideaSolution}</p>
                  <p className="col-span-2"><strong>النتائج المتوقعة:</strong> {selectedTeam.ideaResults}</p>
                  <p><strong>هل شاركت الفكرة من قبل؟</strong> {selectedTeam.hasParticipated ? 'نعم' : 'لا'}</p>
                  {selectedTeam.hasParticipated && <p><strong>تفاصيل المشاركة:</strong> {selectedTeam.participationDetails}</p>}
                  {selectedTeam.attachmentPath && <p><strong>المرفقات:</strong> <a href={selectedTeam.attachmentPath} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">عرض المرفق</a></p>}
                </div>
              </div>

              {/* Participants Details */}
              <div>
                <h3 className="text-lg font-semibold mb-2">الأعضاء</h3>
                <div className="space-y-4">
                  {selectedTeam.participants.map((p, index) => (
                    <div key={p.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{p.isLeader ? 'قائد الفريق' : `العضو ${index}`}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                        <p><strong>الاسم الكامل:</strong> {p.fullName}</p>
                        <p><strong>البريد الإلكتروني:</strong> {p.email}</p>
                        <p><strong>رقم الهوية:</strong> {p.nationalId}</p>
                        <p><strong>تاريخ الميلاد:</strong> {p.dob}</p>
                        <p><strong>رقم الجوال:</strong> {p.phoneNumber}</p>
                        <p><strong>المؤهل التعليمي:</strong> {p.education}</p>
                        <p><strong>الجامعة:</strong> {p.university}</p>
                        <p><strong>التخصص:</strong> {p.major}</p>
                        <p><strong>الحالة الوظيفية:</strong> {p.employmentStatus}</p>
                        <p><strong>الجنسية:</strong> {p.nationality}</p>
                        <p><strong>منطقة الإقامة:</strong> {p.residence}</p>
                        <p><strong>يمكنه الحضور؟</strong> {p.canAttend ? 'نعم' : 'لا'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
                    value={editedTeam.teamName || ''}
                    onChange={(e) => setEditedTeam({ ...editedTeam, teamName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="ideaName" className="text-right">
                    فكرة المشروع
                  </label>
                  <textarea
                    id="ideaName"
                    value={editedTeam.ideaName || ''}
                    onChange={(e) => setEditedTeam({ ...editedTeam, ideaName: e.target.value })}
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

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تصفية الفرق</DialogTitle>
            <DialogDescription>
              حدد معايير التصفية لعرض الفرق المطلوبة
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Status Filter */}
            <div className="space-y-2">
              <h3 className="font-medium text-right">الحالة</h3>
              <div className="flex flex-wrap gap-2 justify-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilter.includes("approved")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setStatusFilter([...statusFilter, "approved"]);
                      } else {
                        setStatusFilter(statusFilter.filter(s => s !== "approved"));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>معتمد</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilter.includes("pending")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setStatusFilter([...statusFilter, "pending"]);
                      } else {
                        setStatusFilter(statusFilter.filter(s => s !== "pending"));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>قيد الانتظار</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilter.includes("rejected")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setStatusFilter([...statusFilter, "rejected"]);
                      } else {
                        setStatusFilter(statusFilter.filter(s => s !== "rejected"));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span>مرفوض</span>
                </label>
              </div>
            </div>

            {/* Track Filter */}
            <div className="space-y-2">
              <h3 className="font-medium text-right">المسار</h3>
              <select
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-right"
              >
                <option value="">جميع المسارات</option>
                {ARABIC_TRACKS.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Type Filter */}
            <div className="space-y-2">
              <h3 className="font-medium text-right">نوع المشاركة</h3>
              <select
                value={teamTypeFilter}
                onChange={(e) => setTeamTypeFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-right"
              >
                <option value="">الكل</option>
                <option value="team">فريق</option>
                <option value="individual">فردي</option>
              </select>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={resetFilters}>
              إعادة تعيين
            </Button>
            <Button onClick={applyFilters}>
              تطبيق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto Team Creation Modal */}
      <AutoTeamCreationModal
        isOpen={isAutoTeamModalOpen}
        onClose={() => setIsAutoTeamModalOpen(false)}
        onSuccess={fetchTeams}
      />
    </div>
  );
}
