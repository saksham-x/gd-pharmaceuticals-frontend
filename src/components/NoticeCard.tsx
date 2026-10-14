import { useUi } from "../context/UiContext";
import type { Notice } from "../services/notice/noticeService";
import { formatDate } from "../utils/format";
import { FigArrow, FigDoc } from "./Icons";

// ========================================
// NOTICE DIALOG
//
// The design's openNotice(): the notice,
// and its PDF once one is approved.
// ========================================

export function NoticeDetails({ notice }: { notice: Notice }) {
  return (
    <>
      <div className="eyebrow">
        {notice.type} · {formatDate(notice.date)}
      </div>
      <h2 style={{ fontSize: "1.5rem" }}>{notice.title}</h2>
      {notice.summary && <p className="lead">{notice.summary}</p>}
      <p style={{ marginTop: 16 }}>
        {notice.documentUrl ? (
          <a className="btn btn-primary" href={notice.documentUrl} target="_blank" rel="noopener noreferrer">
            Download PDF <FigArrow color="#fff" />
          </a>
        ) : (
          <span className="pending">PDF unavailable — awaiting approved file</span>
        )}
      </p>
    </>
  );
}

// ========================================
// NOTICE CARD
//
// The design's noticeHTML(btn, cls).
// ========================================

type NoticeCardProps = {
  notice: Notice;
  buttonLabel?: string;
  // "card" adds the raised shadow used on
  // the Investors page.
  variant?: "" | "card";
};

export default function NoticeCard({ notice, buttonLabel = "View notice", variant = "" }: NoticeCardProps) {
  const { openModal } = useUi();

  return (
    <div className={`notice ${variant}`.trim()}>
      <span className="ic">
        <FigDoc color="#1266B1" />
      </span>
      <div>
        <div className="meta">
          {notice.type} · {formatDate(notice.date)}
        </div>
        <h3>{notice.title}</h3>
        <p>{notice.summary}</p>
      </div>
      <button className="go" onClick={() => openModal(<NoticeDetails notice={notice} />)}>
        {buttonLabel} <FigArrow color="#1266B1" size={16} />
      </button>
    </div>
  );
}
