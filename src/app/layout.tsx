import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "MeetFlow AI — Turn meetings into action",
  description:
    "A focused workspace that turns meeting transcripts into decisions, action items and clear next steps with Gemini.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
