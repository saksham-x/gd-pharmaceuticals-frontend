import { Link, useParams } from "react-router-dom";

import { FigArrow, Ic } from "../components/Icons";
import { PackArt } from "../components/ProductCard";
import SEO from "../components/SEO";
import { useApi } from "../hooks/useApi";
import { getProduct } from "../services/product/productService";

export default function ProductDetail() {
  const { slug = "" } = useParams();

  const { data: product, loading } = useApi(() => getProduct(slug), [slug]);

  const enquiry = product
    ? new URLSearchParams({ type: "Product enquiry", product: product.name }).toString()
    : "";

  return (
    <section style={{ paddingTop: 40 }}>
      <SEO title={product?.name ?? "Product"} description={product?.medicineInfo} />

      <div className="wrap">
        <Link
          to="/products"
          style={{
            color: "var(--blue)",
            display: "inline-flex",
            gap: 6,
            alignItems: "center",
            fontSize: 14,
            marginBottom: 28,
          }}
        >
          <span style={{ width: 16, display: "inline-flex" }}>
            <Ic name="back" />
          </span>
          Back to products
        </Link>

        {product ? (
          <div className="split" style={{ gap: 56 }}>
            <PackArt product={product} className="lg art-frame" />
            <div>
              <div className="eyebrow">{product.form}</div>
              <h1>{product.name}</h1>
              <p className="lead lg" style={{ marginTop: 6 }}>
                {product.composition || "Composition pending label approval"}
              </p>
              <dl className="spec">
                <div>
                  <dt>Dosage form</dt>
                  <dd>{product.dosageForm || product.subtitle.split(" · ")[0]}</dd>
                </div>
                <div>
                  <dt>Pack size</dt>
                  <dd>{product.packSize || <span className="pending">To be confirmed</span>}</dd>
                </div>
                <div>
                  <dt>Registration</dt>
                  <dd>{product.registration || <span className="pending">To be confirmed</span>}</dd>
                </div>
              </dl>
              <div className="info">
                <h3>Medicine information</h3>
                <p>{product.medicineInfo}</p>
              </div>
              <Link className="btn btn-primary" to={`/contact?${enquiry}`}>
                Make a product enquiry <FigArrow color="#fff" />
              </Link>
            </div>
          </div>
        ) : (
          !loading && (
            <div className="empty">
              <div className="ic">
                <Ic name="search" />
              </div>
              <b>Product not found</b>
              This product is not in the approved catalogue.
              <br />
              <Link className="btn btn-sm" to="/products">
                Browse all products
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  );
}
