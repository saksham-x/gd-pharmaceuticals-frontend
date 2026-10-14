import { useState } from "react";
import { Link } from "react-router-dom";

import { FigArrow, FigFlask, Ic, Waves } from "../components/Icons";
import Lines from "../components/Lines";
import { Crumbs } from "../components/PageHead";
import SEO from "../components/SEO";
import { useSite } from "../context/SiteContext";
import { useUi } from "../context/UiContext";
import { useApi } from "../hooks/useApi";
import { getCareers, type Career } from "../services/career/careerService";
import { imageOr } from "../utils/format";

// The "Why join us" icons, in card order.
function WhyIcon({ index }: { index: number }) {
  const kind = index % 3;
  if (kind === 0) return <Ic name="heart" />;
  if (kind === 1) return <Ic name="trend" />;
  return <FigFlask color="#1266B1" />;
}

function RoleDetails({ role, onApply }: { role: Career; onApply: () => void }) {
  const apply = new URLSearchParams({ type: "Careers", role: role.title });

  return (
    <>
      <div className="eyebrow">{[role.department, role.location].filter(Boolean).join(" · ")}</div>
      <h2 style={{ fontSize: "1.6rem" }}>{role.title}</h2>
      {role.summary && <p className="lead">{role.summary}</p>}
      {role.responsibilities.length > 0 && (
        <>
          <h3 style={{ margin: "20px 0 8px", fontSize: ".95rem" }}>What you'll do</h3>
          <ul style={{ paddingLeft: 18, fontSize: 14, margin: 0 }}>
            {role.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
      <p style={{ margin: "16px 0" }}>
        {role.badge && <span className="pending">{role.badge}</span>}
      </p>
      <Link className="btn btn-primary" to={`/contact?${apply.toString()}`} onClick={onApply}>
        Apply for this role <Ic name="arrow" />
      </Link>
    </>
  );
}

export default function Careers() {
  const { careers: copy, images } = useSite();
  const { openModal, closeModal } = useUi();

  const roles = useApi(getCareers);

  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();
  const list = (roles.data ?? []).filter(
    (role) =>
      !q ||
      [role.title, role.department, role.location, role.type, role.summary].join(" ").toLowerCase().includes(q)
  );

  const scrollToRoles = (event: React.MouseEvent) => {
    event.preventDefault();
    document.getElementById("roles")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO title="Careers" description={copy.head.lead} />

      <div className="page-head split-bg">
        <Waves />
        <div className="wrap split enter">
          <div>
            <Crumbs crumb="Careers" />
            <div className="eyebrow">{copy.head.eyebrow}</div>
            <h1>
              <Lines text={copy.head.title} />
            </h1>
            <p className="lead lg">{copy.head.lead}</p>
            <div className="btn-row">
              <a className="btn btn-primary" href="#roles" onClick={scrollToRoles}>
                View open roles <FigArrow color="#fff" />
              </a>
            </div>
          </div>
          <div className="blob" style={{ padding: 18 }}>
            <img className="careers-img" src={imageOr(images.careers, "careers")} alt="Team meeting in an office" />
            <div className="float-card">
              <FigFlask color="#1266B1" />
              <div>
                <small>{copy.floatLabel}</small>
                <b>{copy.floatTitle}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white">
        <div className="sec-wrap center">
          <div className="eyebrow">{copy.whyEyebrow}</div>
          <h2>{copy.whyTitle}</h2>
          <p className="lead">{copy.whyLead}</p>
          <div className="why" style={{ textAlign: "left" }}>
            {copy.why.map((card, index) => (
              <div key={index} className={`vcard${index % 3 === 1 ? " g" : ""}`}>
                <span className="ic">
                  <WhyIcon index={index} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint" id="roles">
        <Waves side="l" />
        <div className="sec-wrap" style={{ maxWidth: 820, position: "relative" }}>
          <div className="eyebrow">{copy.rolesEyebrow}</div>
          <div className="searchbar">
            <Ic name="search" />
            <input
              id="roleQ"
              placeholder="Search openings"
              aria-label="Search openings"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button className="btn btn-primary btn-sm" type="button">
              Search
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "26px 0 10px",
              fontSize: 14,
              color: "var(--ink)",
            }}
          >
            <span>Current openings</span>
            <small id="roleCount" style={{ color: "var(--muted)", fontSize: 12 }}>
              {roles.loading ? "Loading…" : `${list.length} open role${list.length === 1 ? "" : "s"}`}
            </small>
          </div>
          {/* The gap only shows once there are two or more roles. */}
          <div id="roles-list" style={{ display: "grid", gap: 14 }}>
            {!roles.loading && list.length === 0 ? (
              <div className="empty">{copy.noRolesText}</div>
            ) : (
              list.map((role) => (
                <div key={role._id} className="role">
                  <div>
                    {role.badge && <span className="pending">{role.badge}</span>}
                    <h3>{role.title}</h3>
                    {role.department && <span className="pill">{role.department}</span>}
                    {role.location && <span className="pill g">{role.location}</span>}
                    {role.type && <span className="pill n">{role.type}</span>}
                  </div>
                  <button
                    className="btn btn-sm"
                    onClick={() => openModal(<RoleDetails role={role} onApply={closeModal} />)}
                  >
                    View role <FigArrow color="#1266B1" size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <div className="dark-band">
        <div className="wrap">
          <div>
            <div className="eyebrow">{copy.ctaEyebrow}</div>
            <h2>{copy.ctaTitle}</h2>
            <p style={{ marginTop: 10, fontSize: 16 }}>{copy.ctaLead}</p>
          </div>
          <Link className="btn" to="/contact?type=Careers">
            Send your CV <FigArrow color="#1266B1" />
          </Link>
        </div>
      </div>
    </>
  );
}
