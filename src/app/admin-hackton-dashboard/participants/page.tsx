"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download, Trash, Edit, Eye } from "lucide-react";

// Define types for our data
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
  participants: Participant[];
}

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("approved");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/teams');
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const allTeams: Team[] = await response.json();
        setTeams(allTeams);
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
      team.teamIdea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.participants.some(p => p.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
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
                        <p className="text-sm text-muted-foreground">{team.teamIdea}</p>
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
                            <th className="p-3 text-right font-semibold">رقم الهاتف</th>
                            <th className="p-3 text-right font-semibold">التخصص</th>
                            <th className="p-3 text-center font-semibold">قائد الفريق</th>
                            <th className="p-3 text-center font-semibold">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {team.participants.map((participant) => (
                            <tr key={participant.id} className="border-t hover:bg-muted/20">
                              <td className="p-3">{participant.fullName}</td>
                              <td className="p-3">{participant.email}</td>
                              <td className="p-3">{participant.phoneNumber}</td>
                              <td className="p-3">{participant.specialty}</td>
                              <td className="p-3 text-center">
                                {participant.isLeader && (
                                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    نعم
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2 justify-center">
                                  <button className="p-1 rounded-md hover:bg-muted">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-1 rounded-md hover:bg-muted">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="p-1 rounded-md hover:bg-muted text-red-500">
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
    </div>
  );
}
