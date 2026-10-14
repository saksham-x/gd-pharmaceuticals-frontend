import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_SITE_CONTENT, type SiteContent } from "../data/defaultContent";
import { getSiteContent } from "../services/site/siteService";

// ========================================
// SITE CONTENT
//
// Every page's copy, edited in the staff
// portal. The last copy received is kept
// in localStorage, so a returning visitor
// sees the page at once while the fresh
// copy loads. A first visit waits for the
// API; if it cannot be reached, the
// launch defaults are used instead.
// ========================================

const CACHE_KEY = "gd-site-content";

const SiteContext = createContext<SiteContent>(DEFAULT_SITE_CONTENT);

function readCache(): SiteContent | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);

    return raw ? (JSON.parse(raw) as SiteContent) : null;
  } catch {
    return null;
  }
}

function writeCache(content: SiteContent) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    // Private mode or storage full: the
    // next visit simply waits again.
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent | null>(readCache);

  useEffect(() => {
    let cancelled = false;

    getSiteContent()
      .then((fresh) => {
        if (cancelled) return;
        setContent(fresh);
        writeCache(fresh);
      })
      .catch((error: unknown) => {
        console.error("Could not load site content", error);
        if (!cancelled) {
          setContent((current) => current ?? DEFAULT_SITE_CONTENT);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // First visit, still loading: the page
  // background only, rather than a flash
  // of text that is about to change.
  if (!content) {
    return null;
  }

  return <SiteContext.Provider value={content}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContent {
  return useContext(SiteContext);
}
