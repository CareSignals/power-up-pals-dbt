import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Power-Up Pals: Build Your Chill World",
  description:
    "A playful, caregiver-supported DBT skills world for children ages 5–7.",
  applicationName: "Power-Up Pals: Build Your Chill World",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  keywords: [
    "DBT skills",
    "emotion regulation",
    "children",
    "caregiver co-regulation",
    "emotion glossary",
  ],
  openGraph: {
    title: "Power-Up Pals: Build Your Chill World",
    description:
      "Pick a feeling, run the emotion cycle, and choose a DBT power-up.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
