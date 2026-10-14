import type { ReactNode } from "react";

import { FigDoc } from "../components/Icons";
import PageHead from "../components/PageHead";
import QualityBlock from "../components/QualityBlock";
import SEO from "../components/SEO";
import { useSite } from "../context/SiteContext";

export default function Quality() {
  const { quality } = useSite();

  const certificates = quality.certificates.map((certificate, index) => (
    <div key={index} className="cert">
      <FigDoc color="#526579" />
      <div style={{ flex: 1 }}>
        {certificate.status && <span className="pending">{certificate.status}</span>}
        <h3>{certificate.title}</h3>
        <p>{certificate.text}</p>
        {certificate.fileUrl ? (
          <a
            className="btn btn-sm"
            href={certificate.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ width: "100%", marginTop: 16 }}
          >
            View certificate
          </a>
        ) : (
          <button disabled>View certificate</button>
        )}
      </div>
    </div>
  ));

  // One certificate sits in the grid as
  // designed; several stack in a column.
  let certificateColumn: ReactNode = null;
  if (certificates.length === 1) {
    certificateColumn = certificates[0];
  } else if (certificates.length > 1) {
    certificateColumn = <div style={{ display: "grid", gap: 16 }}>{certificates}</div>;
  }

  return (
    <>
      <SEO title="Quality" description={quality.head.lead} />

      <PageHead
        crumb="Quality & Manufacturing"
        eyebrow={quality.head.eyebrow}
        title={quality.head.title}
        lead={quality.head.lead}
      />

      <section className="bg-mint">
        <QualityBlock />
      </section>

      <section className="bg-white">
        <div className="sec-wrap split">
          <div>
            <div className="eyebrow">{quality.certEyebrow}</div>
            <h2>{quality.certTitle}</h2>
            <p className="lead">{quality.certLead}</p>
          </div>
          {certificateColumn}
        </div>
      </section>
    </>
  );
}
