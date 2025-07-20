'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/../../components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/../../components/ui/use-toast'

interface Participant {
  firstName: string
  secondName: string
  familyName: string
  nationalId: string
  dob: string
  email: string
  phoneNumber: string
  education: string
  university: string
  major: string
  employmentStatus: string
  nationality: string
  residence: string
  canAttend: boolean
}

const initialParticipantState: Participant = {
  firstName: '',
  secondName: '',
  familyName: '',
  nationalId: '',
  dob: '',
  email: '',
  phoneNumber: '',
  education: '',
  university: '',
  major: '',
  employmentStatus: '',
  nationality: '',
  residence: '',
  canAttend: false,
}

export default function RegisterTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Team & Idea Info
  const [teamName, setTeamName] = useState('')
  const [challenge, setChallenge] = useState('')
  const [challengeReason, setChallengeReason] = useState('')
  const [ideaName, setIdeaName] = useState('')
  const [ideaDescription, setIdeaDescription] = useState('')
  const [ideaSolution, setIdeaSolution] = useState('')
  const [ideaResults, setIdeaResults] = useState('')
  const [ideaStage, setIdeaStage] = useState('')
  const [attachmentsLink, setAttachmentsLink] = useState('')
  const [hasParticipated, setHasParticipated] = useState(false)
  const [participationDetails, setParticipationDetails] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // Leader Info
  const [leaderInfo, setLeaderInfo] = useState<Participant>(initialParticipantState)

  // Members Info
  const [memberCount, setMemberCount] = useState<number>(2)
  const [members, setMembers] = useState<Participant[]>(
    Array(2).fill(null).map(() => initialParticipantState)
  )

  const handleMemberCountChange = (value: string) => {
    const count = parseInt(value)
    setMemberCount(count)

    if (count > members.length) {
      const newMembers = [...members]
      for (let i = members.length; i < count; i++) {
        newMembers.push(initialParticipantState)
      }
      setMembers(newMembers)
    } else {
      setMembers(members.slice(0, count))
    }
  }

  const updateParticipant = (
    setter: React.Dispatch<React.SetStateAction<Participant>>,
    field: keyof Participant,
    value: string | boolean
  ) => {
    setter((prev) => ({ ...prev, [field]: value }))
  }

  const updateMember = (index: number, field: keyof Participant, value: string | boolean) => {
    const newMembers = [...members]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setMembers(newMembers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/register-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          leader: leaderInfo,
          members: members.slice(0, memberCount),
          idea: {
            challenge,
            challengeReason,
            ideaName,
            ideaDescription,
            ideaSolution,
            ideaResults,
            ideaStage,
            attachmentsLink,
            hasParticipated,
            participationDetails,
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'نجح!',
          description: 'تم إرسال النموذج بنجاح',
        })
        router.push('/')
      } else {
        toast({
          title: 'خطأ',
          description: data.error || 'فشل إرسال النموذج',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إرسال النموذج',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderParticipantFields = (
    participant: Participant,
    updateFn: (field: keyof Participant, value: string | boolean) => void,
    prefix: string
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`${prefix}-firstName`}>الاسم الأول</Label>
        <Input id={`${prefix}-firstName`} required value={participant.firstName} onChange={(e) => updateFn('firstName', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-secondName`}>الاسم الثاني</Label>
        <Input id={`${prefix}-secondName`} required value={participant.secondName} onChange={(e) => updateFn('secondName', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-familyName`}>اسم العائلة</Label>
        <Input id={`${prefix}-familyName`} required value={participant.familyName} onChange={(e) => updateFn('familyName', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-nationalId`}>رقم الهوية</Label>
        <Input id={`${prefix}-nationalId`} required value={participant.nationalId} onChange={(e) => updateFn('nationalId', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-dob`}>تاريخ الميلاد</Label>
        <Input id={`${prefix}-dob`} type="date" required value={participant.dob} onChange={(e) => updateFn('dob', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-email`}>البريد الإلكتروني</Label>
        <Input id={`${prefix}-email`} type="email" required value={participant.email} onChange={(e) => updateFn('email', e.target.value)} dir="ltr" />
      </div>
      <div>
        <Label htmlFor={`${prefix}-phoneNumber`}>رقم الجوال</Label>
        <Input id={`${prefix}-phoneNumber`} type="tel" required value={participant.phoneNumber} onChange={(e) => updateFn('phoneNumber', e.target.value)} dir="ltr" />
        <p className="text-xs text-gray-500 mt-1">يجب أن يستقبل واتساب وتيليغرام</p>
      </div>
      <div>
        <Label htmlFor={`${prefix}-education`}>المؤهل التعليمي</Label>
        <Input id={`${prefix}-education`} required value={participant.education} onChange={(e) => updateFn('education', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-university`}>الجامعة أو الجهة</Label>
        <Input id={`${prefix}-university`} required value={participant.university} onChange={(e) => updateFn('university', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-major`}>التخصص</Label>
        <Input id={`${prefix}-major`} required value={participant.major} onChange={(e) => updateFn('major', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-employmentStatus`}>الحالة الوظيفية</Label>
        <Input id={`${prefix}-employmentStatus`} required value={participant.employmentStatus} onChange={(e) => updateFn('employmentStatus', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-nationality`}>الجنسية</Label>
        <Input id={`${prefix}-nationality`} required value={participant.nationality} onChange={(e) => updateFn('nationality', e.target.value)} />
      </div>
      <div>
        <Label htmlFor={`${prefix}-residence`}>منطقة الإقامة</Label>
        <Input id={`${prefix}-residence`} required value={participant.residence} onChange={(e) => updateFn('residence', e.target.value)} />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id={`${prefix}-canAttend`} checked={participant.canAttend} onCheckedChange={(checked: boolean | 'indeterminate') => updateFn('canAttend', !!checked)} />
        <Label htmlFor={`${prefix}-canAttend`}>هل تستطيع الحضور إلى مقر الهاكثون في الأيام الحضورية؟</Label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>نموذج تسجيل المشاركين</CardTitle>
            <CardDescription>سجل فريقك للمشاركة في الهاكاثون</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Team Leader Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">معلومات قائد الفريق</h3>
                {renderParticipantFields(leaderInfo, (field, value) => updateParticipant(setLeaderInfo, field, value), 'leader')}
              </div>

              <>
                {/* Idea Information */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold border-b pb-2">معلومات الفكرة</h3>
                    
                    <div>
                      <Label htmlFor="team-name">اسم الفريق</Label>
                      <Input id="team-name" required value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                    </div>

                    <div>
                      <Label>اختر أحد التحديات الأساسية</Label>
                      <Select required onValueChange={setChallenge} value={challenge}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر تحدي..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smart-infrastructure">تحديات البنية التحتية الذكية</SelectItem>
                          <SelectItem value="environmental">تحديات بيئية</SelectItem>
                          <SelectItem value="crowd">تحديات الحشود</SelectItem>
                          <SelectItem value="health">تحديات صحية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="challenge-reason">لماذا اخترت هذا التحدي؟</Label>
                      <Textarea id="challenge-reason" required value={challengeReason} onChange={(e) => setChallengeReason(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="idea-name">ما اسم الفكرة الابتكارية (عنوان قصير)</Label>
                      <Input id="idea-name" required value={ideaName} onChange={(e) => setIdeaName(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="idea-description">ماهو وصف الفكرة الابتكارية (نبذة مختصرة توضح المنتج او الخدمة المقدمة ان وجد)</Label>
                      <Textarea id="idea-description" required value={ideaDescription} onChange={(e) => setIdeaDescription(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="idea-solution">ما هو الحل للمشكلة الابتكارية (نبذة مختصرة لحل المشكلة)</Label>
                      <Textarea id="idea-solution" required value={ideaSolution} onChange={(e) => setIdeaSolution(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="idea-results">النتائج المتوقعة / المخرجات للفكرة الابتكارية</Label>
                      <Textarea id="idea-results" required value={ideaResults} onChange={(e) => setIdeaResults(e.target.value)} />
                    </div>

                    <div>
                      <Label>مرحلة الفكرة الابتكارية</Label>
                      <RadioGroup required value={ideaStage} onValueChange={setIdeaStage} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="idea" id="r1" />
                          <Label htmlFor="r1">فكرة: المرحلة الاولى</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="prototype" id="r2" />
                          <Label htmlFor="r2">منتج اولي: مرحلة التجربة</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ready" id="r3" />
                          <Label htmlFor="r3">منتج جاهز: مرحلة البيع</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="attachments-link">إضافة مرفقات (رابط ون درايف)</Label>
                      <Input id="attachments-link" type="url" value={attachmentsLink} onChange={(e) => setAttachmentsLink(e.target.value)} />
                      <p className="text-xs text-gray-500 mt-1">ارفاق المتوفر من شعار، ملف تعريفي، الخ. تأكد من أن إمكانية الوصول متاحة للجميع.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="has-participated" checked={hasParticipated} onCheckedChange={(checked) => setHasParticipated(!!checked)} />
                        <Label htmlFor="has-participated">هل تم مشاركة الفكرة / او حققت الفكرة جوائز داخل السعودية؟</Label>
                      </div>
                      {hasParticipated && (
                        <div>
                          <Label htmlFor="participation-details">الرجاء ذكر (اسم التحدي / الهاكثون والمركز)</Label>
                          <Input id="participation-details" required={hasParticipated} value={participationDetails} onChange={(e) => setParticipationDetails(e.target.value)} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Number of Team Members */}
                  <div>
                    <Label htmlFor="member-count">عدد أعضاء الفريق (باستثناء القائد)</Label>
                    <Select value={memberCount.toString()} onValueChange={handleMemberCountChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 أعضاء</SelectItem>
                        <SelectItem value="3">3 أعضاء</SelectItem>
                        <SelectItem value="4">4 أعضاء</SelectItem>
                        <SelectItem value="5">5 أعضاء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Team Members Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold border-b pb-2">معلومات أعضاء الفريق</h3>
                    {members.slice(0, memberCount).map((member, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <h4 className="font-medium text-lg">العضو {index + 1}</h4>
                        {renderParticipantFields(member, (field, value) => updateMember(index, field, value), `member-${index}`)}
                      </div>
                    ))}
                  </div>
                </>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(!!checked)} />
                <Label htmlFor="terms">أوافق على الشروط والأحكام</Label>
              </div>

              <Button type="submit" className="w-full text-lg py-3" disabled={isSubmitting || !agreeToTerms}>
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال التسجيل'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
