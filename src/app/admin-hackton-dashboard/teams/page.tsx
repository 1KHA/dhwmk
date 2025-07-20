"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download, Trash, Edit, Eye, UserPlus } from "lucide-react";

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data for teams
  const teams = [
    {
      id: 1,
      name: "فريق ألفا",
      members: 5,
      leader: "أحمد محمد",
      project: "منصة تعليمية ذكية",
      mentor: "د. سامي أحمد",
      status: "مؤكد",
    },
    {
      id: 2,
      name: "فريق بيتا",
      members: 4,
      leader: "فاطمة علي",
      project: "تطبيق صحة رقمية",
      mentor: "م. ليلى محمد",
      status: "مؤكد",
    },
    {
      id: 3,
      name: "فريق جاما",
      members: 6,
      leader: "نورة سعيد",
      project: "حلول ذكاء اصطناعي",
      mentor: "د. عبدالله الشمري",
      status: "مؤكد",
    },
    {
      id: 4,
      name: "فريق دلتا",
      members: 3,
      leader: "خالد العمري",
      project: "منصة تجارة إلكترونية",
      mentor: "غير معين",
      status: "بانتظار الموافقة",
    },
    {
      id: 5,
      name: "فريق إبسيلون",
      members: 4,
      leader: "سارة أحمد",
      project: "تطبيق توصيل",
      mentor: "غير معين",
      status: "بانتظار الموافقة",
    },
  ];

  // Filter teams based on search query and selected filter
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.includes(searchQuery) ||
      team.leader.includes(searchQuery) ||
      team.project.includes(searchQuery) ||
      team.mentor.includes(searchQuery);

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "confirmed" && team.status === "مؤكد") ||
      (selectedFilter === "pending" && team.status === "بانتظار الموافقة") ||
      (selectedFilter === "no-mentor" && team.mentor === "غير معين");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الفرق</h1>
        <Button>
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
                placeholder="بحث عن فريق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 py-2 pr-10 pl-4 rounded-md border border-input bg-background text-right"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-right"
              >
                <option value="all">جميع الفرق</option>
                <option value="confirmed">المؤكدة</option>
                <option value="pending">بانتظار الموافقة</option>
                <option value="no-mentor">بدون موجه</option>
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
                  <th className="border p-2 text-right">عدد الأعضاء</th>
                  <th className="border p-2 text-right">قائد الفريق</th>
                  <th className="border p-2 text-right">المشروع</th>
                  <th className="border p-2 text-right">الموجه</th>
                  <th className="border p-2 text-right">الحالة</th>
                  <th className="border p-2 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-muted/50">
                    <td className="border p-2">{team.name}</td>
                    <td className="border p-2">{team.members}</td>
                    <td className="border p-2">{team.leader}</td>
                    <td className="border p-2">{team.project}</td>
                    <td className="border p-2">
                      {team.mentor === "غير معين" ? (
                        <span className="text-amber-500">غير معين</span>
                      ) : (
                        team.mentor
                      )}
                    </td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          team.status === "مؤكد"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {team.status}
                      </span>
                    </td>
                    <td className="border p-2">
                      <div className="flex gap-2 justify-center">
                        <button className="p-1 rounded-md hover:bg-muted">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 rounded-md hover:bg-muted">
                          <UserPlus className="h-4 w-4" />
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

          <div className="mt-4 text-sm text-muted-foreground text-center">
            إجمالي الفرق: {teams.length} | تم العرض: {filteredTeams.length}
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
                {teams.filter((team) => team.status === "مؤكد").length}
              </h3>
              <p className="text-muted-foreground">الفرق المؤكدة</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.filter((team) => team.status === "بانتظار الموافقة").length}
              </h3>
              <p className="text-muted-foreground">بانتظار الموافقة</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="text-2xl font-bold">
                {teams.filter((team) => team.mentor === "غير معين").length}
              </h3>
              <p className="text-muted-foreground">بدون موجه</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
