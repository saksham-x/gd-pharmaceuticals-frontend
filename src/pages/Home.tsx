import { Link } from "react-router-dom";

import { FigArrow, FigFlask, Waves } from "../components/Icons";
import Lines from "../components/Lines";
import NoticeCard from "../components/NoticeCard";
import ProductCard from "../components/ProductCard";
import QualityBlock from "../components/QualityBlock";
import SEO from "../components/SEO";
import { useSite } from "../context/SiteContext";
import { useApi } from "../hooks/useApi";
import { getNotices } from "../services/notice/noticeService";
import { getProducts } from "../services/product/productService";
import { imageOr } from "../utils/format";

// The molecule drawing beside the hero.
function Molecule() {
  return (
    <svg viewBox="0 0 170 170" fill="none" stroke="#1266B1" strokeWidth="1.2">
      <g className="spin">
        <path d="M85 40l39 22.5v45L85 130l-39-22.5v-45z" opacity=".55" />
        <path d="M124 62.5l30-17M46 107.5l-30 17M85 40V12" opacity=".45" />
        <circle cx="85" cy="40" r="4" fill="#eaf5ff" />
        <circle cx="124" cy="62.5" r="4" fill="#eaf5ff" />
        <circle cx="124" cy="107.5" r="4" fill="#eaf5ff" />
        <circle cx="85" cy="130" r="4" fill="#eaf5ff" />
        <circle cx="46" cy="107.5" r="4" fill="#eaf5ff" />
        <circle cx="46" cy="62.5" r="4" fill="#eaf5ff" />
        <circle cx="154" cy="45.5" r="6" stroke="#147D64" fill="#eef9f3" />
        <circle cx="16" cy="124.5" r="6" stroke="#147D64" fill="#eef9f3" />
        <circle cx="85" cy="12" r="5" fill="#eaf5ff" />
      </g>
    </svg>
  );
}

export default function Home() {
  const { home, images } = useSite();

  const products = useApi(() => getProducts({ featured: true }));
  const notices = useApi(() => getNotices({ home: true }));

  const homeNotice = notices.data?.[0];
  const paragraphs = home.aboutParagraphs;

  return (
    <>
      <SEO home title="Medicines made in Nepal" description={home.heroLead} />

      <div className="hero split-bg">
        <Waves />
        <div className="hero-deco deco-1" data-parallax=".18" aria-hidden="true">
          <span className="orb gradient-motion"></span>
        </div>
        <div className="hero-deco deco-2" data-parallax="-.1" aria-hidden="true">
          <span className="orb gradient-motion"></span>
        </div>
        <div className="hero-deco deco-mol" data-parallax=".3" aria-hidden="true">
          <Molecule />
        </div>

        <div className="hero-grid">
          <div className="enter">
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              {home.heroEyebrow}
            </div>
            <h1>
              <Lines text={home.heroTitle} />
            </h1>
            <p className="lead lg">{home.heroLead}</p>
            <div className="btn-row">
              <Link className="btn btn-primary" to="/products">
                Explore products <FigArrow color="#fff" />
              </Link>
              <Link className="btn" to="/about">
                About our company <FigArrow color="#1266B1" />
              </Link>
            </div>
            <div className="hero-proof">
              {home.proof.map((item, index) => (
                <div key={index}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="blob reveal reveal-scale in">
            <div className="shape float slow">
              <img src={imageOr(images.hero, "hero")} alt="Scientist in a laboratory with the Himalayas behind" />
            </div>
            <div className="float-card float">
              <FigFlask color="#1266B1" />
              <div>
                <small>{home.floatLabel}</small>
                <b>{home.floatTitle}</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      {home.ticker.length > 0 && (
        <div className="ticker" aria-label="Company highlights">
          <div className="ticker-track">
            <ul>
              {home.ticker.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <ul aria-hidden="true">
              {home.ticker.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <section>
        <div className="sec-wrap split">
          <div className="photo">
            <div className="ph">
              <img src={imageOr(images.lab, "lab")} alt="Scientist working in a modern pharmaceutical laboratory" />
            </div>
            {home.photoNote && <span className="photo-note">{home.photoNote}</span>}
          </div>
          <div>
            <div className="eyebrow">{home.aboutEyebrow}</div>
            <h2>
              <Lines text={home.aboutTitle} />
            </h2>
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="lead"
                style={
                  index === 0
                    ? paragraphs.length === 1
                      ? { marginBottom: 28 }
                      : undefined
                    : { margin: index === paragraphs.length - 1 ? "12px 0 28px" : "12px 0 0" }
                }
              >
                {paragraph}
              </p>
            ))}
            <Link className="btn" to="/about">
              Discover our story <FigArrow color="#1266B1" />
            </Link>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="sec-wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">{home.productsEyebrow}</div>
              <h2>
                <Lines text={home.productsTitle} />
              </h2>
            </div>
            <Link className="btn" to="/products" style={{ marginBottom: 18 }}>
              View full catalogue <FigArrow color="#1266B1" />
            </Link>
          </div>
          <div className="products-grid">
            {products.data?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mint">
        <QualityBlock />
      </section>

      <section style={{ paddingBottom: 70 }}>
        <div className="sec-wrap">
          <div className="sec-head" style={{ marginBottom: 0, paddingBottom: 20 }}>
            <div>
              <div className="eyebrow">{home.investorsEyebrow}</div>
              <h2>
                <Lines text={home.investorsTitle} />
              </h2>
            </div>
            <p className="lead" style={{ maxWidth: 330, margin: "0 0 18px" }}>
              {home.investorsLead}
            </p>
          </div>
          {homeNotice && <NoticeCard notice={homeNotice} />}
          {home.ipoStatus && (
            <div className="center" style={{ marginTop: 18.7 }}>
              <span className="pending">{home.ipoStatus}</span>
            </div>
          )}
        </div>
      </section>

      <section className="cta-band">
        <Waves />
        <div className="sec-wrap">
          <div>
            <div className="eyebrow">{home.ctaEyebrow}</div>
            <h2>{home.ctaTitle}</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              {home.ctaLead}
            </p>
          </div>
          <Link className="btn btn-primary" to="/contact">
            Contact us <FigArrow color="#fff" />
          </Link>
        </div>
      </section>
    </>
  );
}
