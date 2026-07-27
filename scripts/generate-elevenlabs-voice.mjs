import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, "app", "page.tsx");
const audioDir = path.join(projectRoot, "public", "audio", "custom");
const generatedMapPath = path.join(
  projectRoot,
  "app",
  "generated-voice-clips.ts",
);
const voiceId = process.env.ELEVENLABS_VOICE_ID ?? "o45Bn24LMNa7CftjBPh4";
const modelId = process.env.ELEVENLABS_MODEL_ID ?? "eleven_flash_v2_5";
const mode = process.argv[2] ?? "--generate";

async function getApiKey() {
  if (process.env.ELEVENLABS_API_KEY?.trim()) {
    return process.env.ELEVENLABS_API_KEY.trim();
  }

  const candidates = [
    path.join(projectRoot, "ELEVENLABS-KEY-LOCAL.txt"),
    path.join(projectRoot, ".env.local"),
  ];
  for (const candidate of candidates) {
    try {
      const value = (await readFile(candidate, "utf8")).trim();
      if (!value || value.includes("Paste only") || value.includes("replace_this")) {
        continue;
      }
      return value.startsWith("ELEVENLABS_API_KEY=")
        ? value.slice("ELEVENLABS_API_KEY=".length).trim()
        : value;
    } catch {
      // Try the next local-only source.
    }
  }
  throw new Error(
    "No ElevenLabs key found. Add it to ELEVENLABS-KEY-LOCAL.txt or ELEVENLABS_API_KEY.",
  );
}

function unwrap(node) {
  if (
    ts.isAsExpression(node) ||
    ts.isTypeAssertionExpression(node) ||
    ts.isParenthesizedExpression(node) ||
    ts.isSatisfiesExpression(node)
  ) {
    return unwrap(node.expression);
  }
  return node;
}

function literalValue(input) {
  const node = unwrap(input);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node)) {
    return node.elements.map((element) => literalValue(element));
  }
  if (ts.isObjectLiteralExpression(node)) {
    const result = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const name = ts.isIdentifier(property.name)
        ? property.name.text
        : ts.isStringLiteral(property.name)
          ? property.name.text
          : null;
      if (name) result[name] = literalValue(property.initializer);
    }
    return result;
  }
  return undefined;
}

