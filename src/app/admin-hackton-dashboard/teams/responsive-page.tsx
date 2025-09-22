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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { ResponsiveCard } from "@/components/ui/responsive-card";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { useResponsive } from "@/contexts/responsive-context";

interface Participant {
  id: string;
  // New CSV-based fields
  fullName?: string;
  contactNumber?: string;
  gender?: string;
  isUniversityStudent?: boolean;
  universityMajor?: string;
  professionalField?: string;
  city?: string;
  canAttendHackathon?: boolean;
  
  // Core fields
  email: string;
  university?: string;
  isLeader: boolean;
  status?: string;
  teamId?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Legacy fields
  firstName?: string;
  secondName?: string;
  familyName?: string;
  nationalId?: string;
  dob?: string;
  phoneNumber?: string;
  education?: string;
  major?: string;
  employmentStatus?: string;
  nationality?: string;
  residence?: string;
  canAttend?: boolean;
}

interface Team {
  id: string;
  teamName?: string;
  status: string;
  hackathonTrack?: string;
  ideaDescription?: string;
  hearAboutUs?: string;
  isTeamRegistration?: boolean;
  attachmentPath?: string;
  createdAt: string;
  updatedAt?: string;
  participants: Participant[];
  
  // Legacy fields
  challenge?: string;
  challengeReason?: string;
  ideaName?: string;
  ideaSolution?: string;
  ideaResults?: string;
  ideaStage?: string;
  attachmentsLink?: string;
  hasParticipated?: boolean;
  participationDetails?: string;
}

