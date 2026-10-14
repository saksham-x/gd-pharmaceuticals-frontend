// "31 May 2026", on Nepal's calendar day.
export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kathmandu",
  });
}

// Photos the website ships with; a blank
// image setting falls back to these.
const DEFAULT_IMAGES = {
  hero: "/images/hero.webp",
  lab: "/images/lab.webp",
  quality: "/images/quality.webp",
  about: "/images/about.webp",
  careers: "/images/careers.webp",
  news: "/images/about.webp",
} as const;

export type SiteImage = keyof typeof DEFAULT_IMAGES;

export function imageOr(url: string | undefined, fallback: SiteImage): string {
  return url?.trim() ? url : DEFAULT_IMAGES[fallback];
}

// "Anisha Sharma" → "Anisha".
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}
