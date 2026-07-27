import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(page, /Mistake ≠ bad kid/);
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
  assert.match(page, /Real sigma gets backup/);
  assert.match(page, /speechSynthesis/);
  assert.match(layout, /Power-Up Pals/);
  assert.match(layout, /og-vibe-arcade\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
