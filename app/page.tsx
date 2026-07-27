"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Tab =
  | "home"
  | "machine"
  | "glossary"
  | "worlds"
  | "arcade"
  | "grownup";
type VibePackId = "genAlpha" | "creature" | "straightUp";
type ArcadeSkillId =
  | "sixSeven"
  | "sigmaStop"
  | "noCapFacts"
  | "susOrFacts"
  | "auraRecharge"
  | "bigWRepair"
  | "brainrotBoss"
  | "chaosChill"
  | "sigmaBoth";
type PowerUpId =
  | "sigmaStop"
  | "noCapFacts"
  | "getBackup"
  | "bothMode"
  | "plotTwist"
  | "askHero"
  | "comfortQuest"
  | "bigWRepair"
  | "slimeSlow";

type Emotion = {
  id: string;
  name: string;
  alias: string;
  emoji: string;
  color: string;
  message: string;
  signal: string;
  need: string;
  body: string;
  vulnerability: string;
  event: string;
  thought: string;
  urge: string;
  reaction: string;
  impact: string;
  after: string;
  recommended: PowerUpId[];
};

const POWER_UPS: Record<
  PowerUpId,
  {
    label: string;
    dbt: string;
    emoji: string;
    action: string;
    impact: string;
    after: string;
    cheer: string;
  }
> = {
  sigmaStop: {
    label: "Sigma STOP",
    dbt: "STOP",
    emoji: "🛑",
    action: "Freeze. Back up. Spy the scene. Pick the safe move.",
    impact: "Other people get a pause and can help.",
    after: "Your thinking brain gets a turn before the cycle reloads.",
    cheer: "Huge W! You made space between the feeling and the move.",
  },
  noCapFacts: {
    label: "No-Cap Facts",
    dbt: "Check the Facts",
    emoji: "🔎",
    action: "Sort what you KNOW from what your brain is GUESSING.",
    impact: "Other people hear less blame and more curiosity.",
    after: "The problem gets its real size—not its brain-spam size.",
    cheer: "No cap: checking the facts is a power move.",
  },
  getBackup: {
    label: "Get Backup",
    dbt: "Co-regulation",
    emoji: "🤝",
    action: "Use your signal: “Grown-up power-up, please stay with me.”",
    impact: "A safe grown-up knows you need connection before solving.",
    after: "You are not alone with the giant feeling.",
    cheer: "Real sigma gets backup. Connection unlocked!",
  },
  bothMode: {
    label: "Both Mode",
    dbt: "Dialectics",
    emoji: "↔️",
    action: "Say two true things: “This is hard AND I can get help.”",
    impact: "Other people can understand your feeling and your next step.",
    after: "The all-or-nothing trap gets smaller.",
    cheer: "Two truths at once—Both Mode activated!",
  },
  plotTwist: {
    label: "Plot-Twist Move",
    dbt: "Opposite Action",
    emoji: "🎬",
    action: "Choose one tiny move opposite to the unhelpful urge.",
    impact: "Others see a brave or gentle signal instead of the first impulse.",
    after: "Your brain learns that another ending is possible.",
    cheer: "Plot twist! You changed the ending.",
  },
  askHero: {
    label: "Ask Like a Hero",
    dbt: "Interpersonal Effectiveness",
    emoji: "💬",
    action: "Say what happened, name the feeling, and make one clear ask.",
    impact: "Other people know what you need without guessing.",
    after: "The problem has a fair chance to get solved.",
    cheer: "Clear ask, kind voice, hero-level communication!",
  },
  comfortQuest: {
    label: "Comfort Quest",
    dbt: "Self-soothe",
    emoji: "🧸",
    action: "Choose safe comfort: soft, quiet, music, movement, or closeness.",
    impact: "Others learn what kind of comfort actually helps.",
    after: "The feeling can move through without taking over.",
    cheer: "Comfort is a skill, not a cheat code.",
  },
  bigWRepair: {
    label: "Big W Repair",
    dbt: "Repair + problem solving",
    emoji: "🧰",
    action: "Tell the truth, check for hurt, and help fix what you can.",
    impact: "Others see honesty, care, and effort.",
    after: "Trust can regrow. The mistake does not become your identity.",
    cheer: "Repair complete. Mistake ≠ bad kid.",
  },
  slimeSlow: {
    label: "Slime Goes Slow",
    dbt: "Paced breathing",
    emoji: "🫧",
    action: "Plant your feet and make the out-breath longer than the in-breath.",
    impact: "Your body sends a quieter signal to the room.",
    after: "The body alarm turns down enough to choose.",
    cheer: "Slime slow. Body slow. Choice power online!",
  },
};

