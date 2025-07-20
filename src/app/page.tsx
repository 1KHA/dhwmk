import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Calendar, FileText } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">منصة الهاكاثون</h1>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="hover:underline">
                الرئيسية
              </Link>
              <Link href="/events" className="hover:underline">
                الفعاليات
              </Link>
              <Link href="/about" className="hover:underline">
                عن المنصة
              </Link>
              <Link href="/contact" className="hover:underline">
                اتصل بنا
              </Link>
            </nav>
            <div className="flex gap-4">
              <Link href="/admin-hackton-dashboard">
                <Button variant="outline" className="bg-white hover:bg-white/90">
                  لوحة التحكم
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">منصة إدارة الهاكاثون</h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          منصة متكاملة لإدارة فعاليات الهاكاثون بكفاءة عالية، تتيح للمشاركين والمنظمين والحكام تجربة سلسة ومميزة
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/admin-hackton-dashboard">
            <Button size="lg" className="gap-2">
              الدخول للوحة التحكم
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="gap-2">
            استكشاف المنصة
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">مميزات المنصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">إدارة المسابقات</h3>
            <p className="text-muted-foreground">
              إدارة كاملة للمسابقات والتحديات مع نظام تقييم متكامل للمشاريع
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">إدارة الفرق</h3>
            <p className="text-muted-foreground">
              تشكيل وإدارة الفرق بسهولة مع إمكانية التواصل المباشر بين أعضاء الفريق
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">جدولة الفعاليات</h3>
            <p className="text-muted-foreground">
              جدولة وتنظيم الفعاليات والورش التدريبية مع نظام تذكير متكامل
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">تقديم المشاريع</h3>
            <p className="text-muted-foreground">
              نظام متكامل لتقديم ومراجعة المشاريع مع إمكانية تقديم الملاحظات
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">منصة الهاكاثون</h3>
              <p className="text-muted-foreground">
                منصة متكاملة لإدارة فعاليات الهاكاثون بكفاءة عالية
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-muted-foreground hover:text-foreground">
                    الفعاليات
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    عن المنصة
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    اتصل بنا
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">البريد الإلكتروني: info@hackathon.com</li>
                <li className="text-muted-foreground">الهاتف: 0123456789</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">النشرة البريدية</h3>
              <p className="text-muted-foreground mb-2">
                اشترك في النشرة البريدية للحصول على آخر الأخبار والتحديثات
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="flex-1 rounded-r-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button className="rounded-l-none">اشتراك</Button>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} منصة الهاكاثون. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
