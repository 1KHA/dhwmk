"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download, Trash, Edit, Eye } from "lucide-react";

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data for participants
  const participants = [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "0501234567",
      team: "فريق ألفا",
      role: "مطور برمجيات",
      status: "مؤكد",
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      phone: "0507654321",
      team: "فريق بيتا",
      role: "مصممة UI/UX",
      status: "مؤكد",
    },
    {
      id: 3,
      name: "خالد العمري",
      email: "khalid@example.com",
      phone: "0509876543",
      team: "بدون فريق",
      role: "مهندس بيانات",
      status: "بانتظار التأكيد",
    },
    {
      id: 4,
      name: "نورة سعيد",
      email: "noura@example.com",
      phone: "0503456789",
      team: "فريق جاما",
      role: "مديرة مشروع",
      status: "مؤكد",
    },
    {
      id: 5,
      name: "عبدالله محمد",
      email: "abdullah@example.com",
      phone: "0508765432",
      team: "فريق ألفا",
      role: "مطور واجهات أمامية",
      status: "مؤكد",
    },
  ];

  // Filter participants based on search query and selected filter
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.name.includes(searchQuery) ||
      participant.email.includes(searchQuery) ||
      participant.team.includes(searchQuery) ||
      participant.role.includes(searchQuery);

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "confirmed" && participant.status === "مؤكد") ||
      (selectedFilter === "pending" && participant.status === "بانتظار التأكيد") ||
      (selectedFilter === "no-team" && participant.team === "بدون فريق");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المشاركون</h1>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          إضافة مشارك
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المشاركين</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="بحث عن مشارك..."
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
                <option value="all">جميع المشاركين</option>
                <option value="confirmed">المؤكدين</option>
                <option value="pending">بانتظار التأكيد</option>
                <option value="no-team">بدون فريق</option>
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
                  <th className="border p-2 text-right">الاسم</th>
                  <th className="border p-2 text-right">البريد الإلكتروني</th>
                  <th className="border p-2 text-right">رقم الهاتف</th>
                  <th className="border p-2 text-right">الفريق</th>
                  <th className="border p-2 text-right">الدور</th>
                  <th className="border p-2 text-right">الحالة</th>
                  <th className="border p-2 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((participant) => (
                  <tr key={participant.id} className="hover:bg-muted/50">
                    <td className="border p-2">{participant.name}</td>
                    <td className="border p-2">{participant.email}</td>
                    <td className="border p-2">{participant.phone}</td>
                    <td className="border p-2">{participant.team}</td>
                    <td className="border p-2">{participant.role}</td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          participant.status === "مؤكد"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {participant.status}
                      </span>
                    </td>
                    <td className="border p-2">
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

          <div className="mt-4 text-sm text-muted-foreground text-center">
            إجمالي المشاركين: {participants.length} | تم العرض:{" "}
            {filteredParticipants.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
