'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { showAdminToast } from '@/components/admin/admin-toaster'
import { useAuth } from '@/contexts/auth-context'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, checkAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        console.log('✅ Admin already logged in, redirecting to dashboard');
        router.push('/admin-hackton-dashboard');
      } else {
        console.log(`⚠️ User logged in with role: ${user.role}, but not admin`);
        showAdminToast({
          title: "تحذير",
          description: `أنت مسجل دخول كـ ${user.role}. يرجى تسجيل الخروج أولاً للدخول كمسؤول.`,
          variant: "destructive",
        });
      }
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log('🔐 Admin login attempt:', { username: formData.username });

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Include cookies
      })

      const data = await response.json()

      console.log('📡 Admin login response:', { 
        status: response.status, 
        success: data.success,
        hasUser: !!data.user 
      });

      if (response.ok && data.success) {
        showAdminToast({
          title: "نجح",
          description: "تم تسجيل الدخول كمسؤول بنجاح!",
        });

        console.log('✅ Admin login successful, checking auth and redirecting...');
        
        // Refresh auth context to get updated user data
        await checkAuth();
        
        // Redirect to admin dashboard
        router.push('/admin-hackton-dashboard');
      } else {
        console.log('❌ Admin login failed:', data.error);
        showAdminToast({
          title: "خطأ",
          description: data.error || "فشل تسجيل الدخول",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      showAdminToast({
        title: "خطأ",
        description: "حدث خطأ أثناء تسجيل الدخول",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من حالة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  // Don't show login form if user is already logged in (will redirect)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري إعادة التوجيه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            تسجيل دخول المسؤول
          </CardTitle>
          <CardDescription className="text-center">
            أدخل اسم المستخدم وكلمة المرور للوصول إلى لوحة تحكم المسؤول
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin1"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                dir="ltr"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