const EMOTIONS: Emotion[] = [
  {
    id: "angry",
    name: "Angry",
    alias: "Volcano mode",
    emoji: "🌋",
    color: "coral",
    message: "Something feels unfair, blocked, threatened, or not okay.",
    signal: "I may get loud or big because I need space, help, or a boundary.",
    need: "Safety, a limit, a solution, movement, or time to cool.",
    body: "Hot face • tight fists • fast heart • big voice",
    vulnerability: "Tired, hungry, rushed, or already stressed",
    event: "Someone takes the block you were using",
    thought: "“They did it on purpose. Nobody cares.”",
    urge: "Yell, grab, hit, or push away",
    reaction: "Grab it back and yell, “You’re mean!”",
    impact: "They may feel scared, fight back, or stop listening",
    after: "Still mad, now disconnected, and the cycle reloads",
    recommended: ["sigmaStop", "noCapFacts", "askHero"],
  },
  {
    id: "scared",
    name: "Scared",
    alias: "Alarm mode",
    emoji: "🚨",
    color: "aqua",
    message: "Something might be dangerous, uncertain, or too much.",
    signal: "I may run, cling, freeze, or get silly because I need safety.",
    need: "A safe grown-up, a clear plan, reassurance, or one tiny brave step.",
    body: "Wide eyes • shaky legs • fast breath • frozen body",
    vulnerability: "A new place, loud noises, change, or a hard memory",
    event: "A grown-up suddenly leaves the room",
    thought: "“They might not come back. I am all alone.”",
    urge: "Run, hide, freeze, chase, or cling",
    reaction: "Scream, chase the grown-up, or shut down",
    impact: "Others may rush, argue, or miss the fear underneath",
    after: "The alarm stays high and leaving feels even scarier",
    recommended: ["getBackup", "slimeSlow", "plotTwist"],
  },
  {
    id: "sad",
    name: "Sad",
    alias: "Rain-cloud mode",
    emoji: "🌧️",
    color: "blue",
    message: "Something important feels lost, changed, or far away.",
    signal: "My tears, quiet, or low energy may be asking for comfort.",
    need: "Closeness, rest, gentle comfort, or permission to miss something.",
    body: "Heavy chest • tears • low energy • slow body",
    vulnerability: "Missing someone, tired, or after a hard day",
    event: "A favorite visit or plan gets canceled",
    thought: "“Nothing good happens. Nobody wants me.”",
    urge: "Hide, curl up, quit, or push comfort away",
    reaction: "Go away and refuse every offer of comfort",
    impact: "Others may think you want to be left alone",
    after: "Sadness feels heavier and connection gets smaller",
    recommended: ["comfortQuest", "getBackup", "plotTwist"],
  },
  {
    id: "frustrated",
    name: "Frustrated",
    alias: "Impossible-level mode",
    emoji: "🎮",
    color: "orange",
    message: "A goal is blocked or something is not working yet.",
    signal: "My groan or tense body may be asking for help or a new strategy.",
    need: "A pause, fewer steps, teamwork, practice, or a different plan.",
    body: "Tense shoulders • groan • hot hands • scrunched face",
    vulnerability: "A long task, low energy, or too many directions",
    event: "The block tower falls again",
    thought: "“I can’t do anything. This is impossible.”",
    urge: "Throw it, smash it, quit, or blame someone",
    reaction: "Smash the tower and yell",
    impact: "Others may stop helping or get upset",
    after: "The goal stays blocked and shame may join the cycle",
    recommended: ["sigmaStop", "getBackup", "plotTwist"],
  },
  {
    id: "worried",
    name: "Worried",
    alias: "What-if spam",
    emoji: "🌀",
    color: "purple",
    message: "My brain is trying extra hard to predict a future problem.",
    signal: "My repeating questions may mean I need information and a small plan.",
    need: "Facts, predictability, grounding, or one useful next step.",
    body: "Tummy ache • fidgeting • repeated questions • tight chest",
    vulnerability: "A change is coming or the plan is unclear",
    event: "Tomorrow has a brand-new activity",
    thought: "“What if it is awful? What if I mess up?”",
    urge: "Avoid, ask again, or control every detail",
    reaction: "Refuse to go and keep checking the same answer",
    impact: "Others may answer again but feel stuck",
    after: "Short relief, then even more what-if spam",
    recommended: ["noCapFacts", "slimeSlow", "bothMode"],
  },
  {
    id: "hurt",
    name: "Hurt or left out",
    alias: "Kicked-from-the-squad feeling",
    emoji: "💔",
    color: "pink",
    message: "A connection feels damaged, missing, or uncertain.",
    signal: "My anger, quiet, or mean words may be hiding a belonging need.",
    need: "Reassurance, truth, inclusion, repair, or help asking to join.",
    body: "Chest ache • tears • hot cheeks • urge to look away",
    vulnerability: "A recent separation, change, or disconnected day",
    event: "Two kids start playing without asking you",
    thought: "“They hate me. I never belong.”",
    urge: "Insult them, ruin the game, or walk away forever",
    reaction: "Knock it down or say, “I hate you!”",
    impact: "Others may back away and miss the hurt",
    after: "Disconnection grows and the scary story feels proven",
    recommended: ["bothMode", "askHero", "getBackup"],
  },
  {
    id: "guilty",
    name: "Guilty",
    alias: "Repair-needed alert",
    emoji: "🧰",
    color: "gold",
    message: "I may have done something that does not match my values.",
    signal: "Looking away or hiding may mean I know something needs repair.",
    need: "Truth, a fair limit, help repairing, and a fresh start.",
    body: "Sinking tummy • quiet voice • looking away • fidgeting",
    vulnerability: "Overwhelmed, impulsive, or afraid of punishment",
    event: "You break something during a giant feeling",
    thought: "“I’m in trouble. Maybe I should hide it.”",
    urge: "Hide, lie, blame, or run away",
    reaction: "Say somebody else did it",
    impact: "Others feel confused and trust gets wobbly",
    after: "Guilt and fear grow because repair has to wait",
    recommended: ["bigWRepair", "bothMode", "getBackup"],
  },
  {
    id: "shame",
    name: "Shame",
    alias: "My-brain-says-I’m-bad mode",
    emoji: "🫥",
    color: "indigo",
    message: "My brain says I am bad, unlovable, or do not belong.",
    signal: "I may hide, attack, act silly, blame, or say “I don’t care” so nobody sees the hurt.",
    need: "Safety, belonging, truth, and help separating what I did from who I am.",
    body: "Hot cheeks • looking down • small body • numb or buzzy",
    vulnerability: "Got corrected, made a mistake, or remembered rejection",
    event: "A grown-up says a rule was broken",
    thought: "“I am bad. They might stop loving me.”",
    urge: "Hide, lie, blame, attack, or disappear",
    reaction: "Shout, “I don’t care!” and run away",
    impact: "Others may see defiance and miss the pain underneath",
    after: "You feel more alone and the shame story gets louder",
    recommended: ["bothMode", "getBackup", "bigWRepair"],
  },
  {
    id: "embarrassed",
    name: "Embarrassed",
    alias: "Want-to-respawn feeling",
    emoji: "🫣",
    color: "rose",
    message: "Something about me got noticed in a way I did not want.",
    signal: "I may hide my face, get silly, or act mad because I feel exposed.",
    need: "Kindness, perspective, privacy, or help trying again.",
    body: "Warm cheeks • hiding face • nervous laugh • shrinking",
    vulnerability: "New group, being watched, or wanting to do well",
    event: "Everyone sees you make a mistake",
    thought: "“They will laugh forever.”",
    urge: "Hide, quit, joke, or blame",
    reaction: "Knock the game away and refuse to try",
    impact: "Others may not know you need kindness",
    after: "Trying again feels harder than before",
    recommended: ["noCapFacts", "bothMode", "plotTwist"],
  },
  {
    id: "jealous",
    name: "Jealous",
    alias: "Why-did-they-get-the-loot feeling",
    emoji: "🟢",
    color: "lime",
    message: "Someone has attention, connection, or something I want.",
    signal: "My grabbing or competing may mean I need reassurance or a fair turn.",
    need: "Belonging, a clear turn, appreciation, or help asking directly.",
    body: "Tight chest • staring • grabby hands • buzzy thoughts",
    vulnerability: "Feeling left out, overlooked, or unsure you matter",
    event: "Someone else gets a special turn",
    thought: "“They are the favorite. I get nothing.”",
    urge: "Take it, ruin it, brag, or reject them first",
    reaction: "Interrupt their turn or call it stupid",
    impact: "Others may protect their space and move farther away",
    after: "The connection you wanted feels even less available",
    recommended: ["noCapFacts", "askHero", "bothMode"],
  },
  {
    id: "confused",
    name: "Confused",
    alias: "Brain buffering",
    emoji: "⏳",
    color: "teal",
    message: "I do not understand the information, rule, or situation yet.",
    signal: "My blank look or goofy behavior may mean I need fewer words.",
    need: "One step, a picture, more time, or a chance to ask.",
    body: "Frozen face • wandering eyes • wiggly body • blank mind",
    vulnerability: "Too many words, noise, speed, or a brand-new task",
    event: "A grown-up gives four directions at once",
    thought: "“I don’t know what to do.”",
    urge: "Guess, escape, joke, or do nothing",
    reaction: "Run off or do a random step",
    impact: "Others may think you ignored them",
    after: "More directions arrive and the buffering gets bigger",
    recommended: ["sigmaStop", "askHero", "getBackup"],
  },
  {
    id: "lonely",
    name: "Lonely",
    alias: "Squad-is-too-far feeling",
    emoji: "🌙",
    color: "blue",
    message: "I need more connection, closeness, or shared play.",
    signal: "I may get clingy, bossy, quiet, or disruptive to pull someone close.",
    need: "Warm attention, a shared activity, comfort, or help joining.",
    body: "Hollow tummy • heavy chest • quiet voice • restless body",
    vulnerability: "A separation, transition, quiet room, or disconnected day",
    event: "Nobody is available to play right now",
    thought: "“No one wants me around.”",
    urge: "Demand, interrupt, withdraw, or test whether people care",
    reaction: "Start chaos so someone has to come over",
    impact: "Others may focus on the chaos instead of the connection need",
    after: "Attention arrives, but closeness still feels uncertain",
    recommended: ["getBackup", "askHero", "comfortQuest"],
  },
  {
    id: "calm",
    name: "Calm",
    alias: "Capy chill",
    emoji: "🦫",
    color: "green",
    message: "My body feels safe enough to notice, connect, and choose.",
    signal: "My steady voice and relaxed body tell others I am available.",
    need: "Enjoy the moment, practice skills, play, or connect.",
    body: "Easy breath • soft hands • steady voice • open attention",
    vulnerability: "Rested, fed, connected, and prepared",
    event: "You are building in a safe space with someone you trust",
    thought: "“I can handle this moment.”",
    urge: "Explore, connect, listen, or create",
    reaction: "Keep building and share the space",
    impact: "Others can relax, cooperate, and play",
    after: "Connection and confidence become fuel for the next cycle",
    recommended: ["bothMode", "askHero", "comfortQuest"],
  },
  {
    id: "excited",
    name: "Excited",
    alias: "Hype mode",
    emoji: "⚡",
    color: "yellow",
    message: "Something fun, interesting, or rewarding may happen.",
    signal: "My loud, fast energy means I want to share the fun.",
    need: "A safe way to move, celebrate, wait, and include others.",
    body: "Bouncy legs • fast talking • big smile • loud voice",
    vulnerability: "Big event, lots of stimulation, or not enough sleep",
    event: "A surprise challenge is announced",
    thought: "“This will be amazing! I have to go now!”",
    urge: "Interrupt, climb, grab, or rush ahead",
    reaction: "Charge in without hearing the directions",
    impact: "Others may get bumped or feel overwhelmed",
    after: "The fun gets interrupted by a safety problem",
    recommended: ["slimeSlow", "sigmaStop", "askHero"],
  },
  {
    id: "proud",
    name: "Proud",
    alias: "Aura glow-up",
    emoji: "✨",
    color: "violet",
    message: "I did something meaningful, brave, skillful, or kind.",
    signal: "My smile and story invite others to celebrate with me.",
    need: "Enjoy it, share it, remember the effort, and appreciate helpers.",
    body: "Tall posture • warm chest • bright eyes • energized body",
    vulnerability: "Worked hard, tried again, or acted from your values",
    event: "You use a skill during a hard moment",
    thought: "“I did something difficult!”",
    urge: "Celebrate, tell someone, or try another challenge",
    reaction: "Share the win and name the skill",
    impact: "Others can celebrate and learn what helped",
    after: "Confidence grows without needing to beat anyone else",
    recommended: ["bothMode", "askHero", "comfortQuest"],
  },
];

