import { useState } from "react";
import { Link } from "react-router-dom";

import { useSite } from "../context/SiteContext";
import { imageOr } from "../utils/format";
import { FigArrow, FigFlask, Waves } from "./Icons";

// ========================================
// QUALITY BLOCK
//
// Photo plus the numbered process
// accordion; on the home page and the
// Quality page (design: qualityBlock()).
// One step open at a time.
// ========================================

export default function QualityBlock() {
  const { quality, images } = useSite();

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Waves side="l" />
      <div className="sec-wrap split q">
        <div className="photo">
          <div className="ph q">
            <img src={imageOr(images.quality, "quality")} alt="Laboratory professional reviewing a computer" />
          </div>
          {quality.photoTag && (
            <span className="photo-tag">
              <FigFlask color="#17324D" />
              {quality.photoTag}
            </span>
          )}
        </div>

        <div>
          <div className="eyebrow">{quality.eyebrow}</div>
          <h2>{quality.title}</h2>
          <p className="lead">{quality.lead}</p>

          <div className="acc">
            {quality.steps.map((step, index) => {
              const open = openIndex === index;

              return (
                <div key={index} className={`acc-item${open ? " open" : ""}`}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                  >
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <span>
                      <strong>{step.title}</strong>
                      <em>{step.text}</em>
                    </span>
                    <i>{open ? "−" : "+"}</i>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="btn-row" style={{ marginTop: 17 }}>
            <Link className="btn" to="/quality">
              Explore quality <FigArrow color="#1266B1" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
