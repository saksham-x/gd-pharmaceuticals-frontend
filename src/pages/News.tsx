import { useState } from "react";
import { Link } from "react-router-dom";

import { Chevron, FigArrow, Ic } from "../components/Icons";
import PageHead from "../components/PageHead";
import SEO from "../components/SEO";
import { useSite } from "../context/SiteContext";
import { useApi } from "../hooks/useApi";
import { getNotices, type Notice } from "../services/notice/noticeService";
import { formatDate, imageOr } from "../utils/format";

// ========================================
// FEATURE CARD
//
// A news item on its photo, with the
// expandable details list.
// ========================================

function FeatureCard({ notice, fallbackImage }: { notice: Notice; fallbackImage: string }) {
  const [open, setOpen] = useState(false);

  const detailsId = `fdet-${notice._id}`;

  return (
    <div className="feature">
      <img src={notice.image || fallbackImage} alt="" />
      <small>
        {notice.type} · {formatDate(notice.date)}
      </small>
      <h2>{notice.newsTitle || notice.title}</h2>
      <p>{notice.newsSummary || notice.summary}</p>

      <div className={`feature-details${open ? " open" : ""}`} id={detailsId}>
        <div>
          <dl>
            <dt>Type</dt>
            <dd>{notice.type}</dd>
            <dt>Date</dt>
            <dd>{formatDate(notice.date)}</dd>
            {notice.subject && (
              <>
                <dt>Subject</dt>
                <dd>{notice.subject}</dd>
              </>
            )}
            {notice.outcome && (
              <>
                <dt>Outcome</dt>
                <dd>{notice.outcome}</dd>
              </>
            )}
            <dt>Document</dt>
            <dd>{notice.documentUrl ? "PDF available" : "PDF unavailable"}</dd>
          </dl>
        </div>
      </div>

      <div className="feature-actions">
        <button
          type="button"
          className="more"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Hide details " : "Show details "}
          <Chevron />
        </button>
        <Link to="/investors">
          Read notice <FigArrow color="#fff" size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function News() {
  const { news, images } = useSite();

  const notices = useApi(() => getNotices({ news: true }));

  return (
    <>
      <SEO title="News & events" description={news.head.lead} />

      <PageHead crumb="News & Events" eyebrow={news.head.eyebrow} title={news.head.title} lead={news.head.lead} />

      <section>
        <div className="sec-wrap news-grid">
          {notices.data?.map((notice) => (
            <FeatureCard key={notice._id} notice={notice} fallbackImage={imageOr(images.news, "news")} />
          ))}
          {!notices.loading && (
            <div className="soon">
              <div>
                <div className="ic">
                  <Ic name="search" />
                </div>
                <h3>{news.soonTitle}</h3>
                <p>{news.soonText}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