const WORLDS = [
  {
    id: "notice",
    emoji: "🦫",
    title: "Capybara Notice Mode",
    dbt: "Mindfulness",
    blurb: "Notice this moment without fighting it or judging it.",
    skills: ["Observe", "Describe", "Join in", "One thing at a time"],
    challenge: "6–7 Reset",
  },
  {
    id: "slime",
    emoji: "🫧",
    title: "Survive the Slime Storm",
    dbt: "Distress Tolerance",
    blurb: "Get through a giant feeling without making the problem bigger.",
    skills: ["Sigma STOP", "Slime Goes Slow", "Comfort Quest", "Get Backup"],
    challenge: "Slime Goes Slow",
  },
  {
    id: "lab",
    emoji: "🦄",
    title: "Emotion Creature Lab",
    dbt: "Emotion Regulation",
    blurb: "Name emotions, understand their messages, and change the cycle.",
    skills: ["Emotion Glossary", "No-Cap Facts", "Plot-Twist Move", "Body Battery"],
    challenge: "Emotion Machine",
  },
  {
    id: "squad",
    emoji: "🤝",
    title: "Squad Skills",
    dbt: "Interpersonal Effectiveness",
    blurb: "Ask, listen, set limits, and repair while keeping self-respect.",
    skills: ["Ask Like a Hero", "Kind Voice", "Clear No", "Big W Repair"],
    challenge: "Build a Hero Ask",
  },
  {
    id: "both",
    emoji: "↔️",
    title: "Both Mode Portal",
    dbt: "Walking the Middle Path",
    blurb: "Escape all-or-nothing traps. Two different things can be true.",
    skills: ["Both Mode", "Validation", "Flexible Thinking", "Try Again"],
    challenge: "Make Two Truths",
  },
];

const ARCADE_SKILLS: {
  id: ArcadeSkillId;
  emoji: string;
  stable: string;
  dbt: string;
  blurb: string;
}[] = [
  {
    id: "sixSeven",
    emoji: "6️⃣",
    stable: "Wiggle • Still • Notice",
    dbt: "Mindfulness + STOP",
    blurb: "A grown-up-and-kid call-and-response reset for busy bodies.",
  },
  {
    id: "sigmaStop",
    emoji: "🛑",
    stable: "Freeze • Back up • Look • Choose",
    dbt: "STOP",
    blurb: "Make room between the giant feeling and the next move.",
  },
  {
    id: "noCapFacts",
    emoji: "🔎",
    stable: "See • Guess • Check",
    dbt: "Check the Facts",
    blurb: "Separate what happened from what the Alarm Monster predicts.",
  },
  {
    id: "susOrFacts",
    emoji: "🕵️",
    stable: "Sort facts from brain guesses",
    dbt: "Check the Facts",
    blurb: "A two-button detective game with no trick answers.",
  },
  {
    id: "auraRecharge",
    emoji: "✨",
    stable: "Care for the body • Get connection",
    dbt: "PLEASE + Co-regulation",
    blurb: "Check body needs before asking the brain to do a hard thing.",
  },
  {
    id: "bigWRepair",
    emoji: "🧰",
    stable: "Truth • Check • Fix • Reconnect",
    dbt: "Repair + Problem Solving",
    blurb: "A mistake is something to repair—not a kid identity.",
  },
  {
    id: "brainrotBoss",
    emoji: "🎧",
    stable: "Breathe • Ground • Choose",
    dbt: "Distress Tolerance",
    blurb: "Regulate while DJ Slime drops a ridiculous original rap.",
  },
  {
    id: "chaosChill",
    emoji: "🌪️",
    stable: "Name the body state",
    dbt: "Mindfulness of current emotion",
    blurb: "Name the nervous-system weather without calling the child bad.",
  },
  {
    id: "sigmaBoth",
    emoji: "↔️",
    stable: "Two truths can be true",
    dbt: "Walking the Middle Path",
    blurb: "Hold a big feeling and a safe choice at the same time.",
  },
];

const VIBE_PACKS: Record<
  VibePackId,
  {
    name: string;
    emoji: string;
    note: string;
    labels: Record<ArcadeSkillId, string>;
  }
> = {
  genAlpha: {
    name: "Gen Alpha Pack",
    emoji: "⚡",
    note: "6–7, sigma, aura, sus, and no-cap words.",
    labels: {
      sixSeven: "6–7 Reset",
      sigmaStop: "Sigma STOP",
      noCapFacts: "No-Cap Facts",
      susOrFacts: "Sus or Facts?",
      auraRecharge: "Aura Recharge",
      bigWRepair: "Big W Repair",
      brainrotBoss: "Brainrot Boss Battle",
      chaosChill: "Chaos Mode → Chill Mode",
      sigmaBoth: "Sigma Both Mode",
    },
  },
  creature: {
    name: "Creature Pack",
    emoji: "🦫",
    note: "Capybaras, axolotls, unicorns, and slime.",
    labels: {
      sixSeven: "Axolotl Wiggle Reset",
      sigmaStop: "Capybara Pause",
      noCapFacts: "Unicorn Fact Beam",
      susOrFacts: "Axolotl Detective",
      auraRecharge: "Creature Care Check",
      bigWRepair: "Capy Fix-It Quest",
      brainrotBoss: "DJ Slime Boss Battle",
      chaosChill: "Slime Storm → Soft Slime",
      sigmaBoth: "Unicorn AND Portal",
    },
  },
  straightUp: {
    name: "Straight-Up Pack",
    emoji: "💬",
    note: "Simple skill names with no slang.",
    labels: {
      sixSeven: "Wiggle + Notice Reset",
      sigmaStop: "Stop and Choose",
      noCapFacts: "What Happened?",
      susOrFacts: "Fact or Guess?",
      auraRecharge: "Body Needs Check",
      bigWRepair: "Make It Right",
      brainrotBoss: "Breathing Challenge",
      chaosChill: "Fast Body → Settled Body",
      sigmaBoth: "Both Can Be True",
    },
  },
};

