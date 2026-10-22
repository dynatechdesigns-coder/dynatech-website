// The Dynatech hexagon "S" mark, redrawn as a clean vector from the original artwork.
const MARK_PATH = "M58 -50 L0 -84 L-72.7 -42 L-72.7 -6 L0 36 L72.7 -6 L72.7 42 L0 84 L-58 50";

export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      className={`logo-mark ${className}`}
      width={size}
      height={size * 1.1}
      viewBox="-100 -110 200 220"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="dl-grad" x1="0" y1="-1" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#7cc0ff" />
          <stop offset="1" stopColor="#2563ff" />
        </linearGradient>
      </defs>
      <g fill="none" strokeLinejoin="miter" strokeMiterlimit={10}>
        <path d={MARK_PATH} stroke="url(#dl-grad)" strokeWidth={24} />
        <path d={MARK_PATH} stroke="var(--mark-cut, #05070d)" strokeWidth={13} />
        <path d={MARK_PATH} stroke="#cfe3ff" strokeWidth={3} />
      </g>
    </svg>
  );
}

/** Brand lockup: mark + DYNATECH, with a smaller LABS. */
export function Wordmark({ size = 34, showName = false }: { size?: number; showName?: boolean }) {
  return (
    <span className="wordmark">
      <LogoMark size={size} />
      <span className="wordmark-text">
        <span className="wordmark-line">
          <span className="wordmark-main">DYNATECH</span>
          <span className="wordmark-sub">LABS</span>
        </span>
        {showName && <span className="wordmark-name">by Daniel Nathaniel Ayomide</span>}
      </span>
    </span>
  );
}

export { MARK_PATH };
