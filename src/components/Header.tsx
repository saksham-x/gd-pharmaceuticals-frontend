import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useSite } from "../context/SiteContext";
import { Chevron } from "./Icons";

// ========================================
// HEADER
//
// Sticky bar with the logo, main nav (a
// Company dropdown), product search and
// the mobile menu button. Behaviour as in
// the design: the dropdown opens on hover
// (desktop), click and ArrowDown; Escape
// closes it and the mobile drawer.
// ========================================

const COMPANY_PATHS = ["/about", "/news", "/careers"];

export function isActive(pathname: string, path: string) {
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function Header() {
  const { general } = useSite();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(false);

  const ddRef = useRef<HTMLDivElement | null>(null);
  const ddButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Shadow once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A new page closes every menu.
  useEffect(() => {
    setMenuOpen(false);
    setDdOpen(false);
  }, [pathname]);

  // Outside click closes the dropdown;
  // Escape closes the dropdown and drawer.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ddRef.current?.contains(event.target as Node)) setDdOpen(false);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDdOpen(false);
      setMenuOpen((open) => {
        if (open) menuButtonRef.current?.focus();
        return false;
      });
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const companyActive = COMPANY_PATHS.some((path) => isActive(pathname, path));

  const onDdButtonKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setDdOpen(true);
      setTimeout(() => itemRefs.current[0]?.focus(), 40);
    }
  };

  const onMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current.filter(Boolean) as HTMLAnchorElement[];
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1) % items.length]?.focus();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index <= 0) ddButtonRef.current?.focus();
      else items[index - 1]?.focus();
    }
    if (event.key === "Escape") {
      setDdOpen(false);
      ddButtonRef.current?.focus();
    }
  };

  const navLink = (path: string, label: string) => (
    <Link to={path} className={isActive(pathname, path) ? "active" : undefined}>
      {label}
    </Link>
  );

  const ddLink = (path: string, label: string, index: number) => (
    <Link
      to={path}
      ref={(element) => {
        itemRefs.current[index] = element;
      }}
      className={isActive(pathname, path) ? "active" : undefined}
    >
      {label}
    </Link>
  );

  const goSearch = () => {
    navigate("/products", { state: { focusSearch: true } });
    setTimeout(() => document.getElementById("pq")?.focus(), 50);
  };

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="wrap header-inner">
        <Link className="logo" to="/" aria-label="G.D. Pharmaceuticals home">
          <span className="logo-mark">G</span>
          <span>
            <strong>{general.brandName}</strong>
            <small>{general.brandTagline}</small>
          </span>
        </Link>

        <nav className={`nav${menuOpen ? " open" : ""}`} id="nav" aria-label="Main navigation">
          {navLink("/", "Home")}

          <div
            className={`dd${ddOpen ? " open" : ""}`}
            id="dd"
            ref={ddRef}
            onBlur={(event) => {
              if (!ddRef.current?.contains(event.relatedTarget as Node)) setDdOpen(false);
            }}
          >
            <button
              type="button"
              ref={ddButtonRef}
              className={companyActive ? "active" : undefined}
              aria-expanded={ddOpen}
              aria-haspopup="true"
              onClick={() => setDdOpen((open) => !open)}
              onKeyDown={onDdButtonKey}
            >
              Company <Chevron size={10} />
            </button>
            <div className="dd-menu" onKeyDown={onMenuKey}>
              {ddLink("/about", "About Us", 0)}
              {ddLink("/news", "News & Events", 1)}
              {ddLink("/careers", "Careers", 2)}
            </div>
          </div>

          {navLink("/products", "Products")}
          {navLink("/quality", "Quality")}
          {navLink("/investors", "Investors")}
          {navLink("/contact", "Contact")}
        </nav>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="icon-btn" id="searchBtn" aria-label="Search products" onClick={goSearch}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
          <button
            ref={menuButtonRef}
            className="icon-btn menu-btn"
            id="menuBtn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