async function loadContent() {
  const source = await readFile(sourcePath, "utf8");
  const sourceFile = ts.createSourceFile(
    sourcePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const declarations = new Map();

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      declarations.set(node.name.text, node.initializer);
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  const readConst = (name) => {
    const declaration = declarations.get(name);
    if (!declaration) throw new Error(`Could not find ${name} in app/page.tsx.`);
    return literalValue(declaration);
  };

  return {
    bodyMoves: readConst("BODY_MOVES"),
    characters: readConst("CHARACTERS"),
    coreDirections: readConst("CORE_DIRECTIONS"),
    coreQuests: readConst("CORE_QUESTS"),
    emotions: readConst("EMOTIONS"),
    feelingGroups: readConst("FEELING_GROUPS"),
    missions: readConst("PAL_MISSIONS"),
    pageDirections: readConst("PAGE_DIRECTIONS"),
    rewards: readConst("SAFE_BASE_REWARDS"),
    stories: readConst("PAL_STORIES"),
  };
}

function buildEntries(content) {
  const entries = [];
  const add = (text, cue) => {
    if (typeof text !== "string" || !text.trim()) return;
    entries.push({ cue, text: text.trim() });
  };

  for (const [page, text] of Object.entries(content.pageDirections)) {
    add(text, `page-${page}`);
  }

  for (const mission of content.missions) {
    add(
      `${mission.name}. ${mission.power}. ${mission.problem}`,
      `mission-${mission.id}`,
    );
    const stageNarrations = [
      `PAL PROBLEM. ${mission.name} needs your team. ${mission.problem}`,
      `GROWN-UP TURN. Pass it to the grown-up. ${mission.grownupTurn}`,
      `KID TURN. Pass it to the kid. ${mission.kidTurn}`,
      `MOVE TOGETHER. Both players do the move. ${mission.move}`,
      `${mission.name} is ready. Pick one safe move together.`,
    ];
    stageNarrations.forEach((text) => add(text));
    add(mission.grownupTurn);
    add(mission.kidTurn);
    add(mission.move);
    add(mission.challenge);
    for (const choice of mission.choices) {
      add(`${choice.spoken} ${mission.celebration}`);
    }
  }

  for (const move of content.bodyMoves) {
    add(`${move.name}. ${move.cue}`);
  }
  for (const story of content.stories) {
    add(`${story.title}. ${story.event}.`);
  }
  for (const group of content.feelingGroups) {
    add(group.spoken, `feeling-group-${group.id}`);
  }
  for (const character of content.characters) add(character.voice);

  for (const emotion of content.emotions) {
    add(`${emotion.name}. ${emotion.alias}.`);
    add(
      `${emotion.name}. ${emotion.alias}. ${emotion.message} You might notice ${emotion.body}. You may need ${emotion.need}.`,
    );
    add(
      `${emotion.name}. ${emotion.alias}. ${emotion.message} Your body might have ${emotion.body}. You may need ${emotion.need}.`,
    );
  }

  for (const [questId, text] of Object.entries(content.coreDirections)) {
    add(text, `quest-directions-${questId}`);
  }
  for (const quest of content.coreQuests) {
    add(`${quest.title}. ${quest.stable}.`, `quest-${quest.id}`);
  }
  for (const reward of content.rewards) {
    add(`${reward.name}. ${reward.detail}`, `reward-${reward.id}`);
  }

  [
    "Play With Me. Short turns, big pictures, and grown-up teamwork.",
    "Challenge Me. Add a clue, a strategy, and a two-truth challenge.",
    "Clue: a harmless silly surprise is ready. Tap I am ready to reveal it.",
    "My Feeling mode. Pick the feeling that is closest.",
    "Calm Voice online. Slow, steady, and clear.",
    "Hype Voice online. Big energy, clear directions.",
    "Voice is back on.",
    "Your body is having a giant alarm. I am here. You are not alone. We will solve it after your body is ready.",
    "Your body is having a huge alarm. I am here with you. We will solve it when your body is ready.",
    "I am super mad, and I can keep my hands safe.",
  ].forEach((text) => add(text));

  [
    "Cappy is now wearing three tiny hats.",
    "DJ Slime sneezed one polite bubble.",
    "Both-Bot’s left sock turned rainbow.",
    "A pixel duck walked through the portal.",
    "Axo found five pieces of pretend confetti.",
  ].forEach((text) => add(text));

  const unique = new Map();
  for (const entry of entries) {
    const key = entry.cue ? `cue:${entry.cue}` : `text:${entry.text}`;
    if (!unique.has(key)) unique.set(key, entry);
  }
  return [...unique.values()];
}

function fileNameFor(entry) {
  const readable = (entry.cue ?? entry.text)
    .toLowerCase()
    .replaceAll(/[’']/g, "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")
    .slice(0, 48);
  const hash = createHash("sha256").update(entry.text).digest("hex").slice(0, 10);
  return `${readable || "clip"}-${hash}.mp3`;
}

async function apiJson(url, apiKey) {
  const response = await fetch(url, { headers: { "xi-api-key": apiKey } });
  if (!response.ok) {
    throw new Error(`ElevenLabs request failed (${response.status}): ${await response.text()}`);
  }
  return response.json();
}

async function main() {
  const apiKey = await getApiKey();
  const [voice, subscription, content] = await Promise.all([
    apiJson(`https://api.elevenlabs.io/v1/voices/${voiceId}`, apiKey).catch(
      () => ({ name: "Authorized custom voice" }),
    ),
    apiJson("https://api.elevenlabs.io/v1/user/subscription", apiKey).catch(
      () => null,
    ),
    loadContent(),
  ]);
  const entries = buildEntries(content);
  const characterCount = entries.reduce((total, entry) => total + entry.text.length, 0);
  const remaining =
    subscription &&
    typeof subscription.character_limit === "number" &&
    typeof subscription.character_count === "number"
      ? subscription.character_limit - subscription.character_count
      : null;

  console.log(`Voice verified: ${voice.name ?? "custom voice"}`);
  console.log(
    `Voice pack plan: ${entries.length} clips, ${characterCount} source characters, model ${modelId}.`,
  );
  if (remaining !== null) {
    console.log(`Account characters remaining before model modifiers: ${remaining}.`);
  }
  if (mode === "--check" || mode === "--plan") return;

  await mkdir(audioDir, { recursive: true });
  const cueMap = {};
  const textMap = {};
  let generated = 0;
  let reused = 0;

  for (const [index, entry] of entries.entries()) {
    const fileName = fileNameFor(entry);
    const absolutePath = path.join(audioDir, fileName);
    const publicPath = `/audio/custom/${fileName}`;
    try {
      await readFile(absolutePath);
      reused += 1;
    } catch {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            apply_text_normalization: "on",
            model_id: modelId,
            seed: Number.parseInt(
              createHash("sha256").update(entry.text).digest("hex").slice(0, 8),
              16,
            ),
            text: entry.text,
            voice_settings: {
              similarity_boost: 0.78,
              stability: 0.54,
              use_speaker_boost: true,
            },
          }),
        },
      );
      if (!response.ok) {
        throw new Error(
          `Clip ${index + 1}/${entries.length} failed (${response.status}): ${await response.text()}`,
        );
      }
      const temporaryPath = `${absolutePath}.partial`;
      await writeFile(temporaryPath, Buffer.from(await response.arrayBuffer()));
      await rename(temporaryPath, absolutePath);
      generated += 1;
      console.log(`Generated ${index + 1}/${entries.length}: ${entry.cue ?? fileName}`);
    }
    if (entry.cue) cueMap[entry.cue] = publicPath;
    textMap[entry.text] = publicPath;
  }

  const generatedSource = `// Generated by scripts/generate-elevenlabs-voice.mjs.
// Static audio only: no API key or child-entered text is shipped to the app.
export const CUSTOM_VOICE_CUE_CLIPS: Record<string, string> = ${JSON.stringify(cueMap, null, 2)};
export const CUSTOM_VOICE_TEXT_CLIPS: Record<string, string> = ${JSON.stringify(textMap, null, 2)};
export const CUSTOM_VOICE_META = ${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      modelId,
      voiceId,
      voiceName: voice.name ?? null,
    },
    null,
    2,
  )};
`;
  await writeFile(generatedMapPath, generatedSource);
  console.log(`Voice pack ready: ${generated} generated, ${reused} reused.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
