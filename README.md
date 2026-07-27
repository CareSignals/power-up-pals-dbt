# Power-Up Pals: Build Your Chill World

Power-Up Pals is a caregiver-supported, DBT-informed skills app for children
ages 5–7. It uses original characters, playful Gen Alpha language, large
picture choices, spoken directions, and noncompetitive world-building to make
emotion learning and coping-skill practice approachable.

The live prototype is:
[power-up-pals-dbt.hopeandequit-3153.chatgpt.site](https://power-up-pals-dbt.hopeandequit-3153.chatgpt.site)

## Important scope

- This is **DBT-informed play and co-regulation**, not standalone DBT treatment.
- It does not diagnose BPD, trauma, or any mental-health condition.
- It does not replace a therapist, pediatric clinician, or trauma-informed
  caregiver support.
- Children are not expected to use the app alone during a full meltdown.
- The app does not record, score, report, or transmit a child's emotional
  selections.
- Rewards have no points, rankings, streaks, scarcity, or loss.

Content should receive review from a trauma-informed child clinician before
clinical or commercial use.

## Product pathways

Every child-facing pathway follows:

**See it → Hear it → Do it → Finish it → Build with it → Reconnect**

The five core quests are:

1. **Feelings Check-In** — notice, name, and share a feeling.
2. **Slime Goes Slow** — practice three easy inhales with longer exhales.
3. **Freeze–Spy–Pick** — pause, inspect the situation, and select a safe move.
4. **Both Mode** — hold a valid feeling and a safe action at the same time.
5. **Respawn and Repair** — calm, check for hurt, tell the truth, help fix, and
   reconnect.

Completing a quest visibly unlocks a noncompetitive Safe Base item. The child
can place it immediately or save it for later.

Additional surfaces include:

- an interactive Emotion Cycle Machine;
- a picture-led Emotion Glossary, including shame;
- original skill worlds and characters;
- replaceable Vibe Packs that preserve the stable DBT subtitle;
- a caregiver co-regulation zone;
- a globally available **Get My Grown-Up** action.

## Accessibility and narration

- Little Reader mode is the default.
- Core controls have large touch targets and spoken directions.
- Emotion Machine cycle cards can be read aloud individually.
- Device speech is the current fallback narrator.
- Authorized custom audio can be mapped through `CUSTOM_VOICE_CLIPS` in
  `app/page.tsx`.
- The shared audio controller stops both custom MP3 playback and device speech.
- Timed activities reset when stopped or exited.
- The caregiver dialog supports initial focus, focus containment, Escape, and
  focus return.
- Reduced-motion preferences suppress celebratory movement.

No child-entered information should be sent to an external voice service.
Custom narration should be generated ahead of time and shipped as static audio
files.

## Architecture

- `app/page.tsx` — product data, interactive pathways, local persistence, and
  narration controls.
- `app/globals.css` — responsive visual system and reduced-motion behavior.
- `app/layout.tsx` — product metadata.
- `tests/rendered-html.test.mjs` — server-rendered product-content checks.
- `.openai/hosting.json` — existing OpenAI Sites project reference.

State is intentionally device-local:

- selected Vibe Pack;
- Little Reader preference;
- unlocked Safe Base items;
- placed Safe Base items;
- selected safe-adult categories.

There is no child account, analytics pipeline, behavioral history, or cloud
database in this prototype.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm run build
npm test
```

## Suggested audit priorities

When reviewing this project, focus on:

1. Whether any wording could shame, blame, diagnose, or minimize distress.
2. Whether every activity can be stopped or exited without failure language.
3. Whether caregiver connection precedes problem-solving during high alarm.
4. Whether all unsafe-action limits preserve the child's belonging.
5. Whether a five-year-old can follow core pathways through pictures and audio.
6. Whether audio, timers, dialogs, and reward transitions have accessible
   fallbacks.
7. Whether local persistence can fail without trapping or blaming the child.
8. Whether original characters and language avoid protected brands, creators,
   and likenesses.
9. Whether the emotion-cycle content accurately preserves the intended DBT
   concepts while remaining developmentally appropriate.
10. Whether any future telemetry, authentication, or voice integration would
    introduce avoidable child-privacy risk.

## Current phase

Phase A—the complete UI pathway pass—is implemented. Narration scripts should
be frozen and clinically reviewed before producing the authorized ElevenLabs
voice files.
