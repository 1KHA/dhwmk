import "./landing.css";

import ImageCarousel from "./components/ImageCarousel";
import FAQSection from "./components/FAQSection";

import logos from "./assets/logos.png";
import footerLogo from "./assets/footer-logo.png";
import footerOrn from "./assets/footer-orn.png";
import iconMail from "./assets/icon-mail.png";
import iconPhone from "./assets/icon-phone.png";
import heroMark from "./assets/hero-mark.png";
import ornTopLeft from "./assets/orn-top-left.png";
import ornBottomLeft from "./assets/orn-bottom-left.png";
import ornBottomRight from "./assets/orn-bottom-right.png";
import ornTarget from "./assets/orn-target.png";
import glow from "./assets/glow.png";
import iconCalendar from "./assets/icon-calendar.png";
import iconClock from "./assets/icon-clock.png";
import iconTrack1 from "./assets/icon-track1.png";
import iconTrack2 from "./assets/icon-track2.png";
import iconTrack3 from "./assets/icon-track3.png";
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

export default function Landing() {
  return (
    <div className="dhl-viewport">
      <main className="dhl" dir="rtl" lang="ar">
        {/* ===== Header ===== */}
        <header className="dhl-header">
          <img className="dhl-logos" src={logos.src} alt="جامعة دار الحكمة | هيئة تنمية البحث والتطوير والابتكار | مؤسسة صالح عبدالله كامل الإنسانية" />
        </header>

        {/* ===== Hero ===== */}
        <section className="dhl-hero">
          <img className="dhl-orn-tl" src={ornTopLeft.src} alt="" aria-hidden="true" />
          <img className="dhl-orn-bl" src={ornBottomLeft.src} alt="" aria-hidden="true" />
          <img className="dhl-orn-br" src={ornBottomRight.src} alt="" aria-hidden="true" />

          <h1 className="dhl-hero-title">
            جائزة مايدة محي الدين ناظر للابتكار <span className="dhl-hero-num">3</span>
          </h1>
          <img className="dhl-hero-mark" src={heroMark.src} alt="" aria-hidden="true" />
          <div className="dhl-hero-badge">هاكاثون الابتكار</div>

          <p className="dhl-hero-par">
            تحدي يجمع طلبة الجامعات لاستكشاف وتوظيف الابتكارات الجامعية، توفر جائزة مايـدة محي الديـــن ناظـــر للابتكــــار
            <br />
            هاكاثون الابتكار فرصة للعمل ضمن فرق تنافسية على تطوير حلول مبتكرة تسهم في تعزيز الاستدامة وجودة الحيـاة
          </p>

          <p className="dhl-hero-countdown-label">الوقت المتبقي على إغلاق التسجيل</p>

          {/* Empty space below the label is reserved for a live countdown overlay */}

          <img className="dhl-panel-glow" src={glow.src} alt="" aria-hidden="true" />
          <div className="dhl-panel">
            <div className="dhl-panel-group">
              <img className="dhl-panel-icon dhl-panel-cal" src={iconCalendar.src} alt="" aria-hidden="true" />
              <div className="dhl-panel-text">
                <div>أعمال الهاكاثون</div>
                <div>05 - 09&nbsp; أكتوبر</div>
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
          <h2 className="dhl-sect-title dhl-tracks-title">
            المسارات <Diamond />
          </h2>
          <div className="dhl-track-card dhl-track-1">
            <img className="dhl-track-icon" src={iconTrack1.src} alt="" aria-hidden="true" />
            <p>إحيـاء اللغة العربيـة<br />بحلول رقمية مبتكرة</p>
          </div>
          <div className="dhl-track-card dhl-track-2">
            <img className="dhl-track-icon" src={iconTrack2.src} alt="" aria-hidden="true" />
            <p>تطـوير كفـاءة العاملين بقـطاع<br />السياحة الدينية (الحج والعمرة)</p>
          </div>
          <div className="dhl-track-card dhl-track-3">
            <img className="dhl-track-icon" src={iconTrack3.src} alt="" aria-hidden="true" />
            <p>تحسيـن جـودة الحيـاة<br />لكبار السن والمكفوفين</p>
          </div>
        </section>

        {/* ===== Prizes ===== */}
        <section className="dhl-prizes">
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
          <img className="dhl-orn-target" src={ornTarget.src} alt="" aria-hidden="true" />
          <h2 className="dhl-target-title">
            <Diamond /> الفئة المستهدفة
          </h2>
          <p className="dhl-target-text">طلبة الجامعات في مرحلتي البكالوريوس والماجستير</p>
        </section>

        {/* ===== Conditions ===== */}
        <section className="dhl-conds">
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
          <h2 className="dhl-sect-title dhl-journey-title">
            رحلة المشترك <Diamond />
          </h2>
          {[
            { cls: "dhl-jcard-1", n: "1", title: "التسجيل", note: "", dates: <>31 أغسطس- 2 أكتوبر<br />2025 م</> },
            { cls: "dhl-jcard-2", n: "2", title: "الفـرز والترشـيح", note: "", dates: <>14 سبتمبر – 2 أكتوبر<br />2025 م</> },
            { cls: "dhl-jcard-3", n: "3", title: "أعمال الهاكاثون", note: "(حضوري)", dates: <>5&nbsp; أكتوبر – 6 أكتوبر<br />2025 م</> },
            { cls: "dhl-jcard-4", n: "4", title: "التوجيه والإرشاد", note: "(افتراضي)", dates: <>7 أكتوبر – 8 أكتوبر<br />2025 م</> },
            { cls: "dhl-jcard-5", n: "5", title: "الحفــل الختامــي", note: "", dates: <>9&nbsp; أكتوبر<br />2025 م</> },
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
            المشاريع الفائزة في النسخة الثانية من جائزة مايدة محي الدين ناظر للابتكار <Diamond />
          </h2>
        </section>

        {/* ===== Winning projects carousel ===== */}
        <ImageCarousel />

        {/* ===== FAQ ===== */}
        <FAQSection />

        {/* ===== Footer ===== */}
        <footer className="dhl-footer">
          <img className="dhl-f-logo" src={footerLogo.src} alt="شركة وادي مكة للتقنية - الجهة المنظمة" />
          <img className="dhl-f-orn" src={footerOrn.src} alt="" aria-hidden="true" />
          <h2 className="dhl-f-head">للتواصل</h2>
          <img className="dhl-f-mail-icon" src={iconMail.src} alt="" aria-hidden="true" />
          <a className="dhl-f-email" href="mailto:Nomow@wadimakka.sa">Nomow@wadimakka.sa</a>
          <img className="dhl-f-phone-icon" src={iconPhone.src} alt="" aria-hidden="true" />
          <a className="dhl-f-phone" href="tel:+966545671998">966545671998</a>
        </footer>
      </main>
    </div>
  );
}