const NAV: { id: Tab; label: string; emoji: string }[] = [
  { id: "home", label: "Home", emoji: "🏝️" },
  { id: "machine", label: "Emotion Machine", emoji: "⚙️" },
  { id: "glossary", label: "Feelings", emoji: "📖" },
  { id: "worlds", label: "Skill Worlds", emoji: "🌀" },
  { id: "arcade", label: "Vibe Arcade", emoji: "🕹️" },
  { id: "grownup", label: "Grown-up Co-op", emoji: "🤝" },
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function SixSevenReset({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<
    "ready" | "call" | "wiggle" | "freeze" | "done"
  >("ready");
  const [seconds, setSeconds] = useState(6);

  useEffect(() => {
    if (phase !== "wiggle" && phase !== "freeze") return;
    const timer = window.setTimeout(() => {
      if (seconds > 1) {
        setSeconds(seconds - 1);
      } else if (phase === "wiggle") {
        setPhase("freeze");
        setSeconds(7);
      } else {
        setPhase("done");
        onComplete?.();
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [onComplete, phase, seconds]);

  const answer = () => {
    setPhase("wiggle");
    setSeconds(6);
  };

  return (
    <div className={`challenge-stage ${phase}`}>
      <div className="challenge-orb" aria-live="polite">
        <span className="challenge-number">
          {phase === "ready"
            ? "6–7"
            : phase === "call"
              ? "6!"
            : phase === "done"
              ? "W!"
              : seconds}
        </span>
        <span>
          {phase === "ready"
            ? "GROWN-UP + KID"
            : phase === "call"
              ? "KID SAYS: SEVEN!"
            : phase === "wiggle"
              ? "WIGGLE!"
              : phase === "freeze"
                ? "FREEZE + NOTICE"
                : "SIGMA STOP UNLOCKED"}
        </span>
      </div>
      <p>
        {phase === "ready"
          ? "Grown-up says “Six!” Kid answers “Seven!” Then wiggle for six and get still for seven."
          : phase === "call"
            ? "Child says “Seven!” Both players freeze for one beat, then start the reset."
          : phase === "done"
            ? "What changed in your body—fast, slow, hot, cold, tight, or loose?"
            : phase === "wiggle"
              ? "Shake out the buzz—safe body, safe space."
              : "Feet still. Hands safe. Spy one thing you see and one thing you feel."}
      </p>
      {phase === "ready" && (
        <button
          className="primary-button"
          onClick={() => setPhase("call")}
          type="button"
        >
          Grown-up says “Six!”
        </button>
      )}
      {phase === "call" && (
        <button className="primary-button" onClick={answer} type="button">
          Kid answers “Seven!”
        </button>
      )}
      {phase === "done" && (
        <button
          className="primary-button"
          onClick={() => setPhase("ready")}
          type="button"
        >
          Do it again
        </button>
      )}
    </div>
  );
}

function SlimeBreathing() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (elapsed >= 30) {
      setRunning(false);
      return;
    }
    const timer = window.setTimeout(() => setElapsed(elapsed + 1), 1000);
    return () => window.clearTimeout(timer);
  }, [running, elapsed]);

  const position = elapsed % 10;
  const phase = !running
    ? elapsed >= 30
      ? "Complete!"
      : "Ready?"
    : position < 4
      ? "Breathe in"
      : "Breathe out sloooow";

  return (
    <div className="breathing-stage">
      <div
        className={`slime-orb ${running ? "is-breathing" : ""}`}
        aria-label={phase}
      >
        <span>{phase}</span>
      </div>
      <p>Easy breath in. Longer, slower breath out. No holding.</p>
      <button
        className="primary-button"
        onClick={() => {
          setElapsed(0);
          setRunning(true);
        }}
        type="button"
      >
        {running ? "Restart slime" : "Start 3 slow breaths"}
      </button>
    </div>
  );
}

function SigmaStopChallenge({ onComplete }: { onComplete: () => void }) {
  const steps = [
    ["FREEZE", "Stop your body. Safe hands and feet."],
    ["BACK UP", "Take one step or one breath of space."],
    ["SPY THE SCENE", "What is happening? What is your brain guessing?"],
    ["PICK THE MOVE", "Get space, use words, or call your grown-up."],
  ];
  const [step, setStep] = useState(0);

  const advance = () => {
    if (step === steps.length - 1) {
      onComplete();
      setStep(0);
      return;
    }
    setStep((current) => current + 1);
  };

  return (
    <div className="stop-challenge">
      <div className="stop-sign" aria-hidden="true">
        {step + 1}
      </div>
      <span className="activity-kicker">STEP {step + 1} OF 4</span>
      <h3>{steps[step][0]}</h3>
      <p>{steps[step][1]}</p>
      {step === 3 && (
        <div className="backup-truth">
          Real sigma gets backup. Safe and kind beats solo and dominant.
        </div>
      )}
      <button className="primary-button" onClick={advance} type="button">
        {step === 3 ? "Choose the safe move" : "Next move"}
      </button>
    </div>
  );
}

function NoCapFactsChallenge({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="alarm-screen">
      <div className="alarm-monster" aria-hidden="true">
        👾
      </div>
      <span className="activity-kicker">ALARM MONSTER CHECK</span>
      <h3>BRO, THE ALARM MONSTER IS BEING SUS</h3>
      <p className="alarm-question">
        Is this a real danger, a brain guess, or a little of both?
      </p>
      <div className="fact-prompts">
        <div>
          <span>👀 NO-CAP FACTS</span>
          <p>What did your eyes see and your ears hear?</p>
        </div>
        <div>
          <span>🧠 BRAIN GUESS</span>
          <p>What are you worried might happen?</p>
        </div>
        <div>
          <span>🛡️ SAFE MOVE</span>
          <p>Get space, use words, or call your grown-up.</p>
        </div>
      </div>
      <button
        className="primary-button"
        onClick={() => {
          speak(
            "No-cap facts. What did your eyes see? Brain guess. What are you worried might happen? Safe move. Get space, use words, or call your grown-up.",
          );
          onComplete();
        }}
        type="button"
      >
        🔊 Hear the fact check
      </button>
    </div>
  );
}

const DETECTIVE_CARDS = [
  {
    text: "The grown-up walked into the kitchen.",
    answer: "fact",
    why: "That is something eyes could see.",
  },
  {
    text: "They are leaving forever.",
    answer: "guess",
    why: "That is the Alarm Monster predicting the future.",
  },
  {
    text: "My friend said, “I want a turn.”",
    answer: "fact",
    why: "That is something ears could hear.",
  },
  {
    text: "Nobody will ever play with me.",
    answer: "guess",
    why: "That is a giant brain guess—not a forever fact.",
  },
] as const;

function SusOrFactsGame({ onComplete }: { onComplete: () => void }) {
  const [card, setCard] = useState(0);
  const [choice, setChoice] = useState<"fact" | "guess" | null>(null);
  const current = DETECTIVE_CARDS[card];
  const correct = choice === current.answer;

  const next = () => {
    if (card === DETECTIVE_CARDS.length - 1) {
      onComplete();
      setCard(0);
    } else {
      setCard((value) => value + 1);
    }
    setChoice(null);
  };

  return (
    <div className="detective-game">
      <div className="detective-progress" aria-label={`Card ${card + 1} of 4`}>
        {DETECTIVE_CARDS.map((item, index) => (
          <span className={index <= card ? "seen" : ""} key={item.text} />
        ))}
      </div>
      <span className="activity-kicker">DETECTIVE CARD {card + 1}</span>
      <h3>“{current.text}”</h3>
      <p>Is it something we can see or hear—or a brain guess?</p>
      <div className="sort-buttons">
        <button
          aria-pressed={choice === "fact"}
          onClick={() => setChoice("fact")}
          type="button"
        >
          👀 No-cap fact
        </button>
        <button
          aria-pressed={choice === "guess"}
          onClick={() => setChoice("guess")}
          type="button"
        >
          🧠 Brain guess
        </button>
      </div>
      {choice && (
        <div
          className={correct ? "detective-feedback correct" : "detective-feedback"}
          role="status"
        >
          <strong>{correct ? "Detective check! " : "Good try—look again. "}</strong>
          {correct ? current.why : "Can eyes see it or ears hear it?"}
        </div>
      )}
      {correct && (
        <button className="primary-button" onClick={next} type="button">
          {card === DETECTIVE_CARDS.length - 1
            ? "Finish the case"
            : "Next detective card"}
        </button>
      )}
    </div>
  );
}

function AuraRecharge({ onComplete }: { onComplete: () => void }) {
  const needs = [
    ["💧", "Water"],
    ["🍓", "Snack"],
    ["😴", "Sleep or rest"],
    ["🕺", "Movement"],
    ["🧸", "Comfort"],
    ["💊", "Medicine with my grown-up"],
    ["🤝", "Connection"],
  ];
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (need: string) => {
    setSelected((current) =>
      current.includes(need)
        ? current.filter((item) => item !== need)
        : [...current, need],
    );
  };

  return (
    <div className="aura-recharge">
      <div className={selected.length ? "aura-core restored" : "aura-core"}>
        <span aria-hidden="true">✨</span>
        <strong>{selected.length ? "AURA RESTORED" : "BODY CHECK"}</strong>
      </div>
      <p>What might help your body feel safer or steadier right now?</p>
      <div className="need-grid">
        {needs.map(([emoji, need]) => (
          <button
            aria-pressed={selected.includes(need)}
            key={need}
            onClick={() => toggle(need)}
            type="button"
          >
            <span aria-hidden="true">{emoji}</span>
            {need}
          </button>
        ))}
      </div>
      <button
        className="primary-button"
        disabled={!selected.length}
        onClick={onComplete}
        type="button"
      >
        Ask my grown-up for this
      </button>
      <small>No score. No streak. Noticing a need is the win.</small>
    </div>
  );
}

function RepairQuest({ onComplete }: { onComplete: () => void }) {
  const steps = [
    ["Tell the truth", "Say what happened with short, honest words."],
    ["Check for hurt", "Ask, “Is anyone or anything hurt?”"],
    ["Help fix it", "Clean, replace, try again, or get grown-up help."],
    ["Reconnect", "When everyone is ready, return to safe ordinary play."],
  ];
  const [done, setDone] = useState<number[]>([]);

  const toggle = (index: number) => {
    setDone((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  return (
    <div className="repair-quest">
      <div className="repair-banner">
        <span aria-hidden="true">🧰</span>
        <div>
          <strong>Mistake ≠ bad kid</strong>
          <small>Truth and repair help trust regrow.</small>
        </div>
      </div>
      <div className="repair-steps">
        {steps.map(([title, detail], index) => (
          <button
            aria-pressed={done.includes(index)}
            key={title}
            onClick={() => toggle(index)}
            type="button"
          >
            <span>{done.includes(index) ? "✓" : index + 1}</span>
            <div>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
          </button>
        ))}
      </div>
      <button
        className="primary-button"
        disabled={done.length !== steps.length}
        onClick={onComplete}
        type="button"
      >
        Big W repair complete
      </button>
    </div>
  );
}

function BrainrotBossBattle({ onComplete }: { onComplete: () => void }) {
  const rap =
    "Skibidi slime in a capybara hat. Breathe in soft, breathe out like splat. Brain says chaos, but facts say wait. Call your grown-up—co-regulate!";
  const [started, setStarted] = useState(false);

  return (
    <div className="boss-battle">
      <div className={started ? "dj-slime dancing" : "dj-slime"}>
        <span aria-hidden="true">🎧</span>
        <strong>DJ SLIME</strong>
        <div className="beat-bars" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="rap-card">
        “Skibidi slime in a capybara hat.
        <br />
        Breathe in soft, breathe out like splat.
        <br />
        Brain says chaos, but facts say wait.
        <br />
        Call your grown-up—co-regulate!”
      </div>
      <p>Feet on the floor. Easy breath in. Sloooower breath out.</p>
      <button
        className="primary-button"
        onClick={() => {
          setStarted(true);
          speak(rap);
          onComplete();
        }}
        type="button"
      >
        🔊 Drop the original slime beat
      </button>
      <small>Original character and rap—no influencer imitation.</small>
    </div>
  );
}

function ChaosChillChallenge({ onComplete }: { onComplete: () => void }) {
  const states = [
    ["🌪️", "Chaos", "Fast, hot, loud, wiggly"],
    ["🧊", "Freeze", "Still, far away, hard to talk"],
    ["🌧️", "Low", "Heavy, slow, teary, tired"],
    ["🌤️", "Ready", "Steady enough to look and choose"],
  ];
  const [bodyState, setBodyState] = useState("Chaos");

  return (
    <div className="body-weather">
      <p>Which body weather is closest? There is no bad answer.</p>
      <div className="weather-grid">
        {states.map(([emoji, name, clues]) => (
          <button
            aria-pressed={bodyState === name}
            key={name}
            onClick={() => setBodyState(name)}
            type="button"
          >
            <span aria-hidden="true">{emoji}</span>
            <strong>{name} mode</strong>
            <small>{clues}</small>
          </button>
        ))}
      </div>
      <div className="weather-result" role="status">
        <strong>My body is in {bodyState.toLowerCase()} mode.</strong>
        <span>I am not bad. My body is communicating.</span>
      </div>
      <button className="primary-button" onClick={onComplete} type="button">
        Pick a co-op chill move
      </button>
    </div>
  );
}

function SigmaBothChallenge({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="sigma-both">
      <div>
        <span>TRUTH 1</span>
        <strong>I’m super mad.</strong>
      </div>
      <span className="both-plus">AND</span>
      <div>
        <span>TRUTH 2</span>
        <strong>I can use safe hands.</strong>
      </div>
      <p>Big feelings are allowed. Unsafe actions still need a limit.</p>
      <button
        className="primary-button"
        onClick={() => {
          speak("I am super mad, and I can use safe hands.");
          onComplete();
        }}
        type="button"
      >
        🔊 Practice both truths
      </button>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [emotionId, setEmotionId] = useState("angry");
  const [powerUpId, setPowerUpId] = useState<PowerUpId | null>(null);
  const [auraRestored, setAuraRestored] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [glossaryQuery, setGlossaryQuery] = useState("");
  const [glossaryEmotionId, setGlossaryEmotionId] = useState("shame");
  const [openWorld, setOpenWorld] = useState("notice");
  const [heroFeeling, setHeroFeeling] = useState("hurt");
  const [heroAsk, setHeroAsk] = useState("please help me join");
  const [vibePack, setVibePack] = useState<VibePackId>("genAlpha");
  const [arcadeSkillId, setArcadeSkillId] =
    useState<ArcadeSkillId>("sixSeven");

  const emotion =
    EMOTIONS.find((item) => item.id === emotionId) ?? EMOTIONS[0];
  const glossaryEmotion =
    EMOTIONS.find((item) => item.id === glossaryEmotionId) ?? EMOTIONS[0];
  const powerUp = powerUpId ? POWER_UPS[powerUpId] : null;
  const visibleEmotions = useMemo(() => {
    const query = glossaryQuery.trim().toLowerCase();
    if (!query) return EMOTIONS;
    return EMOTIONS.filter((item) =>
      `${item.name} ${item.alias} ${item.message}`.toLowerCase().includes(query),
    );
  }, [glossaryQuery]);
  const arcadeSkill =
    ARCADE_SKILLS.find((item) => item.id === arcadeSkillId) ?? ARCADE_SKILLS[0];
  const activeVibePack = VIBE_PACKS[vibePack];

  useEffect(() => {
    const saved = window.localStorage.getItem("power-up-pals-vibe-pack");
    if (saved === "genAlpha" || saved === "creature" || saved === "straightUp") {
      setVibePack(saved);
    }
  }, []);

  const go = (tab: Tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectEmotion = (id: string, goToMachine = false) => {
    setEmotionId(id);
    setPowerUpId(null);
    if (goToMachine) go("machine");
  };

  const choosePowerUp = (id: PowerUpId) => {
    setPowerUpId(id);
    setAuraRestored(true);
    setCelebrate(false);
    window.setTimeout(() => setCelebrate(true), 20);
    window.setTimeout(() => setCelebrate(false), 1300);
  };

  const restoreAura = useCallback(() => {
    setAuraRestored(true);
  }, []);

  const chooseVibePack = (id: VibePackId) => {
    setVibePack(id);
    window.localStorage.setItem("power-up-pals-vibe-pack", id);
  };

  const downloadVibePack = () => {
    const content = [
      `${activeVibePack.name} — Power-Up Pals`,
      activeVibePack.note,
      "",
      ...ARCADE_SKILLS.map(
        (skill) =>
          `${activeVibePack.labels[skill.id]}\n${skill.stable}\nDBT: ${skill.dbt}`,
      ),
      "",
      "Slang is optional. The stable skill subtitle always stays.",
    ].join("\n\n");
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activeVibePack.name.toLowerCase().replaceAll(" ", "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const cycle = [
    {
      icon: "🔋",
      title: "Vulnerability fuel",
      kid: "What made the level harder?",
      value: emotion.vulnerability,
    },
    {
      icon: "🎬",
      title: "What happened",
      kid: "No-cap event",
      value: emotion.event,
    },
    {
      icon: "🧠",
      title: "Brain story",
      kid: "Fact, guess, or both?",
      value: emotion.thought,
    },
    {
      icon: "💓",
      title: "Body alarm",
      kid: "What did the body do?",
      value: emotion.body,
    },
    {
      icon: emotion.emoji,
      title: emotion.name,
      kid: emotion.alias,
      value: emotion.message,
      emotion: true,
    },
    {
      icon: "🏃",
      title: "Action urge",
      kid: "What move showed up?",
      value: emotion.urge,
    },
    {
      icon: powerUp ? powerUp.emoji : "🚪",
      title: "Choice Gate",
      kid: powerUp ? powerUp.label : "Pick a DBT power-up",
      value: powerUp
        ? powerUp.dbt
        : "You do not choose the first feeling. You can practice the next move.",
      choice: true,
    },
    {
      icon: "📣",
      title: "Action + signal",
      kid: "What others see",
      value: powerUp ? powerUp.action : emotion.reaction,
      changed: Boolean(powerUp),
    },
    {
      icon: "🧩",
      title: "Impact + aftereffects",
      kid: "What happens next",
      value: powerUp
        ? `${powerUp.impact} ${powerUp.after}`
        : `${emotion.impact}. ${emotion.after}.`,
      changed: Boolean(powerUp),
    },
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go("home")} type="button">
          <span className="brand-mark" aria-hidden="true">
            ✦
          </span>
          <span>
            <strong>Power-Up Pals:</strong>
            <small>Build Your Chill World</small>
          </span>
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {NAV.map((item) => (
            <button
              className={activeTab === item.id ? "nav-item active" : "nav-item"}
              key={item.id}
              onClick={() => go(item.id)}
              type="button"
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div
          className={auraRestored ? "aura-chip restored" : "aura-chip"}
          aria-label={
            auraRestored
              ? "Aura restored after practicing a skill"
              : "Aura ready to recharge"
          }
        >
          <span aria-hidden="true">✨</span>
          <span>
            <strong>{auraRestored ? "RESTORED" : "READY"}</strong>
            <small>Aura status</small>
          </span>
        </div>
      </header>

      <main>
        {activeTab === "home" && (
          <div className="page home-page">
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow">
                  <span>NEW QUEST</span>
                  Real DBT skills. Kid-world language.
                </div>
                <h1 aria-label="Power-Up Pals: Build Your Chill World">
                  <span className="hero-product-name">Power-Up Pals:</span>
                  Build Your
                  <br />
                  <span className="hero-title-highlight">Chill World.</span>
                </h1>
                <p>
                  <strong>Big feelings. Mega skills.</strong>{" "}
                  Pick a feeling, run it through the Emotion Machine, and choose
                  a power-up that changes the ending.
                </p>
                <div className="hero-actions">
                  <button
                    className="primary-button jumbo"
                    onClick={() => go("machine")}
                    type="button"
                  >
                    Enter Emotion Machine <span aria-hidden="true">⚙️</span>
                  </button>
                  <button
                    className="secondary-button jumbo"
                    onClick={() => go("arcade")}
                    type="button"
                  >
                    Play in the Vibe Arcade
                  </button>
                </div>
                <div className="trust-line">
                  <span>🦫 Capy chill</span>
                  <span>🫧 Slime-powered</span>
                  <span>🤝 Grown-up co-op</span>
                </div>
              </div>
              <div className="hero-art">
                <img
                  alt="Original capybara, axolotl, unicorn, and slime characters exploring a colorful emotion machine world"
                  src="/assets/power-up-pals-world.png"
                />
                <div className="floating-sticker sticker-one">6–7 RESET!</div>
                <div className="floating-sticker sticker-two">
                  SIGMA SKILL ✦
                </div>
              </div>
            </section>

            <section className="quick-pick" aria-labelledby="quick-pick-title">
              <div className="section-heading inline-heading">
                <div>
                  <span className="kicker">QUICK START</span>
                  <h2 id="quick-pick-title">What’s the vibe right now?</h2>
                </div>
                <button
                  className="text-button"
                  onClick={() => go("glossary")}
                  type="button"
                >
                  See every feeling →
                </button>
              </div>
              <div className="quick-emotions">
                {EMOTIONS.slice(0, 8).map((item) => (
                  <button
                    className="quick-emotion"
                    data-color={item.color}
                    key={item.id}
                    onClick={() => selectEmotion(item.id, true)}
                    type="button"
                  >
                    <span aria-hidden="true">{item.emoji}</span>
                    <strong>{item.name}</strong>
                    <small>{item.alias}</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="feature-strip" aria-label="How the app works">
              <article>
                <span className="feature-number">1</span>
                <div>
                  <strong>Name the feeling</strong>
                  <p>Real emotion word + a memorable Gen Alpha nickname.</p>
                </div>
              </article>
              <article>
                <span className="feature-number">2</span>
                <div>
                  <strong>Run the cycle</strong>
                  <p>See body, thoughts, urges, actions, and impact.</p>
                </div>
              </article>
              <article>
                <span className="feature-number">3</span>
                <div>
                  <strong>Choose a power-up</strong>
                  <p>Practice one DBT skill and change the ending.</p>
                </div>
              </article>
            </section>

            <section className="grownup-banner">
              <div className="grownup-avatar" aria-hidden="true">
                🤝
              </div>
              <div>
                <span className="kicker">CO-OP, NOT SOLO</span>
                <h2>Giant feelings need a safe grown-up.</h2>
                <p>
                  Practice while calm. During a meltdown, connect first and use
                  the app together—never as a punishment.
                </p>
              </div>
              <button
                className="secondary-button"
                onClick={() => go("grownup")}
                type="button"
              >
                Open grown-up zone
              </button>
            </section>
          </div>
        )}

        {activeTab === "machine" && (
          <div className="page machine-page">
            <section className="page-intro">
              <div>
                <span className="kicker">THE MAIN QUEST</span>
                <h1>Emotion Cycle Machine</h1>
                <p>
                  Feelings send messages. Urges suggest moves. The Choice Gate
                  is where a new ending can begin.
                </p>
              </div>
              <div className="character-bubble">
                <span aria-hidden="true">🦫</span>
                <p>
                  <strong>Cappy says:</strong> “No feeling is an L. Let’s see
                  what it’s trying to tell us.”
                </p>
              </div>
            </section>

            <section className="machine-panel">
              <div className="machine-picker">
                <div className="section-heading">
                  <span className="step-chip">STEP 1</span>
                  <h2>Pick an emotion</h2>
                </div>
                <div className="emotion-picker" aria-label="Choose an emotion">
                  {EMOTIONS.map((item) => (
                    <button
                      aria-pressed={emotion.id === item.id}
                      className={
                        emotion.id === item.id
                          ? "emotion-pick selected"
                          : "emotion-pick"
                      }
                      data-color={item.color}
                      key={item.id}
                      onClick={() => selectEmotion(item.id)}
                      type="button"
                    >
                      <span aria-hidden="true">{item.emoji}</span>
                      <strong>{item.name}</strong>
                      <small>{item.alias}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className="emotion-readout" data-color={emotion.color}>
                <div className="emotion-hero-icon" aria-hidden="true">
                  {emotion.emoji}
                </div>
                <div className="emotion-title-block">
                  <span>EMOTION SELECTED</span>
                  <h2>{emotion.name}</h2>
                  <p>{emotion.alias}</p>
                </div>
                <button
                  aria-label={`Hear the description for ${emotion.name}`}
                  className="listen-button"
                  onClick={() =>
                    speak(
                      `${emotion.name}. ${emotion.alias}. ${emotion.message} You might notice ${emotion.body}. You may need ${emotion.need}.`,
                    )
                  }
                  type="button"
                >
                  🔊 Hear it
                </button>
                <div className="message-grid">
                  <article>
                    <span>MESSAGE TO ME</span>
                    <p>{emotion.message}</p>
                  </article>
                  <article>
                    <span>MESSAGE OTHERS MAY SEE</span>
                    <p>{emotion.signal}</p>
                  </article>
                  <article>
                    <span>WHAT I MIGHT NEED</span>
                    <p>{emotion.need}</p>
                  </article>
                </div>
              </div>
            </section>

            <section className="cycle-section">
              <div className="section-heading">
                <span className="step-chip">STEP 2</span>
                <h2>Watch the cycle load</h2>
                <p>
                  Tap a power-up below to change the last part of the cycle.
                </p>
              </div>
              <div className="cycle-grid" aria-label={`${emotion.name} cycle`}>
                {cycle.map((item, index) => (
                  <article
                    className={[
                      "cycle-card",
                      item.emotion ? "emotion-node" : "",
                      item.choice ? "choice-node" : "",
                      item.changed ? "changed-node" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={`${emotion.id}-${item.title}-${powerUpId ?? "react"}`}
                  >
                    <div className="cycle-topline">
                      <span className="cycle-index">{index + 1}</span>
                      <span className="cycle-icon" aria-hidden="true">
                        {item.icon}
                      </span>
                    </div>
                    <span className="cycle-kid-label">{item.kid}</span>
                    <h3>{item.title}</h3>
                    <p>{item.value}</p>
                    {index < cycle.length - 1 && (
                      <span className="cycle-arrow" aria-hidden="true">
                        →
                      </span>
                    )}
                  </article>
                ))}
              </div>
              <div className="reload-line">
                <span aria-hidden="true">↺</span>
                The aftereffects can become fuel for the next cycle.
              </div>
            </section>

            <section className="powerup-section">
              <div className="section-heading">
                <span className="step-chip">STEP 3</span>
                <h2>Choose a power-up</h2>
                <p>Try different skills. There is more than one skillful move.</p>
              </div>
              <div className="powerup-grid">
                {emotion.recommended.map((id) => {
                  const item = POWER_UPS[id];
                  return (
                    <button
                      aria-pressed={powerUpId === id}
                      className={
                        powerUpId === id
                          ? "powerup-card selected"
                          : "powerup-card"
                      }
                      key={id}
                      onClick={() => choosePowerUp(id)}
                      type="button"
                    >
                      <span className="powerup-icon" aria-hidden="true">
                        {item.emoji}
                      </span>
                      <span>
                        <small>DBT: {item.dbt}</small>
                        <strong>{item.label}</strong>
                        <p>{item.action}</p>
                      </span>
                    </button>
                  );
                })}
              </div>
              {powerUp && (
                <div className="win-panel" aria-live="polite">
                  <span className="win-icon" aria-hidden="true">
                    ✨
                  </span>
                  <div>
                    <span>AURA GLOW EARNED</span>
                    <h3>{powerUp.cheer}</h3>
                    <p>
                      Replay the machine with another skill to compare the
                      ending.
                    </p>
                  </div>
                  <button
                    className="secondary-button"
                    onClick={() => setPowerUpId(null)}
                    type="button"
                  >
                    See first reaction
                  </button>
                </div>
              )}
              {celebrate && (
                <div className="confetti" aria-hidden="true">
                  {Array.from({ length: 18 }).map((_, index) => (
                    <i key={index} style={{ "--i": index } as React.CSSProperties} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "glossary" && (
          <div className="page glossary-page">
            <section className="page-intro">
              <div>
                <span className="kicker">FEELING DEX</span>
                <h1>Emotion Glossary</h1>
                <p>
                  Learn the real emotion name, the kid-world nickname, its body
                  clues, its message, and what might help.
                </p>
              </div>
              <label className="search-box">
                <span aria-hidden="true">🔎</span>
                <span className="sr-only">Search emotions</span>
                <input
                  onChange={(event) => setGlossaryQuery(event.target.value)}
                  placeholder="Search a feeling or clue"
                  type="search"
                  value={glossaryQuery}
                />
              </label>
            </section>

            <section className="glossary-layout">
              <div className="glossary-grid">
                {visibleEmotions.map((item) => (
                  <button
                    aria-pressed={glossaryEmotion.id === item.id}
                    className={
                      glossaryEmotion.id === item.id
                        ? "glossary-card selected"
                        : "glossary-card"
                    }
                    data-color={item.color}
                    key={item.id}
                    onClick={() => setGlossaryEmotionId(item.id)}
                    type="button"
                  >
                    <span className="glossary-emoji" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.alias}</small>
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
              <aside
                className="glossary-detail"
                data-color={glossaryEmotion.color}
              >
                <div className="glossary-detail-head">
                  <span className="detail-emoji" aria-hidden="true">
                    {glossaryEmotion.emoji}
                  </span>
                  <div>
                    <span>REAL EMOTION WORD</span>
                    <h2>{glossaryEmotion.name}</h2>
                    <p>{glossaryEmotion.alias}</p>
                  </div>
                  <button
                    aria-label={`Hear ${glossaryEmotion.name}`}
                    className="listen-button"
                    onClick={() =>
                      speak(
                        `${glossaryEmotion.name}. ${glossaryEmotion.alias}. ${glossaryEmotion.message} Your body might have ${glossaryEmotion.body}. You may need ${glossaryEmotion.need}.`,
                      )
                    }
                    type="button"
                  >
                    🔊 Hear
                  </button>
                </div>
                <div className="detail-block">
                  <span>WHAT IT TELLS ME</span>
                  <p>{glossaryEmotion.message}</p>
                </div>
                <div className="detail-block">
                  <span>BODY CLUES</span>
                  <p>{glossaryEmotion.body}</p>
                </div>
                <div className="detail-block">
                  <span>WHAT OTHERS MAY NOTICE</span>
                  <p>{glossaryEmotion.signal}</p>
                </div>
                <div className="detail-block">
                  <span>WHAT MIGHT HELP</span>
                  <p>{glossaryEmotion.need}</p>
                </div>
                {glossaryEmotion.id === "shame" && (
                  <div className="shame-truth">
                    <span aria-hidden="true">🛡️</span>
                    <p>
                      <strong>Shame brain trick:</strong> “I am bad.”
                      <br />
                      <strong>Both-Mode truth:</strong> “I may need to repair
                      something AND I am still worthy of love and help.”
                    </p>
                  </div>
                )}
                <button
                  className="primary-button full-button"
                  onClick={() => {
                    selectEmotion(glossaryEmotion.id);
                    go("machine");
                  }}
                  type="button"
                >
                  Put {glossaryEmotion.name} in the machine
                </button>
              </aside>
            </section>
          </div>
        )}

        {activeTab === "worlds" && (
          <div className="page worlds-page">
            <section className="page-intro">
              <div>
                <span className="kicker">DBT WORLD MAP</span>
                <h1>Five worlds. Mega skills.</h1>
                <p>
                  Each world uses a real DBT module with kid-sized language,
                  movement, play, and co-op practice.
                </p>
              </div>
              <div className="character-bubble">
                <span aria-hidden="true">🫧</span>
                <p>
                  <strong>DJ Slime says:</strong> “Skills work best when you
                  practice before chaos mode.”
                </p>
              </div>
            </section>

            <section className="world-map">
              <div className="world-tabs" role="tablist" aria-label="DBT worlds">
                {WORLDS.map((world) => (
                  <button
                    aria-selected={openWorld === world.id}
                    className={
                      openWorld === world.id
                        ? "world-tab selected"
                        : "world-tab"
                    }
                    key={world.id}
                    onClick={() => setOpenWorld(world.id)}
                    role="tab"
                    type="button"
                  >
                    <span aria-hidden="true">{world.emoji}</span>
                    <span>
                      <strong>{world.title}</strong>
                      <small>{world.dbt}</small>
                    </span>
                  </button>
                ))}
              </div>

              {WORLDS.map(
                (world) =>
                  openWorld === world.id && (
                    <div
                      className={`world-detail world-${world.id}`}
                      key={world.id}
                      role="tabpanel"
                    >
                      <div className="world-detail-copy">
                        <span className="world-mascot" aria-hidden="true">
                          {world.emoji}
                        </span>
                        <span className="kicker">REAL DBT: {world.dbt}</span>
                        <h2>{world.title}</h2>
                        <p>{world.blurb}</p>
                        <div className="skill-chips">
                          {world.skills.map((skill) => (
                            <span key={skill}>✦ {skill}</span>
                          ))}
                        </div>
                      </div>
                      <div className="world-challenge">
                        <span className="step-chip">TRY THE CHALLENGE</span>
                        <h3>{world.challenge}</h3>
                        {world.id === "notice" && <SixSevenReset />}
                        {world.id === "slime" && <SlimeBreathing />}
                        {world.id === "lab" && (
                          <div className="mini-challenge">
                            <div className="mini-machine" aria-hidden="true">
                              <span>🧠</span>
                              <span>💓</span>
                              <span>🚪</span>
                            </div>
                            <p>
                              Pick a feeling and watch thoughts, body clues,
                              urges, and choices connect.
                            </p>
                            <button
                              className="primary-button"
                              onClick={() => go("machine")}
                              type="button"
                            >
                              Enter Emotion Machine
                            </button>
                          </div>
                        )}
                        {world.id === "squad" && (
                          <div className="phrase-builder">
                            <label>
                              Feeling
                              <select
                                onChange={(event) =>
                                  setHeroFeeling(event.target.value)
                                }
                                value={heroFeeling}
                              >
                                <option value="hurt">hurt</option>
                                <option value="angry">angry</option>
                                <option value="scared">scared</option>
                                <option value="left out">left out</option>
                                <option value="frustrated">frustrated</option>
                              </select>
                            </label>
                            <label>
                              Clear ask
                              <select
                                onChange={(event) =>
                                  setHeroAsk(event.target.value)
                                }
                                value={heroAsk}
                              >
                                <option value="please help me join">
                                  please help me join
                                </option>
                                <option value="please give me space">
                                  please give me space
                                </option>
                                <option value="please stay with me">
                                  please stay with me
                                </option>
                                <option value="can I have a turn next">
                                  can I have a turn next
                                </option>
                              </select>
                            </label>
                            <div className="speech-output">
                              “I feel <strong>{heroFeeling}</strong>.{" "}
                              <strong>{heroAsk}</strong>.”
                            </div>
                            <button
                              className="primary-button"
                              onClick={() =>
                                speak(
                                  `I feel ${heroFeeling}. ${heroAsk}, please.`,
                                )
                              }
                              type="button"
                            >
                              🔊 Practice my hero ask
                            </button>
                          </div>
                        )}
                        {world.id === "both" && (
                          <div className="both-challenge">
                            <div>
                              <span>TRUTH 1</span>
                              <strong>I am super mad.</strong>
                            </div>
                            <span className="both-and">AND</span>
                            <div>
                              <span>TRUTH 2</span>
                              <strong>I can keep my hands safe.</strong>
                            </div>
                            <button
                              className="primary-button"
                              onClick={() =>
                                speak(
                                  "I am super mad, and I can keep my hands safe.",
                                )
                              }
                              type="button"
                            >
                              🔊 Say both truths
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ),
              )}
            </section>
          </div>
        )}

        {activeTab === "arcade" && (
          <div className="page arcade-page">
            <section className="page-intro arcade-intro">
              <div>
                <span className="kicker">FUN WORDS • REAL SKILLS</span>
                <h1>Vibe Arcade</h1>
                <p>
                  Slang is the fun seasoning. Every game keeps its stable skill
                  subtitle, so the coping tool still makes sense when the meme
                  changes.
                </p>
              </div>
              <div className="character-bubble">
                <span aria-hidden="true">🦎</span>
                <p>
                  <strong>Axel says:</strong> “We joke with the skill—never with
                  the feeling or the kid.”
                </p>
              </div>
            </section>

            <section className="vibe-pack-lab" aria-labelledby="vibe-pack-title">
              <div className="vibe-pack-copy">
                <span className="kicker">SWAP THE WORDS, KEEP THE TOOL</span>
                <h2 id="vibe-pack-title">Choose a Vibe Pack</h2>
                <p>
                  Pick the language that lands today. Your choice stays on this
                  device, and the real DBT skill always appears underneath.
                </p>
                <button
                  className="secondary-button"
                  onClick={downloadVibePack}
                  type="button"
                >
                  ↓ Download this Vibe Pack
                </button>
              </div>
              <div className="vibe-pack-options">
                {(Object.entries(VIBE_PACKS) as [VibePackId, (typeof VIBE_PACKS)[VibePackId]][]).map(
                  ([id, pack]) => (
                    <button
                      aria-pressed={vibePack === id}
                      className={vibePack === id ? "selected" : ""}
                      key={id}
                      onClick={() => chooseVibePack(id)}
                      type="button"
                    >
                      <span aria-hidden="true">{pack.emoji}</span>
                      <strong>{pack.name}</strong>
                      <small>{pack.note}</small>
                    </button>
                  ),
                )}
              </div>
            </section>

            <section className="arcade-shell">
              <div className="arcade-skill-menu" aria-label="Choose a skill game">
                {ARCADE_SKILLS.map((skill) => (
                  <button
                    aria-pressed={arcadeSkillId === skill.id}
                    className={
                      arcadeSkillId === skill.id ? "selected" : undefined
                    }
                    key={skill.id}
                    onClick={() => setArcadeSkillId(skill.id)}
                    type="button"
                  >
                    <span className="arcade-skill-emoji" aria-hidden="true">
                      {skill.emoji}
                    </span>
                    <span>
                      <strong>{activeVibePack.labels[skill.id]}</strong>
                      <small>{skill.stable}</small>
                    </span>
                  </button>
                ))}
              </div>

              <div className="arcade-activity">
                <header>
                  <div>
                    <span className="activity-dbt">REAL DBT: {arcadeSkill.dbt}</span>
                    <h2>{activeVibePack.labels[arcadeSkill.id]}</h2>
                    <p>{arcadeSkill.stable}</p>
                  </div>
                  <span className="activity-emoji" aria-hidden="true">
                    {arcadeSkill.emoji}
                  </span>
                </header>
                <p className="activity-blurb">{arcadeSkill.blurb}</p>
                <div className="activity-stage">
                  {arcadeSkill.id === "sixSeven" && (
                    <SixSevenReset onComplete={restoreAura} />
                  )}
                  {arcadeSkill.id === "sigmaStop" && (
                    <SigmaStopChallenge onComplete={restoreAura} />
                  )}
                  {arcadeSkill.id === "noCapFacts" && (
                    <NoCapFactsChallenge onComplete={restoreAura} />
                  )}
                  {arcadeSkill.id === "susOrFacts" && (
                    <SusOrFactsGame onComplete={restoreAura} />
                  )}
                  {arcadeSkill.id === "auraRecharge" && (
                    <AuraRecharge onComplete={restoreAura} />
                  )}
                  {arcadeSkill.id === "bigWRepair" && (
                    <RepairQuest onComplete={restoreAura} />
                  )}
                  {arcadeSkill.id === "brainrotBoss" && (
                    <BrainrotBossBattle onComplete={restoreAura} />
                  )}
                  {arcadeSkill.id === "chaosChill" && (
                    <ChaosChillChallenge onComplete={restoreAura} />
                  )}
                  {arcadeSkill.id === "sigmaBoth" && (
                    <SigmaBothChallenge onComplete={restoreAura} />
                  )}
                </div>
              </div>
            </section>

            <section className="slang-safety">
              <div className="slang-safety-icon" aria-hidden="true">
                🧂
              </div>
              <div>
                <span className="kicker">FUN SEASONING RULE</span>
                <h2>Slang invites. It never labels or minimizes.</h2>
                <p>
                  Say “your body is in chaos mode,” not “you are chaos.” If a
                  phrase stops feeling fun, swap the pack or use the stable
                  subtitle.
                </p>
              </div>
              <div className="slang-do-dont">
                <span>YES</span>
                <strong>“Your Alarm Monster is loud. I’m with you.”</strong>
                <span>NO</span>
                <strong>“You’re being sus. Calm down.”</strong>
              </div>
            </section>
          </div>
        )}

        {activeTab === "grownup" && (
          <div className="page grownup-page">
            <section className="page-intro">
              <div>
                <span className="kicker">GROWN-UP CO-OP</span>
                <h1>Connect first. Skill second.</h1>
                <p>
                  Children this young borrow regulation from safe adults. Use
                  short words, a steady body, and the same practiced cues.
                </p>
              </div>
              <div className="character-bubble">
                <span aria-hidden="true">🛡️</span>
                <p>
                  The app is a practice partner—not a diagnosis, therapist, or
                  replacement for trauma-informed care.
                </p>
              </div>
            </section>

            <section className="co-op-grid">
              <article className="coop-card connect">
                <span className="coop-number">1</span>
                <div>
                  <span className="kicker">CONNECT</span>
                  <h2>“Your body is having a giant alarm.”</h2>
                  <p>
                    “I’m here. You are not alone. We will solve it after your
                    body is ready.”
                  </p>
                  <button
                    className="listen-button"
                    onClick={() =>
                      speak(
                        "Your body is having a giant alarm. I am here. You are not alone. We will solve it after your body is ready.",
                      )
                    }
                    type="button"
                  >
                    🔊 Hear the script
                  </button>
                </div>
              </article>
              <article className="coop-card regulate">
                <span className="coop-number">2</span>
                <div>
                  <span className="kicker">CO-REGULATE</span>
                  <h2>Offer two safe choices.</h2>
                  <p>
                    “Slime-slow breaths with me, or quiet space with me?” Keep
                    yourself nearby unless safety requires something different.
                  </p>
                </div>
              </article>
              <article className="coop-card solve">
                <span className="coop-number">3</span>
                <div>
                  <span className="kicker">SOLVE + REPAIR</span>
                  <h2>Run the machine when calm.</h2>
                  <p>
                    Explore what happened without shame. Practice one new move,
                    repair harm, then reconnect through ordinary play.
                  </p>
                </div>
              </article>
            </section>

            <section className="shame-guide">
              <div className="shame-guide-icon" aria-hidden="true">
                🫥
              </div>
              <div>
                <span className="kicker">WHEN SHAME SHOWS UP</span>
                <h2>Correct behavior without threatening belonging.</h2>
                <p>
                  Shame often hides behind “I don’t care,” lying, silliness,
                  blame, rage, or running away. Hold the limit and the
                  relationship at the same time.
                </p>
              </div>
              <div className="shame-script">
                <span>TRY THIS</span>
                <p>
                  “What happened is not okay <strong>AND</strong> you are still
                  loved. I will help you tell the truth and repair it.”
                </p>
              </div>
            </section>

            <section className="grownup-rules">
              <div>
                <span className="rule-icon" aria-hidden="true">
                  ✅
                </span>
                <h3>Use it for practice and connection</h3>
                <ul>
                  <li>Practice skills while calm and playful.</li>
                  <li>Use the same short cue in real moments.</li>
                  <li>Notice effort, truth, repair, and asking for help.</li>
                  <li>Let the child control personal sharing.</li>
                </ul>
              </div>
              <div>
                <span className="rule-icon" aria-hidden="true">
                  🚫
                </span>
                <h3>Never use it as punishment or surveillance</h3>
                <ul>
                  <li>Do not say “Go calm down with your app.”</li>
                  <li>Do not remove earned items or use broken streaks.</li>
                  <li>Do not demand explanations during full alarm mode.</li>
                  <li>Do not treat a skill miss as defiance or failure.</li>
                </ul>
              </div>
            </section>

            <footer className="care-note">
              <strong>Prototype care note</strong>
              <p>
                This version teaches DBT-informed skills and caregiver
                co-regulation. Content for children ages 5–7 should be reviewed
                with a trauma-informed child clinician before clinical or
                commercial use.
              </p>
            </footer>
          </div>
        )}
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV.map((item) => (
          <button
            className={activeTab === item.id ? "active" : ""}
            key={item.id}
            onClick={() => go(item.id)}
            type="button"
          >
            <span aria-hidden="true">{item.emoji}</span>
            <small>
              {item.id === "machine"
                ? "Machine"
                : item.id === "glossary"
                  ? "Feelings"
                  : item.id === "arcade"
                    ? "Arcade"
                  : item.id === "grownup"
                    ? "Co-op"
                    : item.label}
            </small>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
