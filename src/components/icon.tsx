import type { CSSProperties } from "react";
const paths = {
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  upload: "M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4",
  document: "M14 3H5v18h14V8l-5-5Zm0 0v6h5M8 13h8m-8 4h6",
  check: "m5 12 4 4L19 6",
  copy: "M9 9h12v12H9V9ZM5 15H3V3h12v2",
  download: "M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4",
  moon: "M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1",
  flag: "M5 21V3h13l-2 4 2 4H5",
  risk: "m12 3 10 18H2L12 3Zm0 6v5m0 3v1",
  question:
    "M9 8a3 3 0 0 1 6 0c0 3-3 2-3 5m0 3v1M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z",
  close: "m6 6 12 12M6 18 18 6",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Zm-4 10 3 3 5-6",
  grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
};
export type IconName = keyof typeof paths;
export function Icon({
  name,
  size = 18,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
