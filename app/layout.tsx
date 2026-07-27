import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://power-up-pals-dbt.hopeandequit-3153.chatgpt.site",
  ),
  title: "Power-Up Pals: Build Your Chill World",
  description:
    "A playful, caregiver-supported DBT skills world and Vibe Arcade for children ages 5–7.",
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
    "DBT games",
  ],
  openGraph: {
    title: "Power-Up Pals: Build Your Chill World",
    description:
      "Pick a feeling, run the emotion cycle, and practice kid-sized DBT games in the Vibe Arcade.",
    type: "website",
    images: [
      {
        url: "/og-vibe-arcade.png",
        width: 1200,
        height: 630,
        alt: "Power-Up Pals characters practicing calming skills in the Vibe Arcade",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Power-Up Pals: Build Your Chill World",
    description:
      "Caregiver-supported emotion skills and playful DBT games for children ages 5–7.",
    images: ["/og-vibe-arcade.png"],
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
