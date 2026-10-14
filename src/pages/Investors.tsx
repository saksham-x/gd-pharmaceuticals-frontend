import { useRef, useState, type KeyboardEvent } from "react";

import NoticeCard from "../components/NoticeCard";
import PageHead from "../components/PageHead";
import SEO from "../components/SEO";
import { useSite } from "../context/SiteContext";
import { useApi } from "../hooks/useApi";
import { getNotices, type NoticeCategory } from "../services/notice/noticeService";

const TABS: { label: string; category: NoticeCategory }[] = [
  { label: "Notices", category: "notice" },
  { label: "Financial Reports", category: "financial-report" },
  { label: "IPO Updates", category: "ipo-update" },
  { label: "Corporate Governance", category: "governance" },
];

export default function Investors() {
  const { investors } = useSite();

  const notices = useApi(() => getNotices());

  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const emptyText: Record<NoticeCategory, string> = {
    notice: investors.emptyNotices,
    "financial-report": investors.emptyFinancial,
    "ipo-update": investors.emptyIpo,
    governance: investors.emptyGovernance,
  };

  // Arrow keys, Home and End move between
  // tabs, as in the design.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = TABS.length - 1;
    const next =
      event.key === "ArrowRight"
        ? active + 1
        : event.key === "ArrowLeft"
          ? active - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;

    if (next === null) return;
    event.preventDefault();

    const index = (next + TABS.length) % TABS.length;
    setActive(index);
    tabRefs.current[index]?.focus();
  };

  const { category } = TABS[active];
  const items = (notices.data ?? []).filter((notice) => notice.category === category);

  return (
    <>
      <SEO title="Investors" description={investors.head.lead} />

      <PageHead
        crumb="Investor Relations"
        eyebrow={investors.head.eyebrow}
        title={investors.head.title}
        lead={investors.head.lead}
      />

      <section>
        <div className="sec-wrap">
          <div className="tabs" role="tablist" id="itabs" onKeyDown={onKeyDown}>
            {TABS.map((tab, index) => (
              <button
                key={tab.category}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                role="tab"
                className={index === active ? "on" : undefined}
                aria-selected={index === active}
                tabIndex={index === active ? 0 : -1}
                onClick={() => setActive(index)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div id="ipanel" role="tabpanel" style={{ marginTop: 18 }}>
            {!notices.loading && (
              <div key={category} className="tab-panel" style={{ display: "grid", gap: 14 }}>
                {items.length > 0 ? (
                  items.map((notice) => (
                    <NoticeCard
                      key={notice._id}
                      notice={notice}
                      variant="card"
                      buttonLabel={notice.documentUrl ? "View file" : "Request file"}
                    />
                  ))
                ) : (
                  <div className="empty">{emptyText[category]}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
