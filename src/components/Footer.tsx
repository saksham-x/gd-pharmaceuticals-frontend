import { Link } from "react-router-dom";

import { useSite } from "../context/SiteContext";
import Lines from "./Lines";

export default function Footer() {
  const { general } = useSite();

  const hasContact = Boolean(general.phone || general.email);

  return (
    <footer className="site-footer">
      <div className="wrap" style={{ maxWidth: 1240 }}>
        <div className="foot-grid">
          <div>
            <Link className="logo" to="/">
              <span className="logo-mark">G</span>
              <span>
                <strong>{general.brandName}</strong>
                <small>{general.brandTagline}</small>
              </span>
            </Link>
            <p>
              <Lines text={general.footerText} />
            </p>
          </div>

          <div>
            <h4>Company</h4>
            <Link to="/about">About us</Link>
            <Link to="/news">News &amp; events</Link>
            <Link to="/careers">Careers</Link>
          </div>

          <div>
            <h4>Resources</h4>
            <Link to="/products">Products</Link>
            <Link to="/investors">Investor relations</Link>
            <Link to="/contact?type=Pharmacovigilance">Pharmacovigilance</Link>
          </div>

          <div>
            <h4>Contact</h4>
            <span className="t" style={hasContact ? undefined : { paddingBottom: 0 }}>
              {general.address}
            </span>
            {general.phone && <a href={`tel:${general.phone.replace(/[^\d+]/g, "")}`}>{general.phone}</a>}
            {general.email && <a href={`mailto:${general.email}`}>{general.email}</a>}
            {!hasContact && general.contactPendingText && (
              <span className="pending nodot">{general.contactPendingText}</span>
            )}
          </div>
        </div>

        <div className="foot-bottom">
          <span>{general.copyright}</span>
          <div>
            <Link to="/privacy">Privacy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
