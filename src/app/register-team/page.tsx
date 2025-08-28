'use client'

import { useState, useEffect } from 'react'
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
  fullName: string
  contactNumber: string
  email: string
  gender: string
  isUniversityStudent: boolean
  universityMajor: string
  university: string
  professionalField: string
  city: string
  canAttendHackathon: boolean
}

const initialParticipantState: Participant = {
  fullName: '',
  contactNumber: '',
  email: '',
  gender: '',
  isUniversityStudent: false,
  universityMajor: '',
  university: '',
  professionalField: '',
  city: '',
  canAttendHackathon: false,
}

const initialFormState = {
  registrationType: '', // 'individual' or 'team'
  teamName: '',
  hackathonTrack: '',
  ideaDescription: '',
  hearAboutUs: '',
  agreeToTerms: false,
  leaderInfo: initialParticipantState,
  members: Array(2).fill(null).map(() => ({ ...initialParticipantState })),
  memberCount: 3, // Default to 3 members (leader + 2)
}

type FormState = typeof initialFormState;

export default function RegisterTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)

  const [formState, setFormState] = useState(() => {
    if (typeof window === 'undefined') {
      return initialFormState
    }
    try {
      const savedState = localStorage.getItem('registrationForm')
      return savedState ? JSON.parse(savedState) : initialFormState
    } catch (error) {
      console.error('Failed to parse form state from localStorage', error)
      return initialFormState
    }
  })

  useEffect(() => {
    localStorage.setItem('registrationForm', JSON.stringify(formState))
  }, [formState])

  const handleStateChange = (field: keyof FormState, value: any) => {
    setFormState((prev: FormState) => ({ ...prev, [field]: value }))
  }

  const handleLeaderChange = (field: keyof Participant, value: string | boolean) => {
    setFormState((prev: FormState) => ({
      ...prev,
      leaderInfo: { ...prev.leaderInfo, [field]: value },
    }))
  }

  const handleMemberChange = (index: number, field: keyof Participant, value: string | boolean) => {
    setFormState((prev: FormState) => {
      const newMembers = [...prev.members]
      newMembers[index] = { ...newMembers[index], [field]: value }
      return { ...prev, members: newMembers }
    })
  }

  const handleMemberCountChange = (value: string) => {
    const count = parseInt(value)
    setFormState((prev: FormState) => {
      const currentMembers = prev.members
      if (count > currentMembers.length) {
        const newMembers = [...currentMembers]
        for (let i = currentMembers.length; i < count - 1; i++) { // count - 1 because leader is separate
          newMembers.push({ ...initialParticipantState })
        }
        return { ...prev, memberCount: count, members: newMembers }
      }
      return { ...prev, memberCount: count, members: currentMembers.slice(0, count - 1) }
    })
  }

  const handleRegistrationTypeChange = (value: string) => {
    setFormState((prev: FormState) => ({
      ...prev,
      registrationType: value,
      teamName: value === 'individual' ? '' : prev.teamName,
      hackathonTrack: value === 'individual' ? '' : prev.hackathonTrack,
      ideaDescription: value === 'individual' ? '' : prev.ideaDescription,
      hearAboutUs: value === 'individual' ? '' : prev.hearAboutUs,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    
    // Add registration type and team info
    formData.append('registrationType', formState.registrationType)
    formData.append('isTeamRegistration', formState.registrationType === 'team' ? 'true' : 'false')
    
    if (formState.registrationType === 'team') {
      formData.append('teamName', formState.teamName)
      formData.append('hackathonTrack', formState.hackathonTrack)
      formData.append('ideaDescription', formState.ideaDescription)
      formData.append('hearAboutUs', formState.hearAboutUs)
      formData.append('memberCount', formState.memberCount.toString())
    }

    // Add participant data
    formData.append('leaderInfo', JSON.stringify(formState.leaderInfo))
    if (formState.registrationType === 'team') {
      formData.append('members', JSON.stringify(formState.members.slice(0, formState.memberCount - 1)))
    }

    if (attachmentFile) {
      formData.append('attachment', attachmentFile)
    }

    try {
      const response = await fetch('/api/register-team', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'نجح!',
          description: 'تم إرسال النموذج بنجاح',
        })
        localStorage.removeItem('registrationForm')
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
        <Label htmlFor={`${prefix}-fullName`}>الاسم كاملًا</Label>
        <Input 
          id={`${prefix}-fullName`} 
          required 
          value={participant.fullName} 
          onChange={(e) => updateFn('fullName', e.target.value)} 
        />
      </div>
      <div>
        <Label htmlFor={`${prefix}-contactNumber`}>رقم التواصل</Label>
        <Input 
          id={`${prefix}-contactNumber`} 
          type="tel" 
          required 
          value={participant.contactNumber} 
          onChange={(e) => updateFn('contactNumber', e.target.value)} 
          dir="ltr" 
        />
      </div>
      <div>
        <Label htmlFor={`${prefix}-email`}>البريد الإلكتروني</Label>
        <Input 
          id={`${prefix}-email`} 
          type="email" 
          required 
          value={participant.email} 
          onChange={(e) => updateFn('email', e.target.value)} 
          dir="ltr" 
        />
      </div>
      <div>
        <Label>الجنس المتقدم: ذكر أم أنثى؟</Label>
        <Select required onValueChange={(value) => updateFn('gender', value)} value={participant.gender}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الجنس..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">ذكر</SelectItem>
            <SelectItem value="female">أنثى</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={`${prefix}-isUniversityStudent`} 
          checked={participant.isUniversityStudent} 
          onCheckedChange={(checked: boolean | 'indeterminate') => updateFn('isUniversityStudent', !!checked)} 
        />
        <Label htmlFor={`${prefix}-isUniversityStudent`}>هل أنت طالب في الجامعة؟</Label>
      </div>
      <div>
        <Label htmlFor={`${prefix}-universityMajor`}>اذكر تخصصك الجامعي</Label>
        <Input 
          id={`${prefix}-universityMajor`} 
          required 
          value={participant.universityMajor} 
          onChange={(e) => updateFn('universityMajor', e.target.value)} 
        />
      </div>
      <div>
        <Label htmlFor={`${prefix}-university`}>اذكر جامعتك</Label>
        <Input 
          id={`${prefix}-university`} 
          required 
          value={participant.university} 
          onChange={(e) => updateFn('university', e.target.value)} 
        />
      </div>
      <div>
        <Label htmlFor={`${prefix}-professionalField`}>ماهو مجالك المهني؟</Label>
        <Input 
          id={`${prefix}-professionalField`} 
          required 
          value={participant.professionalField} 
          onChange={(e) => updateFn('professionalField', e.target.value)} 
        />
      </div>
      <div>
        <Label htmlFor={`${prefix}-city`}>المدينة</Label>
        <Input 
          id={`${prefix}-city`} 
          required 
          value={participant.city} 
          onChange={(e) => updateFn('city', e.target.value)} 
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id={`${prefix}-canAttendHackathon`} 
          checked={participant.canAttendHackathon} 
          onCheckedChange={(checked: boolean | 'indeterminate') => updateFn('canAttendHackathon', !!checked)} 
        />
        <Label htmlFor={`${prefix}-canAttendHackathon`}>هل تستطيع التواجد خلال فترة الهاكاثون في مقر - جامعة دار الحكمة؟</Label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#620F10' }}>
      {/* Header Image Section */}
      <div className="w-full">
        <img src="/header.png" alt="Header" className="w-full h-auto" />
      </div>
      
      {/* Form Section */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>نموذج تسجيل المشاركين</CardTitle>
            <CardDescription>سجل للمشاركة في الهاكاثون</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Registration Type Selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">نوع المشاركة</h3>
                <div>
                  <Label>هل ستشارك كفريق؟</Label>
                  <RadioGroup 
                    required 
                    value={formState.registrationType} 
                    onValueChange={handleRegistrationTypeChange} 
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual">مشاركة فردية</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="team" id="team" />
                      <Label htmlFor="team">مشاركة كفريق</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Team Information - Only show if team registration */}
              {formState.registrationType === 'team' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold border-b pb-2">معلومات الفريق</h3>
                  
                  <div>
                    <Label htmlFor="team-name">اسم الفريق</Label>
                    <Input 
                      id="team-name" 
                      required 
                      value={formState.teamName} 
                      onChange={(e) => handleStateChange('teamName', e.target.value)} 
                    />
                  </div>

                  <div>
                    <Label>أي مسار من مسارات الهاكاثون؟</Label>
                    <Select 
                      required 
                      onValueChange={(value) => handleStateChange('hackathonTrack', value)} 
                      value={formState.hackathonTrack}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المسار..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arabic-language">إحياء اللغة العربية بحلول رقمية مبتكرة</SelectItem>
                        <SelectItem value="elderly-blind">تحسين جودة الحياة لكبار السن والمكفوفين</SelectItem>
                        <SelectItem value="religious-tourism">تطوير كفاءة العاملين بقطاع السياحة الدينية (الحج والعمرة)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="idea-description">صف الفكرة</Label>
                    <Textarea 
                      id="idea-description" 
                      required 
                      value={formState.ideaDescription} 
                      onChange={(e) => handleStateChange('ideaDescription', e.target.value)} 
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="hear-about-us">من أين سمعت عنا</Label>
                    <Input 
                      id="hear-about-us" 
                      required 
                      value={formState.hearAboutUs} 
                      onChange={(e) => handleStateChange('hearAboutUs', e.target.value)} 
                    />
                  </div>

                  <div>
                    <Label htmlFor="member-count">عدد أعضاء الفريق (شامل القائد)</Label>
                    <Select value={String(formState.memberCount)} onValueChange={handleMemberCountChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 أعضاء</SelectItem>
                        <SelectItem value="4">4 أعضاء</SelectItem>
                        <SelectItem value="5">5 أعضاء</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="attachments-file">إضافة مرفقات (اختياري)</Label>
                    <Input 
                      id="attachments-file" 
                      type="file" 
                      onChange={(e) => setAttachmentFile(e.target.files ? e.target.files[0] : null)} 
                    />
                    <p className="text-xs text-gray-500 mt-1">ارفاق المتوفر من شعار، ملف تعريفي، الخ.</p>
                  </div>
                </div>
              )}

              {/* Participant Information */}
              {formState.registrationType && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b pb-2">
                    {formState.registrationType === 'team' ? 'معلومات قائد الفريق' : 'معلوماتك الشخصية'}
                  </h3>
                  {renderParticipantFields(formState.leaderInfo, handleLeaderChange, 'leader')}
                </div>
              )}

              {/* Team Members Information - Only show if team registration */}
              {formState.registrationType === 'team' && formState.memberCount > 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold border-b pb-2">معلومات أعضاء الفريق</h3>
                  {formState.members.slice(0, formState.memberCount - 1).map((member: Participant, index: number) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <h4 className="font-medium text-lg">العضو {index + 1}</h4>
                      {renderParticipantFields(member, (field, value) => handleMemberChange(index, field, value), `member-${index}`)}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  required 
                  checked={formState.agreeToTerms} 
                  onCheckedChange={(checked) => handleStateChange('agreeToTerms', !!checked)} 
                />
                <Label htmlFor="terms">أوافق على الشروط والأحكام</Label>
              </div>

              <Button 
                type="submit" 
                className="w-full text-lg py-3" 
                disabled={isSubmitting || !formState.agreeToTerms || !formState.registrationType}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال التسجيل'}
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
