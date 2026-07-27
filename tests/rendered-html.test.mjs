import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Power-Up Pals home experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Power-Up Pals: Build Your Chill World<\/title>/i);
  assert.match(html, /aria-label="Power-Up Pals: Build Your Chill World"/i);
  assert.match(html, /Big feelings\./);
  assert.match(html, /Mega skills\./);
  assert.match(html, /Emotion Machine/);
  assert.match(html, /Pal Missions/);
  assert.match(html, /Vibe Arcade/);
  assert.match(html, /Shame/);
  assert.match(html, /Grown-up co-op/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("includes the emotion model, shame support, and every DBT world", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /name:\s*"Shame"/);
  assert.match(page, /My-brain-says-I’m-bad mode/);
  assert.match(page, /A mistake does not make you a bad kid/);
  assert.match(page, /Mindfulness/);
  assert.match(page, /Distress Tolerance/);
  assert.match(page, /Emotion Regulation/);
  assert.match(page, /Interpersonal Effectiveness/);
  assert.match(page, /Walking the Middle Path/);
  assert.match(page, /6–7 Reset/);
  assert.match(page, /Sigma STOP/);
  assert.match(page, /No-Cap Facts/);
  assert.match(page, /Sus or Facts\?/);
  assert.match(page, /Aura Recharge/);
  assert.match(page, /Big W Repair/);
  assert.match(page, /Brainrot Boss Battle/);
  assert.match(page, /Chaos Mode → Chill Mode/);
  assert.match(page, /Sigma Both Mode/);
  assert.match(page, /Download this Vibe Pack/);
  assert.match(page, /No score\. No streak\./);
  assert.match(page, /Getting backup is a power move/);
  assert.match(page, /THE POLISHED CORE FIVE/);
  assert.match(page, /Feelings Check-In/);
  assert.match(page, /Respawn and Repair/);
  assert.match(page, /My Safe Base/);
  assert.match(page, /GET A SAFE GROWN-UP/);
  assert.match(page, /Freeze those feet, back it up/);
  assert.match(page, /Cappy/);
  assert.match(page, /Both-Bot/);
  assert.match(page, /Alarm Monster/);
  assert.match(page, /DBT-informed play and/);
  assert.match(page, /nctsn\.org\/interventions\/parent-child-care/);
  assert.match(page, /pubmed\.ncbi\.nlm\.nih\.gov\/28942805/);
  assert.match(page, /localStorage/);
  assert.match(page, /data-voice-mode="custom-ready"/);
  assert.match(page, /TAP TO HEAR/);
  assert.match(page, /power-up-pals-little-reader/);
  assert.match(page, /DEVICE VOICE: ON/);
  assert.match(page, /CUSTOM_VOICE_CLIPS/);
  assert.match(page, /PLAY WITH ME/);
  assert.match(page, /CHALLENGE ME/);
  assert.match(page, /GROWN-UP TURN/);
  assert.match(page, /KID TURN/);
  assert.match(page, /NO CAMERA\. NO SCORE\./);
  assert.match(page, /No jump scares/);
  assert.match(page, /TRY A PAL STORY FIRST/);
  assert.match(page, /Drag unlocked things anywhere/);
  assert.match(page, /Calm Voice/);
  assert.match(page, /Hype Voice/);
  assert.match(page, /power-up-pals-phase-b-settings/);
  assert.match(page, /Big pictures\. Short words\. Spoken help\./);
  assert.match(page, /speechSynthesis/);
  assert.match(page, /Here’s the clue/);
  assert.match(page, /Stopped\. You can rest here\./);
  assert.match(page, /little-cycle-stepper/);
  assert.match(page, /TAB_HASHES/);
  assert.match(page, /aria-disabled=\{!isUnlocked\}/);
  assert.match(page, /Crisis Text Line/);
  assert.match(page, /Childhelp National Child Abuse Hotline/);
  assert.match(page, /href=\{`\$\{PUBLIC_BASE_PATH\}\/privacy\/`\}/);
  assert.doesNotMatch(page, /role="tab"/);
  assert.doesNotMatch(page, /Skibidi/);
  assert.doesNotMatch(page, /Mistake ≠ bad kid/);
  assert.match(layout, /Power-Up Pals/);
  assert.match(layout, /og-vibe-arcade\.png/);
  assert.match(layout, /favicon\.ico/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("publishes the plain-language privacy route", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /What stays on this device/);
  assert.match(html, /No analytics/);
  assert.match(html, /Nothing saved by the app leaves this device/);
  assert.match(html, /does not record, score, report, or transmit/i);
  assert.match(html, /power-up-pals-safe-adults/);
  assert.match(html, /power-up-pals-phase-b-settings/);
  assert.match(html, /not standalone DBT treatment/i);
});

test("ships lightweight responsive art and the required static metadata files", async () => {
  const files = [
    "../public/assets/power-up-pals-world-750.webp",
    "../public/assets/power-up-pals-world-1500.webp",
    "../public/favicon-32.png",
    "../public/apple-touch-icon.png",
    "../public/favicon.ico",
    "../public/robots.txt",
    "../public/sitemap.xml",
  ];
  const sizes = await Promise.all(
    files.map((file) => stat(new URL(file, import.meta.url))),
  );
  assert.ok(sizes[0].size < 250_000);
  assert.ok(sizes[1].size < 250_000);
});
