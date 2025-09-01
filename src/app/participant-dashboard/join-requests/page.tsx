"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Check, X, Loader2, Mail, User, Calendar } from "lucide-react";
import { useToast } from "../../../../components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface JoinRequest {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  participant: {
    id: string;
    fullName: string | null;
    firstName: string | null;
    secondName: string | null;
    familyName: string | null;
    email: string;
    university: string | null;
    professionalField: string | null;
    displayName: string;
  };
}

export default function JoinRequestsPage() {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch join requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team-leader/join-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      } else {
        const errorData = await response.json();
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في جلب طلبات الانضمام",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في الاتصال",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle request action (accept/reject)
  const handleRequestAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      setProcessingId(requestId);
      const response = await fetch('/api/team-leader/handle-join-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          action,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: action === 'accept' ? "تم القبول" : "تم الرفض",
          description: data.message,
        });
        
        // Refresh requests list
        fetchRequests();
        
        // Close detail modal if open
        if (isDetailModalOpen) {
          setIsDetailModalOpen(false);
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "خطأ",
          description: errorData.error || "فشل في معالجة الطلب",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في الاتصال",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openDetailModal = (request: JoinRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>جاري تحميل طلبات الانضمام...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">الدعوات المستلمة</h1>
          <p className="text-muted-foreground">
            إدارة طلبات الانضمام المرسلة لفريقك
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {requests.length} طلب معلق
          </Badge>
        </div>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد طلبات انضمام</h3>
            <p className="text-muted-foreground text-center">
              لم يتم استلام أي طلبات انضمام لفريقك حتى الآن
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">
                      {request.participant.displayName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {request.participant.email}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(request.createdAt), 'dd MMM', { locale: ar })}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.participant.university && (
                  <div>
                    <h4 className="font-medium mb-1">الجامعة:</h4>
                    <p className="text-sm text-muted-foreground">
                      {request.participant.university}
                    </p>
                  </div>
                )}

                {request.participant.professionalField && (
                  <div>
                    <h4 className="font-medium mb-1">المجال المهني:</h4>
                    <p className="text-sm text-muted-foreground">
                      {request.participant.professionalField}
                    </p>
                  </div>
                )}

                {request.message && (
                  <div>
                    <h4 className="font-medium mb-1">الرسالة:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {request.message}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRequestAction(request.id, 'accept')}
                    disabled={processingId === request.id}
                    className="flex-1"
                  >
                    {processingId === request.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4 ml-1" />
                        قبول
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequestAction(request.id, 'reject')}
                    disabled={processingId === request.id}
                    className="flex-1"
                  >
                    {processingId === request.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="h-4 w-4 ml-1" />
                        رفض
                      </>
                    )}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDetailModal(request)}
                  className="w-full"
                >
                  <User className="h-4 w-4 ml-1" />
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل طلب الانضمام</DialogTitle>
            <DialogDescription>
              معلومات تفصيلية عن المشارك
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">معلومات المشارك:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الاسم:</span>
                    <span>{selectedRequest.participant.displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">البريد الإلكتروني:</span>
                    <span>{selectedRequest.participant.email}</span>
                  </div>
                  {selectedRequest.participant.university && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الجامعة:</span>
                      <span>{selectedRequest.participant.university}</span>
                    </div>
                  )}
                  {selectedRequest.participant.professionalField && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المجال المهني:</span>
                      <span>{selectedRequest.participant.professionalField}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاريخ الطلب:</span>
                    <span>
                      {format(new Date(selectedRequest.createdAt), 'dd MMMM yyyy', { locale: ar })}
                    </span>
                  </div>
                </div>
              </div>

              {selectedRequest.message && (
                <div>
                  <h4 className="font-medium mb-2">رسالة المشارك:</h4>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    {selectedRequest.message}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              إغلاق
            </Button>
            {selectedRequest && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRequestAction(selectedRequest.id, 'accept')}
                  disabled={processingId === selectedRequest.id}
                >
                  {processingId === selectedRequest.id ? (
                    <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 ml-1" />
                      قبول
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRequestAction(selectedRequest.id, 'reject')}
                  disabled={processingId === selectedRequest.id}
                >
                  {processingId === selectedRequest.id ? (
                    <Loader2 className="h-4 w-4 ml-1 animate-spin" />
                  ) : (
                    <>
                      <X className="h-4 w-4 ml-1" />
                      رفض
                    </>
                  )}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
