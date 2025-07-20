'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/../../components/ui/use-toast'

interface TeamMember {
  fullName: string
  phoneNumber: string
  email: string
  specialty: string
}

export default function RegisterTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Team Leader Info
  const [leaderInfo, setLeaderInfo] = useState<TeamMember>({
    fullName: '',
    phoneNumber: '',
    email: '',
    specialty: ''
  })
  
  // Team Info
  const [teamName, setTeamName] = useState('')
  const [teamIdea, setTeamIdea] = useState('')
  const [memberCount, setMemberCount] = useState<number>(2)
  
  // Team Members
  const [members, setMembers] = useState<TeamMember[]>(
    Array(2).fill(null).map(() => ({
      fullName: '',
      phoneNumber: '',
      email: '',
      specialty: ''
    }))
  )

  const handleMemberCountChange = (value: string) => {
    const count = parseInt(value)
    setMemberCount(count)
    
    // Adjust members array
    if (count > members.length) {
      const newMembers = [...members]
      for (let i = members.length; i < count; i++) {
        newMembers.push({
          fullName: '',
          phoneNumber: '',
          email: '',
          specialty: ''
        })
      }
      setMembers(newMembers)
    } else {
      setMembers(members.slice(0, count))
    }
  }

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName,
          teamIdea,
          leader: leaderInfo,
          members: members.slice(0, memberCount)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "نجح!",
          description: "تم إرسال النموذج بنجاح",
        })
        // Reset form or redirect
        router.push('/')
      } else {
        toast({
          title: "خطأ",
          description: data.error || "فشل إرسال النموذج",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال النموذج",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>نموذج تسجيل المشاركين</CardTitle>
            <CardDescription>
              سجل فريقك للمشاركة في الهاكاثون
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Leader Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">معلومات قائد الفريق</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="leader-name">الاسم الكامل</Label>
                    <Input
                      id="leader-name"
                      required
                      value={leaderInfo.fullName}
                      onChange={(e) => setLeaderInfo({ ...leaderInfo, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="leader-phone">رقم الهاتف</Label>
                    <Input
                      id="leader-phone"
                      type="tel"
                      required
                      value={leaderInfo.phoneNumber}
                      onChange={(e) => setLeaderInfo({ ...leaderInfo, phoneNumber: e.target.value })}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leader-email">البريد الإلكتروني</Label>
                    <Input
                      id="leader-email"
                      type="email"
                      required
                      value={leaderInfo.email}
                      onChange={(e) => setLeaderInfo({ ...leaderInfo, email: e.target.value })}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leader-specialty">التخصص</Label>
                    <Input
                      id="leader-specialty"
                      required
                      value={leaderInfo.specialty}
                      onChange={(e) => setLeaderInfo({ ...leaderInfo, specialty: e.target.value })}
                    />
                  </div>
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">معلومات أعضاء الفريق</h3>
                {members.slice(0, memberCount).map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-medium">العضو {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`member-${index}-name`}>الاسم الكامل</Label>
                        <Input
                          id={`member-${index}-name`}
                          required
                          value={member.fullName}
                          onChange={(e) => updateMember(index, 'fullName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`member-${index}-phone`}>رقم الهاتف</Label>
                        <Input
                          id={`member-${index}-phone`}
                          type="tel"
                          required
                          value={member.phoneNumber}
                          onChange={(e) => updateMember(index, 'phoneNumber', e.target.value)}
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`member-${index}-email`}>البريد الإلكتروني</Label>
                        <Input
                          id={`member-${index}-email`}
                          type="email"
                          required
                          value={member.email}
                          onChange={(e) => updateMember(index, 'email', e.target.value)}
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`member-${index}-specialty`}>التخصص</Label>
                        <Input
                          id={`member-${index}-specialty`}
                          required
                          value={member.specialty}
                          onChange={(e) => updateMember(index, 'specialty', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">معلومات الفريق</h3>
                <div>
                  <Label htmlFor="team-name">اسم الفريق</Label>
                  <Input
                    id="team-name"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="team-idea">فكرة الفريق</Label>
                  <Textarea
                    id="team-idea"
                    required
                    rows={4}
                    value={teamIdea}
                    onChange={(e) => setTeamIdea(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال التسجيل'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
