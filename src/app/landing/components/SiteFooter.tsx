import "../landing.css";

import Icon from "./Icon";
import footerLogo from "../assets/footer-logo.png";
import iconMail from "../assets/icon-mail.png";
import iconPhone from "../assets/icon-phone.png";

/*
 * Shared site footer (organiser logo + contact). Styled by landing.css, so
 * outside the landing page it must sit inside the `.dhl-viewport > .dhl`
 * frame — pass `standalone` to have the frame added.
 */
export default function SiteFooter({ standalone = false }: { standalone?: boolean }) {
  const footer = (
    <footer className="dhl-footer">
      <img className="dhl-f-logo" src={footerLogo.src} alt="شركة وادي مكة للتقنية - الجهة المنظمة" />
      <Icon name="link" className="dhl-ico-footer" />
      <h2 className="dhl-f-head">للتواصل</h2>
      <img className="dhl-f-mail-icon" src={iconMail.src} alt="" aria-hidden="true" />
      <a className="dhl-f-email" href="mailto:wmvc@wadimakkah.sa">wmvc@wadimakkah.sa</a>
      <img className="dhl-f-phone-icon" src={iconPhone.src} alt="" aria-hidden="true" />
      <a className="dhl-f-phone" href="tel:+966545671998">966545671998</a>
    </footer>
  );
  if (!standalone) return footer;
  return (
    <div className="dhl-viewport">
      <div className="dhl" dir="rtl" lang="ar">
        {footer}
      </div>
    </div>
  );
}
