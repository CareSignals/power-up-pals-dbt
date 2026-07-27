import type { Metadata } from "next";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Privacy | Power-Up Pals",
  description:
    "How Power-Up Pals keeps preferences and Safe Base pieces on the device.",
};

const storedItems = [
  {
    key: "power-up-pals-vibe-pack",
    meaning: "the selected language or Vibe Pack",
  },
  {
    key: "power-up-pals-little-reader",
    meaning: "the Little Reader or More Words preference",
  },
  {
    key: "power-up-pals-unlocked-rewards",
    meaning: "which Safe Base rewards have been unlocked",
  },
  {
    key: "power-up-pals-placed-rewards",
    meaning: "which unlocked rewards are placed in the Safe Base",
  },
  {
    key: "power-up-pals-safe-adults",
    meaning: "the selected safe-adult team labels",
  },
  {
    key: "power-up-pals-phase-b-settings",
    meaning:
      "Pal, play style, narrator, Safe Base weather, and movable-item positions",
  },
];

export default function PrivacyPage() {
  return (
    <main className="privacy-page" id="main-content">
      <a className="privacy-home-link" href={`${publicBasePath}/`}>
        ← Back to Power-Up Pals
      </a>
      <header>
        <span className="kicker">PLAIN-LANGUAGE PRIVACY</span>
        <h1>What stays on this device</h1>
        <p>
          Power-Up Pals is designed for caregiver-supported play without
          collecting a child’s personal information.
        </p>
      </header>

      <section>
        <h2>The short version</h2>
        <ul className="privacy-checks">
          <li>No account</li>
          <li>No analytics</li>
          <li>No server collecting or storing app data</li>
          <li>No tracking</li>
          <li>Nothing saved by the app leaves this device</li>
        </ul>
        <p>
          The app does not record, score, report, or transmit a child’s
          emotional selections.
        </p>
      </section>

      <section>
        <h2>What the browser stores locally</h2>
        <p>
          Six small browser-storage entries remember preferences and Safe Base
          progress:
        </p>
        <dl className="privacy-storage-list">
          {storedItems.map((item) => (
            <div key={item.key}>
              <dt>
                <code>{item.key}</code>
              </dt>
              <dd>{item.meaning}</dd>
            </div>
          ))}
        </dl>
        <p>
          These entries stay in this browser on this device. They are not sent
          to Power-Up Pals, CareSignals, a school, a clinician, or another
          person.
        </p>
      </section>

      <section>
        <h2>How to clear it</h2>
        <p>
          Use your browser’s settings to clear site data for this website. You
          can also clear browsing data for cookies and site storage. This
          removes the saved Vibe Pack, reading preference, rewards, Pal Mission
          preferences, Safe Base layout, and safe-adult labels from that
          browser.
        </p>
      </section>

      <section>
        <h2>Scope and care</h2>
        <p>
          This is DBT-informed play and co-regulation. It is not standalone DBT
          treatment, a diagnosis, or a replacement for a qualified clinician.
          Children ages 5–7 should use it with a safe adult and practice skills
          while calm.
        </p>
        <p>
          This prototype is awaiting review by a trauma-informed child
          clinician before clinical or commercial use.
        </p>
      </section>

      <footer>
        <p>Updated July 2026 • Power-Up Pals prototype</p>
        <a
          href="https://github.com/CareSignals/power-up-pals-dbt/issues"
          rel="noreferrer"
          target="_blank"
        >
          Report a privacy or accessibility problem ↗
        </a>
      </footer>
    </main>
  );
}
