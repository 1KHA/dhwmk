"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Plus, Save, Trash, Loader2 } from "lucide-react";
import { useResponsive } from "@/contexts/responsive-context";
import { ResponsiveCard } from "@/components/ui/responsive-card";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";

interface Participant {
  id: string;
  email: string;
  firstName?: string;
  secondName?: string;
  familyName?: string;
  fullName?: string;
  nationalId?: string;
  phoneNumber?: string;
  university?: string;
  major?: string;
  isLeader: boolean;
}

interface Team {
  id: string;
  teamName: string;
  hackathonTrack?: string;
  ideaDescription?: string;
  participants: Participant[];
  status: string;
}

export default function TeamPage() {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkAndHandleAuthError } = useAuthErrorHandler();

  // Dialog states
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
  const [isConfirmLeaveOpen, setIsConfirmLeaveOpen] = useState(false);

  // Form states
  const [memberEmail, setMemberEmail] = useState("");
  const [makeLeader, setMakeLeader] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Participant | null>(null);
  const [editedTeam, setEditedTeam] = useState<{
    teamName: string;
    hackathonTrack: string;
    ideaDescription: string;
    challenge: string;
    challengeReason: string;
    ideaSolution: string;
    ideaResults: string;
    ideaStage: string;
    hasParticipated: boolean;
    participationDetails: string;
  }>({
    teamName: "",
    hackathonTrack: "",
    ideaDescription: "",
    challenge: "",
    challengeReason: "",
    ideaSolution: "",
    ideaResults: "",
    ideaStage: "",
    hasParticipated: false,
    participationDetails: "",
  });

  // Fetch team data
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/participant/team");
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            return checkAndHandleAuthError(response);
          }
          
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch team data");
        }
        
        const data = await response.json();
        
        if (data && data.team) {
          setTeam(data.team);
          // Initialize edit form with team data
          setEditedTeam({
            teamName: data.team.teamName || "",
            hackathonTrack: data.team.hackathonTrack || "",
            ideaDescription: data.team.ideaDescription || "",
            challenge: data.team.challenge || "",
            challengeReason: data.team.challengeReason || "",
            ideaSolution: data.team.ideaSolution || "",
            ideaResults: data.team.ideaResults || "",
            ideaStage: data.team.ideaStage || "",
            hasParticipated: data.team.hasParticipated || false,
            participationDetails: data.team.participationDetails || "",
          });
        }
      } catch (err) {
        console.error("Error fetching team:", err);
        setError(err instanceof Error ? err.message : "حدث خطأ أثناء جلب بيانات الفريق");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [checkAndHandleAuthError]);

  // Handle adding a team member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memberEmail) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني للعضو",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch("/api/participant/add-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: memberEmail,
          makeLeader,
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return checkAndHandleAuthError(response);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add team member");
      }
      
      // Refresh team data
      const teamResponse = await fetch("/api/participant/team");
      const teamData = await teamResponse.json();
      
      if (teamData && teamData.team) {
        setTeam(teamData.team);
      }
      
      setIsAddMemberOpen(false);
      setMemberEmail("");
      setMakeLeader(false);
      
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تمت إضافة العضو إلى الفريق بنجاح",
      });
    } catch (err) {
      console.error("Error adding member:", err);
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "حدث خطأ أثناء إضافة العضو",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a team member
  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/participant/remove-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantId: selectedMember.id,
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return checkAndHandleAuthError(response);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove team member");
      }
      
      // Refresh team data
      const teamResponse = await fetch("/api/participant/team");
      const teamData = await teamResponse.json();
      
      if (teamData && teamData.team) {
        setTeam(teamData.team);
      }
      
      setIsRemoveMemberOpen(false);
      setSelectedMember(null);
      
      toast({
        title: "تمت الإزالة بنجاح",
        description: "تمت إزالة العضو من الفريق بنجاح",
      });
    } catch (err) {
      console.error("Error removing member:", err);
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "حدث خطأ أثناء إزالة العضو",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle updating team information
  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch("/api/participant/update-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTeam),
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return checkAndHandleAuthError(response);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update team");
      }
      
      // Refresh team data
      const teamResponse = await fetch("/api/participant/team");
      const teamData = await teamResponse.json();
      
      if (teamData && teamData.team) {
        setTeam(teamData.team);
      }
      
      setIsEditTeamOpen(false);
      
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث معلومات الفريق بنجاح",
      });
    } catch (err) {
      console.error("Error updating team:", err);
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "حدث خطأ أثناء تحديث الفريق",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle leaving the team
  const handleLeaveTeam = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/participant/leave-team", {
        method: "POST",
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return checkAndHandleAuthError(response);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to leave team");
      }
      
      setIsConfirmLeaveOpen(false);
      
      toast({
        title: "تمت المغادرة بنجاح",
        description: "تمت مغادرة الفريق بنجاح",
      });
      
      // Redirect to teams page
      router.push("/participant-dashboard/teams");
    } catch (err) {
      console.error("Error leaving team:", err);
      toast({
        title: "خطأ",
        description: err instanceof Error ? err.message : "حدث خطأ أثناء مغادرة الفريق",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !team) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Progress value={80} className="w-64" />
        <div className="flex items-center">
          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          <span>جاري تحميل بيانات الفريق...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="text-right">{error}</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert className="mb-4">
        <AlertDescription className="text-right">{success}</AlertDescription>
      </Alert>
    );
  }

  if (!team) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على فريق</h2>
        <p className="mb-4">أنت لست عضوًا في أي فريق حاليًا.</p>
        <Button onClick={() => router.push("/participant-dashboard/teams")}>
          استعرض الفرق المتاحة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Tabs defaultValue="team-info" className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="team-info" className="text-lg">أعضاء الفريق</TabsTrigger>
          <TabsTrigger value="team-details" className="text-lg">الأعضاء</TabsTrigger>
        </TabsList>

        <TabsContent value="team-info">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">معلومات الفريق</CardTitle>
                <CardDescription>
                  عرض وتعديل معلومات الفريق الخاص بك
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditTeamOpen(true)}
              >
                <Edit className="ml-2 h-4 w-4" />
                تعديل
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsConfirmLeaveOpen(true)}
              >
                مغادرة الفريق
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                <div>
                  <Label htmlFor="teamName" className="text-lg font-semibold">
                    اسم الفريق
                  </Label>
                  <p className="mt-1">{team.teamName}</p>
                </div>
                <div>
                  <Label htmlFor="hackathonTrack" className="text-lg font-semibold">
                    المسار
                  </Label>
                  <p className="mt-1">{team.hackathonTrack}</p>
                </div>
                <div>
                  <Label htmlFor="status" className="text-lg font-semibold">
                    الحالة
                  </Label>
                  <p className="mt-1">
                    {team.status === "approved" ? "معتمد" : 
                     team.status === "rejected" ? "مرفوض" : "قيد الانتظار"}
                  </p>
                </div>
                <div>
                  <Label htmlFor="members" className="text-lg font-semibold">
                    عدد الأعضاء
                  </Label>
                  <p className="mt-1">{team.participants.length}</p>
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="ideaDescription" className="text-lg font-semibold">
                  وصف الفكرة
                </Label>
                <p className="mt-1">{team.ideaDescription}</p>
              </div>

              <div className="mt-6">
                <Label htmlFor="challenge" className="text-lg font-semibold">
                  التحدي
                </Label>
                <p className="mt-1">{team.hackathonTrack}</p>
              </div>

              <div className="mt-6">
                <Label htmlFor="challengeReason" className="text-lg font-semibold">
                  سبب اختيار التحدي
                </Label>
                <p className="mt-1">{editedTeam.challengeReason}</p>
              </div>

              <div className="mt-6">
                <Label htmlFor="ideaSolution" className="text-lg font-semibold">
                  الحل المقترح
                </Label>
                <p className="mt-1">{editedTeam.ideaSolution}</p>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => setIsAddMemberOpen(true)}
                  className="mt-4"
                >
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة عضو
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team-details">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">أعضاء الفريق</CardTitle>
              <Button
                onClick={() => setIsAddMemberOpen(true)}
              >
                <Plus className="ml-2 h-4 w-4" />
                إضافة عضو
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveTable
                data={team.participants}
                columns={[
                  {
                    header: "الاسم",
                    accessor: (participant) => {
                      const fullName = participant.fullName || 
                        `${participant.firstName || ''} ${participant.secondName || ''} ${participant.familyName || ''}`.trim();
                      return fullName || participant.email;
                    },
                    priority: 5,
                  },
                  {
                    header: "البريد الإلكتروني",
                    accessor: "email",
                    priority: 4,
                  },
                  {
                    header: "الجامعة",
                    accessor: "university",
                    priority: 2,
                  },
                  {
                    header: "التخصص",
                    accessor: "major",
                    priority: 1,
                  },
                  {
                    header: "قائد الفريق",
                    accessor: (participant) => participant.isLeader ? "نعم" : "لا",
                    priority: 3,
                  },
                  {
                    header: "الإجراءات",
                    accessor: (participant) => (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMember(participant);
                          setIsRemoveMemberOpen(true);
                        }}
                        disabled={participant.isLeader && team.participants.length > 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    ),
                    priority: 5,
                  },
                ]}
                keyField="id"
                emptyMessage="لا يوجد أعضاء في الفريق"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عضو جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMember}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="memberEmail">البريد الإلكتروني</Label>
                <Input
                  id="memberEmail"
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="example@example.com"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="makeLeader"
                  checked={makeLeader}
                  onCheckedChange={(checked) => setMakeLeader(checked === true)}
                />
                <Label htmlFor="makeLeader">تعيين كقائد للفريق</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddMemberOpen(false)}>إلغاء</Button>
              <Button type="submit">إضافة</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={isRemoveMemberOpen} onOpenChange={setIsRemoveMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد إزالة العضو</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد إزالة {selectedMember?.firstName} {selectedMember?.familyName} من الفريق؟
            </DialogDescription>
          </DialogHeader>
          <Button
            variant="destructive"
            onClick={handleRemoveMember}
          >
            تأكيد الإزالة
          </Button>
        </DialogContent>
      </Dialog>

      {/* Confirm Leave Team Dialog */}
      <Dialog open={isConfirmLeaveOpen} onOpenChange={setIsConfirmLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد مغادرة الفريق</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد مغادرة الفريق؟ لن تتمكن من العودة إليه إلا إذا تمت إضافتك مرة أخرى.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmLeaveOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={handleLeaveTeam}>
              مغادرة الفريق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل معلومات الفريق</DialogTitle>
            <DialogDescription>
              قم بتحديث معلومات الفريق الخاص بك
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateTeam} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">اسم الفريق</Label>
                <Input
                  id="teamName"
                  value={editedTeam.teamName}
                  onChange={(e) => setEditedTeam({ ...editedTeam, teamName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hackathonTrack">المسار</Label>
                <Input
                  id="hackathonTrack"
                  value={editedTeam.hackathonTrack}
                  onChange={(e) => setEditedTeam({ ...editedTeam, hackathonTrack: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="challenge">التحدي</Label>
                <Input
                  id="challenge"
                  value={editedTeam.challenge}
                  onChange={(e) => setEditedTeam({ ...editedTeam, challenge: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ideaStage">مرحلة الفكرة</Label>
                <Select
                  value={editedTeam.ideaStage}
                  onValueChange={(value) => setEditedTeam({ ...editedTeam, ideaStage: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مرحلة الفكرة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concept">مفهوم</SelectItem>
                    <SelectItem value="prototype">نموذج أولي</SelectItem>
                    <SelectItem value="mvp">منتج قابل للحياة</SelectItem>
                    <SelectItem value="growth">نمو</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ideaDescription">وصف الفكرة</Label>
              <Textarea
                id="ideaDescription"
                value={editedTeam.ideaDescription}
                onChange={(e) => setEditedTeam({ ...editedTeam, ideaDescription: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="challengeReason">سبب اختيار التحدي</Label>
              <Textarea
                id="challengeReason"
                value={editedTeam.challengeReason}
                onChange={(e) => setEditedTeam({ ...editedTeam, challengeReason: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ideaSolution">الحل المقترح</Label>
              <Textarea
                id="ideaSolution"
                value={editedTeam.ideaSolution}
                onChange={(e) => setEditedTeam({ ...editedTeam, ideaSolution: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ideaResults">النتائج المتوقعة</Label>
              <Textarea
                id="ideaResults"
                value={editedTeam.ideaResults}
                onChange={(e) => setEditedTeam({ ...editedTeam, ideaResults: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasParticipated"
                checked={editedTeam.hasParticipated}
                onCheckedChange={(checked) => 
                  setEditedTeam({ 
                    ...editedTeam, 
                    hasParticipated: checked === true,
                    participationDetails: checked === true ? editedTeam.participationDetails : ""
                  })
                }
              />
              <Label htmlFor="hasParticipated">
                هل شاركت بهذه الفكرة من قبل؟
              </Label>
            </div>
            
            {editedTeam.hasParticipated && (
              <div className="space-y-2">
                <Label htmlFor="participationDetails">تفاصيل المشاركة السابقة</Label>
                <Textarea
                  id="participationDetails"
                  value={editedTeam.participationDetails}
                  onChange={(e) => setEditedTeam({ ...editedTeam, participationDetails: e.target.value })}
                  rows={3}
                />
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditTeamOpen(false)}>إلغاء</Button>
              <Button type="submit">
                <Save className="ml-2 h-4 w-4" />
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
