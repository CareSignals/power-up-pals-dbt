import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryOwner =
  process.env.GITHUB_REPOSITORY?.split("/")[0] ?? "CareSignals";
const publicOrigin = isGitHubPages
  ? `https://${repositoryOwner.toLowerCase()}.github.io`
  : "https://power-up-pals-dbt.hopeandequit-3153.chatgpt.site";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicOrigin),
  title: "Power-Up Pals: Build Your Chill World",
  description:
    "A tablet-first, caregiver-supported DBT-informed play world where children ages 5–7 practice skills and build a personal Safe Base.",
  applicationName: "Power-Up Pals: Build Your Chill World",
  icons: {
    icon: `${publicBasePath}/icon.png`,
    apple: `${publicBasePath}/icon.png`,
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
      "Practice five kid-sized DBT-informed quests, unlock cozy rewards, and build a personal Safe Base with a caregiver.",
    type: "website",
    images: [
      {
        url: `${publicBasePath}/og-vibe-arcade.png`,
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
      "Caregiver-supported emotion skills, spoken play quests, and a buildable Safe Base for children ages 5–7.",
    images: [`${publicBasePath}/og-vibe-arcade.png`],
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
