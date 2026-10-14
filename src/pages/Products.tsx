import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { FigArrow, Ic } from "../components/Icons";
import Lines from "../components/Lines";
import PageHead from "../components/PageHead";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import { useSite } from "../context/SiteContext";
import { useUi } from "../context/UiContext";
import { useApi } from "../hooks/useApi";
import { getProducts, type Product } from "../services/product/productService";

// ========================================
// PRODUCT CATALOGUE
//
// Search, dosage-form filter and sort run
// in the browser over the published list.
// Typing dims the grid briefly before the
// results swap in, as in the design's
// softRender().
// ========================================

type Sort = "az" | "za";

const matches = (product: Product, query: string) =>
  !query ||
  [product.name, product.subtitle, product.genericName, product.composition, product.form]
    .join(" ")
    .toLowerCase()
    .includes(query);

export default function Products() {
  const { products: copy } = useSite();
  const { toast } = useUi();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const products = useApi(() => getProducts());

  const initialQuery = searchParams.get("q") ?? "";

  // What is typed, and what the grid shows.
  const [input, setInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [form, setForm] = useState("All");
  const [sort, setSort] = useState<Sort>("az");
  const [busy, setBusy] = useState(false);
  // Remounts the grid so its cards
  // animate in after each change.
  const [renderKey, setRenderKey] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if ((location.state as { focusSearch?: boolean } | null)?.focusSearch) {
      inputRef.current?.focus();
    }
  }, [location.state]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const apply = (next: { query?: string; form?: string }, wait = 140) => {
    setBusy(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (next.query !== undefined) setQuery(next.query);
      if (next.form !== undefined) setForm(next.form);
      setBusy(false);
      setRenderKey((key) => key + 1);
    }, wait);
  };

  const all = products.data ?? [];

  // "All" plus each dosage form, in the
  // order products first use them.
  const forms = useMemo(() => ["All", ...Array.from(new Set(all.map((product) => product.form)))], [all]);

  const q = query.toLowerCase().trim();

  const list = all
    .filter((product) => (form === "All" || product.form === form) && matches(product, q))
    .sort((a, b) => (sort === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  const clearSearch = () => {
    setInput("");
    apply({ query: "", form: "All" });
    inputRef.current?.focus();
  };

  const feedback = `${q ? `matching “${q}”` : ""}${form !== "All" ? ` in ${form.toLowerCase()}` : ""}`;

  return (
    <>
      <SEO title="Products" description={copy.head.lead} />

      <PageHead crumb="Products">
        <div className="split" style={{ gap: 40 }}>
          <div className="enter">
            <div className="eyebrow">{copy.head.eyebrow}</div>
            <h1>
              <Lines text={copy.head.title} />
            </h1>
            <p className="lead lg">{copy.head.lead}</p>
          </div>
          <div className="reveal reveal-right in">
            <div className="chips">
              <span className="chip dot">
                {products.loading ? "Loading products" : `${all.length} approved product${all.length === 1 ? "" : "s"}`}
              </span>
              {copy.chip && <span className="chip">{copy.chip}</span>}
            </div>
            <div className={`searchbar${busy && input ? " busy" : ""}${q ? " has-q" : ""}`}>
              <Ic name="search" />
              <input
                id="pq"
                ref={inputRef}
                placeholder="Search by brand or generic name"
                aria-label="Search products"
                autoComplete="off"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  apply({ query: event.target.value }, 220);
                }}
              />
              <span className="spin" aria-hidden="true"></span>
              <button type="button" className="clear-q" aria-label="Clear search" onClick={clearSearch}>
                ×
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => apply({ query: input }, 0)}>
                Search
              </button>
            </div>
          </div>
        </div>
      </PageHead>

      <section className="bg-white">
        <div className="wrap catalog">
          <aside className="filter">
            <h3>Filter products</h3>
            <small>Dosage form</small>
            <div id="filters">
              {forms.map((item) => (
                <button key={item} className={form === item ? "on" : undefined} onClick={() => apply({ form: item })}>
                  {item}
                  <span>{item === "All" ? all.length : all.filter((product) => product.form === item).length}</span>
                </button>
              ))}
              <button className="clear" onClick={() => apply({ form: "All" })}>
                Clear all
              </button>
            </div>
          </aside>

          <div>
            <div className="catalog-top">
              <span aria-live="polite">
                <b id="pcount">{list.length}</b> <span id="plabel">{list.length === 1 ? "product" : "products"}</span>{" "}
                <span className="fb" id="pfb">
                  {feedback}
                </span>
              </span>
              <select
                className="sort"
                id="psort"
                aria-label="Sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
              >
                <option value="az">Sort: A–Z</option>
                <option value="za">Sort: Z–A</option>
              </select>
            </div>

            <div
              key={renderKey}
              className={`products-grid swap-in${busy || products.loading ? " busy" : ""}`}
              id="pgrid"
            >
              {!products.loading && list.length === 0 ? (
                <div className="empty" style={{ gridColumn: "1/-1" }}>
                  <div className="ic">
                    <Ic name="search" />
                  </div>
                  <b>No products found</b>
                  No products match {q ? `“${q}”` : "this filter"}
                  {form !== "All" && q ? ` in ${form.toLowerCase()}` : ""}. Try a brand name
                  {all[0] ? ` like ${all[0].name}` : ""}.
                  <br />
                  <button className="btn btn-sm" onClick={clearSearch}>
                    Clear search and filters
                  </button>
                </div>
              ) : (
                list.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    catalogue
                    style={{ ["--i" as string]: index }}
                  />
                ))
              )}
            </div>

            <div className="center" style={{ marginTop: 36 }}>
              <button className="btn" onClick={() => toast("Full catalogue will be added after approval")}>
                View full catalogue <FigArrow color="#1266B1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
