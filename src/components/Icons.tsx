// ========================================
// ICONS
//
// The design's icon set, path for path:
// `Ic` is its ic() (24px stroke icons),
// the Fig* components its exact Figma
// icons, and Waves its background lines.
// ========================================

const PATHS = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  flask:
    '<path d="M9 3h6M10 3v6L5 18a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 14h9"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
} as const;

export type IconName = keyof typeof PATHS;

export function Ic({ name, width = 1.8 }: { name: IconName; width?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}

export function FigFlask({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.5 2.5H12.5M8.33333 2.5V7.5L4.16667 15C4.00659 15.2701 3.92607 15.58 3.9344 15.8939C3.94273 16.2078 4.03955 16.5129 4.21373 16.7742C4.38791 17.0354 4.63234 17.2422 4.91888 17.3706C5.20543 17.499 5.52241 17.5439 5.83333 17.5H14.1667C14.4776 17.5439 14.7946 17.499 15.0811 17.3706C15.3677 17.2422 15.6121 17.0354 15.7863 16.7742C15.9604 16.5129 16.0573 16.2078 16.0656 15.8939C16.0739 15.58 15.9934 15.2701 15.8333 15L11.6667 7.5V2.5" />
      <path d="M6.66667 12.5H13.3333" />
    </svg>
  );
}

export function FigDoc({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 2.5H11.6667L15 5.83333V17.5H5V2.5Z" />
      <path d="M11.6667 2.5V6.66667H15.8333M7.5 10.8333H12.5M7.5 14.1667H10.8333" />
    </svg>
  );
}

export function FigArrow({ color, size = 17 }: { color: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 17 17"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="1.275"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.54167 8.5H13.4583" />
      <path d="M9.20833 4.25L13.4583 8.5L9.20833 12.75" />
    </svg>
  );
}

// Small chevron used by the Company
// dropdown and "Show details".
export function Chevron({ size }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={size ? 2.5 : 2}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const WAVE = [
  "M0.075 190.983C126.081 178.382 220.586 291.787 340.291 222.484C459.997 153.181 523 145.62 617.504 151.921C712.009 158.221 781.312 53.636 932.519 0.714",
  "M0.217 204.839C126.223 167.038 220.728 299.344 340.433 217.44C460.139 135.536 523.142 126.716 617.646 151.917C712.151 177.118 781.454 56.152 932.661 0.71",
  "M0.338 218.696C126.344 155.693 220.849 306.9 340.554 212.396C460.26 117.891 523.263 107.811 617.767 151.913C712.272 196.015 781.575 58.669 932.782 0.706",
  "M0.434 232.553C126.44 144.349 220.944 314.457 340.65 207.352C460.355 100.247 523.358 88.906 617.863 151.909C712.367 214.912 781.671 61.185 932.878 0.702",
  "M0.506 246.409C126.512 133.004 221.016 322.013 340.722 202.307C460.428 82.602 523.43 70.001 617.935 151.905C712.439 233.809 781.743 63.701 932.95 0.698",
];

export function Waves({ side = "r" }: { side?: "r" | "l" }) {
  return (
    <div className={`waves ${side}`} aria-hidden="true">
      <svg viewBox="0 0 933 504" preserveAspectRatio="none" fill="none" stroke="#45B77A" strokeWidth="1.512">
        {WAVE.map((d, index) => (
          <path key={d} d={d} transform={`translate(0 ${47.9 + index * 22.68})`} />
        ))}
      </svg>
    </div>
  );
}
