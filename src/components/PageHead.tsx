import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Waves } from "./Icons";
import Lines from "./Lines";

// ========================================
// PAGE HEAD
//
// The design's head(): breadcrumb,
// eyebrow, title and lead on the split
// background. Pass `children` to replace
// the eyebrow/title/lead with a custom
// layout (the catalogue's search head).
// ========================================

type PageHeadProps = {
  crumb: ReactNode;
  eyebrow?: string;
  title?: string;
  lead?: string;
  children?: ReactNode;
};

export function Crumbs({ crumb }: { crumb: ReactNode }) {
  return (
    <div className="crumbs">
      <Link to="/">Home</Link>
      <span>/</span>
      {crumb}
    </div>
  );
}

export default function PageHead({ crumb, eyebrow, title, lead, children }: PageHeadProps) {
  // Without a split layout the whole wrap
  // enters together; with one, the left
  // column enters (the right column
  // reveals itself).
  return (
    <div className="page-head split-bg">
      <Waves />
      <div className={`wrap${children ? "" : " enter"}`}>
        <Crumbs crumb={crumb} />
        {children ?? (
          <>
            <div className="eyebrow">{eyebrow}</div>
            <h1>
              <Lines text={title ?? ""} />
            </h1>
            <p className="lead lg">{lead}</p>
          </>
        )}
      </div>
    </div>
  );
}