export default function TeamsPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
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
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [editedTeam, setEditedTeam] = useState<Partial<Team> & { newLeaderId?: string } | null>(null);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [participantEmail, setParticipantEmail] = useState("");
  const [makeLeader, setMakeLeader] = useState(false);
  
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
            fullName: p.fullName || `${p.firstName || ''} ${p.secondName || ''} ${p.familyName || ''}`.trim() || p.email,
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

  // Function to handle removing a team member
  const handleRemoveMember = async (participantId: string, teamId: string) => {
    try {
      const response = await fetch('/api/admin/remove-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participantId }),
      });

      if (response.ok) {
        toast({
          title: "نجح",
          description: "تم إزالة العضو من الفريق بنجاح",
        });
        fetchTeams(); // Refresh the list
        setIsRemoveMemberModalOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في إزالة العضو من الفريق",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إزالة العضو من الفريق",
        variant: "destructive",
      });
    }
  };

  // Function to handle adding a team member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !participantEmail) return;

    try {
      // First, find the participant by email
      const response = await fetch(`/api/admin/participants?email=${encodeURIComponent(participantEmail)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في العثور على المشارك",
          variant: "destructive",
        });
        return;
      }
      
      const participants = await response.json();
      
      if (participants.length === 0) {
        toast({
          title: "خطأ",
          description: "لم يتم العثور على مشارك بهذا البريد الإلكتروني",
          variant: "destructive",
        });
        return;
      }
      
      const participant = participants[0];
      
      // Now add the participant to the team
      const addResponse = await fetch('/api/admin/add-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          teamId: selectedTeam.id, 
          participantId: participant.id,
          makeLeader: makeLeader
        }),
      });

      if (addResponse.ok) {
        toast({
          title: "نجح",
          description: "تمت إضافة العضو إلى الفريق بنجاح",
        });
        fetchTeams(); // Refresh the list
        setIsAddMemberModalOpen(false);
        setParticipantEmail("");
        setMakeLeader(false);
      } else {
        const errorData = await addResponse.json();
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في إضافة العضو إلى الفريق",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة العضو إلى الفريق",
        variant: "destructive",
      });
    }
  };

  // Function to handle exporting teams data to Excel
  const handleExportToExcel = () => {
    try {
      // Create a detailed worksheet with all teams data
      const teamsWorksheet = XLSX.utils.json_to_sheet(
        teams.map(team => {
          const leader = team.participants.find(p => p.isLeader);
          return {
            'اسم الفريق': team.teamName || '',
            'اسم الفكرة': team.ideaName || '',
            'المسار': team.hackathonTrack || '',
            'التحدي': team.challenge || '',
            'سبب اختيار التحدي': team.challengeReason || '',
            'وصف الفكرة': team.ideaDescription || '',
            'الحل المقترح': team.ideaSolution || '',
            'النتائج المتوقعة': team.ideaResults || '',
            'مرحلة الفكرة': team.ideaStage || '',
            'من أين سمعت عنا': team.hearAboutUs || '',
            'هل شاركت الفكرة من قبل؟': team.hasParticipated ? 'نعم' : 'لا',
            'تفاصيل المشاركة السابقة': team.participationDetails || '',
            'رابط المرفقات': team.attachmentsLink || '',
            'مسار المرفقات': team.attachmentPath || '',
            'الحالة': team.status === "approved" ? "معتمد" : 
                     team.status === "rejected" ? "مرفوض" : "قيد الانتظار",
            'تاريخ الإنشاء': new Date(team.createdAt).toLocaleDateString('ar-SA'),
            'تاريخ التحديث': team.updatedAt ? new Date(team.updatedAt).toLocaleDateString('ar-SA') : new Date(team.createdAt).toLocaleDateString('ar-SA'),
            'عدد الأعضاء': team.participants.length,
            'قائد الفريق': leader?.fullName || `${leader?.firstName || ''} ${leader?.secondName || ''} ${leader?.familyName || ''}`.trim() || '',
            'بريد قائد الفريق': leader?.email || '',
            'رقم هوية قائد الفريق': leader?.nationalId || '',
            'رقم جوال قائد الفريق': leader?.phoneNumber || leader?.contactNumber || '',
          };
        })
      );

      // Create a detailed worksheet for participants with all fields
      const participantsData = teams.flatMap(team => 
        team.participants.map(p => ({
          // Team information
          'اسم الفريق': team.teamName || '',
          'المسار': team.hackathonTrack || '',
          'حالة الفريق': team.status === "approved" ? "معتمد" : 
                        team.status === "rejected" ? "مرفوض" : "قيد الانتظار",
          
          // Participant information - both new and legacy fields
          'معرف المشارك': p.id,
          'قائد الفريق؟': p.isLeader ? 'نعم' : 'لا',
          'حالة المشارك': p.status === "approved" ? "معتمد" : 
                          p.status === "rejected" ? "مرفوض" : "قيد الانتظار",
          
          // New CSV-based fields
          'الاسم الكامل': p.fullName || '',
          'رقم التواصل': p.contactNumber || '',
          'الجنس': p.gender || '',
          'طالب جامعي؟': p.isUniversityStudent !== undefined ? (p.isUniversityStudent ? 'نعم' : 'لا') : '',
          'التخصص الجامعي': p.universityMajor || '',
          'المجال المهني': p.professionalField || '',
          'المدينة': p.city || '',
          'يمكنه الحضور للهاكاثون؟': p.canAttendHackathon !== undefined ? (p.canAttendHackathon ? 'نعم' : 'لا') : '',
          
          // Core fields
          'البريد الإلكتروني': p.email || '',
          'الجامعة': p.university || '',
          'تاريخ التسجيل': p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-SA') : '',
          'تاريخ التحديث': p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('ar-SA') : (p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-SA') : ''),
          
          // Legacy fields
          'الاسم الأول': p.firstName || '',
          'الاسم الثاني': p.secondName || '',
          'اسم العائلة': p.familyName || '',
          'رقم الهوية': p.nationalId || '',
          'تاريخ الميلاد': p.dob || '',
          'رقم الجوال': p.phoneNumber || '',
          'المؤهل التعليمي': p.education || '',
          'التخصص': p.major || '',
          'الحالة الوظيفية': p.employmentStatus || '',
          'الجنسية': p.nationality || '',
          'منطقة الإقامة': p.residence || '',
          'يمكنه الحضور؟': p.canAttend !== undefined ? (p.canAttend ? 'نعم' : 'لا') : '',
        }))
      );
      const participantsWorksheet = XLSX.utils.json_to_sheet(participantsData);

      // Create a combined worksheet showing teams with their members
      const combinedData = teams.flatMap(team => {
        // Get team leader
        const leader = team.participants.find(p => p.isLeader);
        
        // Create one row per participant with team details
        return team.participants.map((p, index) => {
          const isLeader = p.isLeader;
          
          return {
            // Team information
            'اسم الفريق': team.teamName || '',
            'اسم الفكرة': team.ideaName || '',
            'المسار': team.hackathonTrack || '',
            'التحدي': team.challenge || '',
            'وصف الفكرة': team.ideaDescription || '',
            'حالة الفريق': team.status === "approved" ? "معتمد" : 
                          team.status === "rejected" ? "مرفوض" : "قيد الانتظار",
            'عدد الأعضاء': team.participants.length,
            
            // Participant role
            'دور المشارك': isLeader ? 'قائد الفريق' : `عضو ${index}`,
            
            // Participant information
            'الاسم الكامل': p.fullName || `${p.firstName || ''} ${p.secondName || ''} ${p.familyName || ''}`.trim() || '',
            'البريد الإلكتروني': p.email || '',
            'رقم التواصل': p.contactNumber || p.phoneNumber || '',
            'الجنس': p.gender || '',
            'الجامعة': p.university || '',
            'التخصص': p.universityMajor || p.major || '',
            'المجال المهني': p.professionalField || p.employmentStatus || '',
            'المدينة': p.city || p.residence || '',
            'طالب جامعي؟': p.isUniversityStudent !== undefined ? (p.isUniversityStudent ? 'نعم' : 'لا') : '',
            'يمكنه الحضور؟': p.canAttendHackathon !== undefined ? (p.canAttendHackathon ? 'نعم' : 'لا') : 
                            (p.canAttend !== undefined ? (p.canAttend ? 'نعم' : 'لا') : ''),
          };
        });
      });
      const combinedWorksheet = XLSX.utils.json_to_sheet(combinedData);

      // Create a workbook with all worksheets
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, teamsWorksheet, "الفرق");
      XLSX.utils.book_append_sheet(workbook, participantsWorksheet, "الأعضاء بالتفصيل");
      XLSX.utils.book_append_sheet(workbook, combinedWorksheet, "الفرق والأعضاء");

      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "بيانات_الفرق_والأعضاء.xlsx");

      toast({
        title: "نجح",
        description: "تم تصدير بيانات الفرق والأعضاء بنجاح",
      });
    } catch (error) {
      console.error('Error exporting teams:', error);
      toast({
        title: "خطأ",
        description: "فشل في تصدير البيانات",
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
      (team.teamName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (team.ideaName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
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

  // Define columns for the responsive table
  const teamColumns = [
    {
      header: "اسم الفريق",
      accessor: "teamName",
      priority: 5,
    },
    {
      header: "اسم الفكرة",
      accessor: "ideaName",
      priority: 4,
    },
    {
      header: "المسار",
      accessor: "hackathonTrack",
      priority: 3,
    },
    {
      header: "الأعضاء",
      accessor: (team: Team) => (
        <Button
          variant="link"
          className="p-0 h-auto"
          onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
        >
          {team.participants.length} (عرض)
        </Button>
      ),
      priority: 2,
    },
    {
      header: "قائد الفريق",
      accessor: (team: Team) => {
        const leader = team.participants.find(p => p.isLeader);
        return leader?.fullName || 'غير متوفر';
      },
      priority: 1,
    },
    {
      header: "الحالة",
      accessor: (team: Team) => (
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
      ),
      priority: 3,
    },
    {
      header: "تاريخ الإنشاء",
      accessor: (team: Team) => new Date(team.createdAt).toLocaleDateString('ar-SA'),
      priority: 0,
    },
    {
      header: "الإجراءات",
      accessor: (team: Team) => (
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
              // Initialize all editable fields
              setEditedTeam({
                teamName: team.teamName,
                hackathonTrack: team.hackathonTrack,
                ideaName: team.ideaName,
                ideaDescription: team.ideaDescription,
                challenge: team.challenge,
                challengeReason: team.challengeReason,
                ideaSolution: team.ideaSolution,
                ideaResults: team.ideaResults,
                ideaStage: team.ideaStage,
                hearAboutUs: team.hearAboutUs,
                hasParticipated: team.hasParticipated,
                participationDetails: team.participationDetails,
                attachmentsLink: team.attachmentsLink,
                // Find current leader ID
                newLeaderId: team.participants.find(p => p.isLeader)?.id
              });
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
      ),
      priority: 5,
    },
  ];

  // Define columns for the team members table
  const memberColumns = [
    {
      header: "الاسم الكامل",
      accessor: "fullName",
      priority: 5,
    },
    {
      header: "البريد الإلكتروني",
      accessor: "email",
      priority: 4,
    },
    {
      header: "رقم الهوية",
      accessor: "nationalId",
      priority: 0,
    },
    {
      header: "التخصص",
      accessor: "major",
      priority: 0,
    },
    {
      header: "الجامعة",
      accessor: "university",
      priority: 0,
    },
    {
      header: "قائد الفريق",
      accessor: (p: Participant) => p.isLeader ? (
        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          نعم
        </span>
      ) : "لا",
      priority: 3,
    },
    {
      header: "الإجراءات",
      accessor: (p: Participant) => (
        <button
          className="p-1 rounded-md hover:bg-muted text-red-500"
          title="إزالة العضو"
          onClick={() => {
            setSelectedParticipant(p);
            setIsRemoveMemberModalOpen(true);
          }}
        >
          <Trash className="h-4 w-4" />
        </button>
      ),
      priority: 5,
    },
  ];

  // Stats data for responsive grid
  const statsData = [
    {
      title: "إجمالي الفرق",
      value: teams.length,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "الفرق المعتمدة",
      value: teams.filter((team) => team.status === "approved").length,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "قيد الانتظار",
      value: teams.filter((team) => team.status === "pending").length,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "المرفوضة",
      value: teams.filter((team) => team.status === "rejected").length,
      color: "bg-red-100 text-red-800",
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">الفرق</h1>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          <Button onClick={() => router.push('/admin-hackton-dashboard/teams/create')}>
            <Plus className="ml-2 h-4 w-4" />
            إنشاء فريق
          </Button>
          <Button variant="outline" onClick={() => setIsAutoTeamModalOpen(true)}>
            <Users className="ml-2 h-4 w-4" />
            {isMobile ? "إضافة فريق" : "إضافة فريق من المشاركين"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الفرق</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="البحث عن الفرق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 py-2 pr-10 pl-4 rounded-md border border-input bg-background"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
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

          <ResponsiveTable
            data={filteredTeams}
            columns={teamColumns}
            keyField="id"
            isLoading={loading}
            emptyMessage="لم يتم العثور على فرق"
            onRowClick={(team) => {
              setSelectedTeam(team);
              setIsViewModalOpen(true);
            }}
          />

          {expandedTeam && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/10">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">أعضاء الفريق:</h4>
                <Button 
                  size="sm" 
                  onClick={() => {
                    const team = teams.find(t => t.id === expandedTeam);
                    if (team) {
                      setSelectedTeam(team);
                      setParticipantEmail("");
                      setMakeLeader(false);
                      setIsAddMemberModalOpen(true);
                    }
                  }}
                >
                  <UserPlus className="ml-2 h-4 w-4" />
                  إضافة عضو
                </Button>
              </div>
              
              <ResponsiveTable
                data={teams.find(t => t.id === expandedTeam)?.participants || []}
                columns={memberColumns}
                keyField="id"
                emptyMessage="لا يوجد أعضاء في هذا الفريق"
              />
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
          <ResponsiveGrid
            columns={{
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
            }}
            gap={4}
          >
            {statsData.map((stat, index) => (
              <ResponsiveCard key={index} className="text-center">
                <CardContent className="p-4">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.title}</p>
                </CardContent>
              </ResponsiveCard>
            ))}
          </ResponsiveGrid>

          {/* User Statistics */}
          <h3 className="text-lg font-semibold mt-8 mb-4">إحصائيات المستخدمين</h3>
          <ResponsiveGrid
            columns={{
              xs: 1,
              sm: 1,
              md: 3,
              lg: 3,
            }}
            gap={4}
            className="mb-6"
          >
            <ResponsiveCard className="text-center">
              <CardContent className="p-4">
                <h3 className="text-2xl font-bold">
                  {teams.reduce((sum, team) => sum + team.participants.length, 0)}
                </h3>
                <p className="text-muted-foreground">إجمالي المستخدمين المسجلين</p>
              </CardContent>
            </ResponsiveCard>
            <ResponsiveCard className="text-center">
              <CardContent className="p-4">
                <h3 className="text-2xl font-bold">
                  {teams.filter(team => team.participants.length > 1)
                    .reduce((sum, team) => sum + team.participants.length, 0)}
                </h3>
                <p className="text-muted-foreground">المشاركين ضمن فرق</p>
              </CardContent>
            </ResponsiveCard>
            <ResponsiveCard className="text-center">
              <CardContent className="p-4">
                <h3 className="text-2xl font-bold">
                  {teams.filter(team => team.participants.length === 1).length}
                </h3>
                <p className="text-muted-foreground">المشاركين الفرديين</p>
              </CardContent>
            </ResponsiveCard>
          </ResponsiveGrid>

          {/* Gender Statistics */}
          <h3 className="text-lg font-semibold mb-4">إحصائيات الجنس</h3>
          <ResponsiveGrid
            columns={{
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
            }}
            gap={4}
            className="mb-6"
          >
            <ResponsiveCard className="text-center">
              <CardContent className="p-4">
                <h3 className="text-2xl font-bold">
                  {teams.flatMap(team => team.participants)
                    .filter(p => p.gender === "male" || p.gender === "ذكر").length}
                </h3>
                <p className="text-muted-foreground">الذكور</p>
              </CardContent>
            </ResponsiveCard>
            <ResponsiveCard className="text-center">
              <CardContent className="p-4">
                <h3 className="text-2xl font-bold">
                  {teams.flatMap(team => team.participants)
                    .filter(p => p.gender === "female" || p.gender === "أنثى").length}
                </h3>
                <p className="text-muted-foreground">الإناث</p>
              </CardContent>
            </ResponsiveCard>
          </ResponsiveGrid>

          {/* Teams per Track */}
          <h3 className="text-lg font-semibold mb-4">الفرق حسب المسار</h3>
          <ResponsiveGrid
            columns={{
              xs: 1,
              sm: 1,
              md: 3,
              lg: 3,
            }}
            gap={4}
          >
            {ARABIC_TRACKS.map(track => (
              <ResponsiveCard key={track} className="text-center">
                <CardContent className="p-4">
                  <h3 className="text-2xl font-bold">
                    {teams.filter(team => team.hackathonTrack === track).length}
                  </h3>
                  <p className="text-muted-foreground" title={track}>
                    {track.length > 30 ? `${track.substring(0, 30)}...` : track}
                  </p>
                </CardContent>
              </ResponsiveCard>
            ))}
          </ResponsiveGrid>
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

      {/* Remove Member Confirmation Modal */}
      <Dialog open={isRemoveMemberModalOpen} onOpenChange={setIsRemoveMemberModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد إزالة العضو</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد إزالة العضو "{selectedParticipant?.fullName}" من الفريق "{selectedTeam?.teamName}"؟
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveMemberModalOpen(false)}>إلغاء</Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedParticipant && selectedTeam && handleRemoveMember(selectedParticipant.id, selectedTeam.id)}
            >
              إزالة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Modal */}
      <Dialog open={isAddMemberModalOpen} onOpenChange={setIsAddMemberModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عضو إلى الفريق</DialogTitle>
            <DialogDescription>
              أدخل البريد الإلكتروني للمشارك لإضافته إلى الفريق "{selectedTeam?.teamName}"
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddMember}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="participantEmail">البريد الإلكتروني للمشارك</Label>
                <Input
                  id="participantEmail"
                  type="email"
                  placeholder="example@example.com"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="makeLeader"
                  checked={makeLeader}
                  onChange={(e) => setMakeLeader(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="makeLeader">تعيين كقائد للفريق</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddMemberModalOpen(false)}>إلغاء</Button>
              <Button type="submit">إضافة</Button>
            </DialogFooter>
          </form>
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
