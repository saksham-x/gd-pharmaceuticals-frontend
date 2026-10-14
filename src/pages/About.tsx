import { Fragment } from "react";

import PageHead from "../components/PageHead";
import SEO from "../components/SEO";
import { useSite } from "../context/SiteContext";
import { imageOr } from "../utils/format";

export default function About() {
  const { about, images } = useSite();

  return (
    <>
      <SEO title="About us" description={about.head.lead} />

      <PageHead crumb="Company" eyebrow={about.head.eyebrow} title={about.head.title} lead={about.head.lead} />

      <section className="bg-white">
        <div className="sec-wrap split">
          <div className="photo">
            <div className="ph" style={{ aspectRatio: "535/480" }}>
              <img src={imageOr(images.about, "about")} alt="Himalayan landscape in Nepal" />
            </div>
            {about.photoTag && <span className="photo-tag">{about.photoTag}</span>}
          </div>
          <div>
            <div className="eyebrow">{about.storyEyebrow}</div>
            <h2>{about.storyTitle}</h2>
            <p className="lead">
              {about.storyParagraphs.map((paragraph, index) => (
                <Fragment key={index}>
                  {index > 0 && <br />}
                  {paragraph}
                </Fragment>
              ))}
            </p>
            {about.pendingNote && (
              <p style={{ marginTop: 12 }}>
                <span className="pending">{about.pendingNote}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-soft">
        <div className="sec-wrap">
          <div className="eyebrow">{about.valuesEyebrow}</div>
          <h2>{about.valuesTitle}</h2>
          <div className="values">
            {about.values.map((value, index) => (
              <div key={index} className="vcard">
                <small>{String(index + 1).padStart(2, "0")}</small>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
