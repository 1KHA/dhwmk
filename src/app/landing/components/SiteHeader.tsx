import "../landing.css";

/*
 * Shared site header (partner logos). Styled by landing.css, so outside the
 * landing page it must sit inside the `.dhl-viewport > .dhl` frame — pass
 * `standalone` to have the frame added.
 */
export default function SiteHeader({ standalone = false }: { standalone?: boolean }) {
  const header = (
    <header className="dhl-header">
      <div className="dhl-logos">
        <img src="/logos/03.png" width={2196} height={982} alt="هيئة تنمية البحث والتطوير والابتكار" />
        <img src="/logos/02.png" width={792} height={792} alt="جامعة دار الحكمة" />
        <img src="/logos/01.png" width={678} height={953} alt="مؤسسة صالح عبدالله كامل الإنسانية" />
      </div>
    </header>
  );
  if (!standalone) return header;
  return (
    <div className="dhl-viewport">
      <div className="dhl" dir="rtl" lang="ar">
        {header}
      </div>
    </div>
  );
}
