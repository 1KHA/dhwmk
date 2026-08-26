import "./landing.css";

import ImageCarousel from "./components/ImageCarousel";
import FAQSection from "./components/FAQSection";
import CountdownTimer from "./components/CountdownTimer";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import Icon from "./components/Icon";

import heroMark from "./assets/hero-mark.png";
import glow from "./assets/glow.png";
import iconCalendar from "./assets/icon-calendar.png";
import iconClock from "./assets/icon-clock.png";
import iconCheck from "./assets/icon-check.png";
import sarBanner from "./assets/sar-banner.png";
import sarPrize from "./assets/sar-prize.png";

/*
 * Pixel-perfect recreation of the dhnew001.png landing image.
 * All coordinates in landing.css are the original image's pixel values
 * (3840 x 13116) expressed in `--u` units (1u = 100cqw / 3840), so the
 * page scales exactly like the image does at any viewport width.
 */

const Diamond = ({ className = "" }: { className?: string }) => (
  <span className={`dhl-diamond ${className}`} aria-hidden="true" />
);

const REGISTER_URL = "/register-team";

/* Deadline the hero timer counts down to (local time). */
const COUNTDOWN_TARGET = "2026-09-24T23:59:59";

export default function Landing() {
  return (
    <div className="dhl-viewport">
      <main className="dhl" dir="rtl" lang="ar">
        {/* ===== Header ===== */}
        <SiteHeader />

        {/* ===== Hero ===== */}
        <section className="dhl-hero">
          <Icon name="burst" className="dhl-ico-hero-burst" />
          <Icon name="arches" className="dhl-ico-hero-arches" />
          <Icon name="arcs" className="dhl-ico-hero-arcs" />

          <h1 className="dhl-hero-title">
            جائزة مايدة محي الدين ناظر للابتكار <span className="dhl-hero-num">4</span>
          </h1>
          <img className="dhl-hero-mark" src={heroMark.src} alt="" aria-hidden="true" />
          <div className="dhl-hero-badge">هاكاثون الابتكار</div>

          <p className="dhl-hero-par">
            تحدي يجمع طلبة الجامعات لاستكشاف وتوظيف الابتكارات الجامعية، توفر جائزة مايـدة محي الديـــن ناظـــر للابتكــــار
            <br />
            هاكاثون الابتكار فرصة للعمل ضمن فرق تنافسية على تطوير حلول مبتكرة تسهم في تعزيز الاستدامة وجودة الحيـاة
          </p>

          <p className="dhl-hero-countdown-label">الوقت المتبقي على إغلاق التسجيل</p>

          {/* The artwork reserves this space for the live countdown */}
          <CountdownTimer targetDate={COUNTDOWN_TARGET} />

          <img className="dhl-panel-glow" src={glow.src} alt="" aria-hidden="true" />
          <div className="dhl-panel">
            <div className="dhl-panel-group">
              <img className="dhl-panel-icon dhl-panel-cal" src={iconCalendar.src} alt="" aria-hidden="true" />
              <div className="dhl-panel-text">
                <div>أعمال الهاكاثون</div>
                <div>04 - 08&nbsp; أكتوبر</div>
              </div>
            </div>
            <div className="dhl-panel-group">
              <img className="dhl-panel-icon dhl-panel-clock" src={iconClock.src} alt="" aria-hidden="true" />
              <div className="dhl-panel-text">
                <div>من&nbsp; 04:00 مساءً</div>
                <div>إلى 09:00 مساءً</div>
              </div>
            </div>
          </div>

          <p className="dhl-hero-univ">جامعة دار الحكمة - مدينة جدة</p>
        </section>

        {/* ===== Ready for the challenge ===== */}
        <section className="dhl-ready">
          <h2 className="dhl-ready-head">جاهز للتحدي؟</h2>
          <p className="dhl-ready-par">
            سجل الآن وكن جزءًا من رحلة الابتكار لتطوير حلول
            <br />
            وضمان جـودة الحيـاة
          </p>
          <a className="dhl-ready-btn" href={REGISTER_URL}>سجل الآن</a>

          <div className="dhl-banner">
            <Diamond />
            <span className="dhl-banner-text">جوائز بقيمة 200,000</span>
            <img className="dhl-banner-sar" src={sarBanner.src} alt="ريال سعودي" />
            <Diamond />
          </div>
        </section>

        {/* ===== Tracks ===== */}
        <section className="dhl-tracks">
          <Icon name="bars" className="dhl-ico-tracks" />
          <h2 className="dhl-sect-title dhl-tracks-title">
            المسارات <Diamond />
          </h2>
          <div className="dhl-track-card dhl-track-1">
            <img className="dhl-track-icon" src="/icons/icon03.png" alt="" aria-hidden="true" />
            <p>تعزيز الدمج المجتمعي<br />لكبار السن والمكفوفين</p>
          </div>
          <div className="dhl-track-card dhl-track-2">
            <img className="dhl-track-icon" src="/icons/icon02.png" alt="" aria-hidden="true" />
            <p>إثراء تجربة ضيوف الرحمن<br />في المدن المقدسة</p>
          </div>
          <div className="dhl-track-card dhl-track-3">
            <img className="dhl-track-icon" src="/icons/icon01.png" alt="" aria-hidden="true" />
            <p>الحلول الاجتماعية<br />المستدامة</p>
          </div>
        </section>

        {/* ===== Prizes ===== */}
        <section className="dhl-prizes">
          <Icon name="pinwheel" className="dhl-ico-dark dhl-ico-prizes" />
          <h2 className="dhl-sect-title dhl-prizes-title">
            الجوائز <Diamond />
          </h2>
          {[
            { cls: "dhl-prize-2", title: "المركز الثاني", amount: "70,000" },
            { cls: "dhl-prize-1", title: "المركز الأول", amount: "90,000" },
            { cls: "dhl-prize-3", title: "المركز الثالث", amount: "40,000" },
          ].map((p) => (
            <div key={p.cls} className={`dhl-prize-card ${p.cls}`}>
              <div className="dhl-prize-name">{p.title}</div>
              <div className="dhl-prize-amount" dir="ltr">
                <img className="dhl-prize-sar" src={sarPrize.src} alt="ريال سعودي" />
                <span>{p.amount}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ===== Target audience ===== */}
        <section className="dhl-target">
          <Icon name="chevron" className="dhl-ico-dark dhl-ico-target" />
          <h2 className="dhl-target-title">
            <Diamond /> الفئة المستهدفة
          </h2>
          <p className="dhl-target-text">طلبة الجامعات في مرحلتي البكالوريوس والماجستير</p>
        </section>

        {/* ===== Conditions ===== */}
        <section className="dhl-conds">
          <Icon name="bars2" className="dhl-ico-dark dhl-ico-conds" />
          <h2 className="dhl-sect-title dhl-conds-title">
            شروط قبول المشاريع في هاكاثون الابتكار <Diamond />
          </h2>
          {[
            { cls: "dhl-cond-1", text: "يجب ألا تكون الفكرة سبق لهـا الفـوز بجائزة مايدة محي الدين ناظر للابتكار" },
            { cls: "dhl-cond-2", text: "التقديم على نمـوذج التسجيل وتعبئـة الأسئلة بشـكــل كامـــل" },
            { cls: "dhl-cond-3", text: "يتكون الفريق من 3 إلى 5 أعضاء كحد أقصى، ولا يمكن إضافة أو تسجيــل أو تغيير أعضـاء الفريق إلا بموافقـة إدارة الهــاكــاثـــــون" },
            { cls: "dhl-cond-4", text: "يُشترط أن تكـون الفكرة مرتبطـة مباشـرةً بتحديات مسارات الهاكاثون المحددة، وقابلة للتطبيق على أرض الواقـع بشكــل فعلــي وعمــلـــي" },
            { cls: "dhl-cond-5", text: "تحديد المشكلة المراد حلها، مـع الإشـارة إلى ما إذا كانت جديدة أو سبق معالجتها، مع التأكيد أن يكون الحل المقترح مبتكرًا" },
            { cls: "dhl-cond-6", text: "يلتـزم الفريــق المقبـول بالحضـور طيلـة أيـام الهاكاثون في مقر جامعة دار الحكمة والمشاركة في ورش العمل الحضورية بالمواعيد المحـددة، وتعد متابعة الحضور والتحضير مسؤولية الفريق نفسه، ويستبعد الفريق في حال تغيبه الكامل ليومين متتاليين" },
            { cls: "dhl-cond-7", text: "يمنـع مشـاركة روابـط الـجلـســات الإرشادية الافتراضية لغير المقبولين" },
            { cls: "dhl-cond-8", text: "يلتزم المشارك باحترام جميع المشاركين دون أي تمييز، ويُعد مسؤولاً عن سلوكـه، ولإدارة التحدي الحق في اتخـاذ ما تـراه مناســباً من إجراءات عند المخالفة" },
          ].map((c) => (
            <div key={c.cls} className={`dhl-cond-card ${c.cls}`}>
              <img className="dhl-cond-check" src={iconCheck.src} alt="" aria-hidden="true" />
              <p>{c.text}</p>
            </div>
          ))}
        </section>

        {/* ===== Participant journey ===== */}
        <section className="dhl-journey">
          <Icon name="cube" className="dhl-ico-journey" />
          <h2 className="dhl-sect-title dhl-journey-title">
            رحلة المشترك <Diamond />
          </h2>
          {[
            { cls: "dhl-jcard-1", n: "1", title: "الاستقطاب والتسجيل", note: "", dates: <>1 - 24 سبتمبر<br />2026 م</> },
            { cls: "dhl-jcard-2", n: "2", title: "الفـرز والترشـيح", note: "", dates: <>13 - 30 سبتمبر<br />2026 م</> },
            { cls: "dhl-jcard-3", n: "3", title: " القبول والرفض", note: "(الموعد النهائي)", dates: <>30 سبتمبر<br />2026 م</> },
            { cls: "dhl-jcard-4", n: "4", title: "تشغيل الهاكاثون", note: "(حضوري)", dates: <>4 - 8 أكتوبر<br />2026 م</> },
            { cls: "dhl-jcard-5", n: "5", title: "الحفــل الختامــي", note: "", dates: <>8&nbsp; أكتوبر<br />2026 م</> },
          ].map((s) => (
            <div key={s.cls} className={`dhl-jcard ${s.cls}`}>
              <span className="dhl-jbadge">{s.n}</span>
              <div className="dhl-jcard-head">
                {s.title} {s.note && <small>{s.note}</small>}
              </div>
              <div className="dhl-jcard-dates">{s.dates}</div>
            </div>
          ))}
        </section>

        {/* ===== Bottom band ===== */}
        <section className="dhl-bottom">
          <h2 className="dhl-bottom-text">
            المشاريع الفائزة في النسخة الثالثة من جائزة مايدة محي الدين ناظر للابتكار <Diamond />
          </h2>
        </section>

        {/* ===== Winning projects carousel ===== */}
        <ImageCarousel />

        {/* ===== FAQ ===== */}
        <FAQSection />

        {/* ===== Footer ===== */}
        <SiteFooter />
      </main>
    </div>
  );
}
