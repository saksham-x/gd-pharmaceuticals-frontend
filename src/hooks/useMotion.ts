import { useEffect, type RefObject } from "react";

// ========================================
// MOTION ENGINE
//
// A direct port of the design's
// decorate() script: elements are tagged
// with the reveal / stagger classes by
// selector and revealed once as they
// scroll into view. Running it on every
// DOM change means content that arrives
// from the API animates in the same way.
//
// It only ever adds classes. If React
// re-renders an element with a new
// className the reveal classes simply
// drop off and it stays visible.
// ========================================

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    }),
  { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
);

// Pauses the hero's continuous motion
// while it is off screen.
const heroObserver = new IntersectionObserver((entries) =>
  entries.forEach((entry) => entry.target.classList.toggle("inview", entry.isIntersecting))
);

export function decorate(root: HTMLElement) {
  const tag = (selector: string, ...classes: string[]) =>
    root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      if (element.closest(".hero,.page-head,.modal")) return;
      element.classList.add(...classes);
    });

  tag(
    "section .eyebrow, section h2, section .lead, section .btn-row, .sec-head>a, .catalog-top, .tabs, .office, .info, .spec, .form-card, .cert, .notice, section>.sec-wrap>.searchbar, .center>.pending, .cta-band .sec-wrap>a, .dark-band .wrap>*",
    "reveal",
    "reveal-up"
  );
  tag(".split>.photo, .split>.art", "reveal", "reveal-left");
  tag(".photo .ph", "reveal-img", "reveal");
  tag(".photo-note, .photo-tag", "reveal", "reveal-up");
  root
    .querySelectorAll<HTMLElement>(".photo-note,.photo-tag")
    .forEach((element) => element.style.setProperty("--delay", "450ms"));
  tag(".form-card", "reveal", "reveal-right");

  root
    .querySelectorAll<HTMLElement>(".products-grid:not(#pgrid), .values, .why, .news-grid, .acc")
    .forEach((group) => {
      if (group.closest(".hero")) return;
      group.classList.add("stagger");
      Array.from(group.children).forEach((child, index) =>
        (child as HTMLElement).style.setProperty("--i", String(index))
      );
    });

  tag(".vcard, .role", "hover-lift");

  root.querySelectorAll(".reveal, .stagger").forEach((element) => {
    if (!element.classList.contains("in")) revealObserver.observe(element);
  });

  const hero = root.querySelector(".hero");
  if (hero) {
    hero.classList.add("inview");
    heroObserver.observe(hero);
  }
}

// Decorates `root` now and after every
// change to its content.
export function useMotion(root: RefObject<HTMLElement | null>, routeKey: string) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => decorate(element));
    };

    decorate(element);

    // childList only: decorate itself
    // changes classes, never nodes, so it
    // cannot trigger itself.
    const mutations = new MutationObserver(schedule);
    mutations.observe(element, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
    };
  }, [root, routeKey]);
}

// The hero decorations drift with the
// scroll. rAF-throttled, and only near
// the top of the page.
export function useParallax() {
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      if (reducedMotion()) return;

      const y = window.scrollY;
      if (y > 1000) return;

      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
        element.style.transform = `translate3d(0,${(y * parseFloat(element.dataset.parallax ?? "0")).toFixed(1)}px,0)`;
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
