import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";

import type { Product } from "../services/product/productService";
import { FigArrow } from "./Icons";

// ========================================
// PACK ART
//
// The drawn medicine pack (design: art()).
// ========================================

type PackArtProps = {
  product: Pick<Product, "name" | "subtitle" | "color">;
  extra?: ReactNode;
  className?: string;
};

export function PackArt({ product, extra, className = "" }: PackArtProps) {
  return (
    <div className={`art ${product.color} ${className}`.trim()}>
      {extra}
      <span className="ring r1"></span>
      <span className="ring r2"></span>
      <div className="pack">
        <small>G.D.</small>
        <b>{product.name}</b>
        <span>{product.subtitle}</span>
        <i></i>
      </div>
    </div>
  );
}

// ========================================
// PRODUCT CARD
//
// Home page card (category label, white
// round button) or, with `catalogue`, the
// catalogue card (tag pill, filled button).
// ========================================

type ProductCardProps = {
  product: Product;
  catalogue?: boolean;
  style?: CSSProperties;
};

export default function ProductCard({ product, catalogue = false, style }: ProductCardProps) {
  return (
    <Link className={`pcard ${product.color}`} to={`/products/${product.slug}`} style={style}>
      <PackArt product={product} extra={catalogue ? <span className="tag">{product.form}</span> : null} />
      <div className="pinfo">
        <div>
          {!catalogue && <div className="cat">{product.form}</div>}
          <h3>{product.name}</h3>
          <p>{product.subtitle}</p>
        </div>
        <span className={`round${catalogue ? " fill" : ""}`}>
          <FigArrow color="currentColor" size={20} />
        </span>
      </div>
    </Link>
  );
}
