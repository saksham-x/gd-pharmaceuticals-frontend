import { useEffect, useRef, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import Footer from "./components/Footer";
import Header from "./components/Header";
import { SiteProvider } from "./context/SiteContext";
import { UiProvider, useUi } from "./context/UiContext";
import { useMotion, useParallax } from "./hooks/useMotion";

import About from "./pages/About";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Investors from "./pages/Investors";
import Legal from "./pages/Legal";
import News from "./pages/News";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Quality from "./pages/Quality";

// ========================================
// PUBLIC LAYOUT
//
// Header, the page and
// footer — the design's `.site` shell.
// Each page fades in, starts at the top
// and is decorated by the motion engine.
// ========================================

function PublicLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { closeModal } = useUi();

  const viewRef = useRef<HTMLElement | null>(null);

  useMotion(viewRef, pathname);
  useParallax();

  useEffect(() => {
    closeModal();
    window.scrollTo(0, 0);
  }, [pathname, closeModal]);

  return (
    <div className="site">
      <Header />
      <main id="view" key={pathname} ref={viewRef} className="page-in">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/quality" element={<Quality />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Legal slug="privacy" fallbackTitle="Privacy" />} />
        <Route path="/disclaimer" element={<Legal slug="disclaimer" fallbackTitle="Disclaimer" />} />
        {/* Unknown addresses land on the home page, as in the design. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <UiProvider>
          <AppRoutes />
        </UiProvider>
      </SiteProvider>
    </BrowserRouter>
  );
}
