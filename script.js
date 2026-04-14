const BREEDS = [
  {
    name: "Labrador Retriever",
    size: "large",
    energy: "high",
    shedding: "moderate",
    traits: ["friendly", "eager to please", "family", "smart"],
    summary:
      "A classic all-around companion. Labs love games, training, and being part of the action.",
    care: ["Daily exercise", "Food portions matter", "Training thrives with rewards"],
  },
  {
    name: "Golden Retriever",
    size: "large",
    energy: "high",
    shedding: "high",
    traits: ["gentle", "friendly", "family", "patient"],
    summary:
      "Affectionate and people-focused. Great for many households that can handle grooming and activity.",
    care: ["Brush regularly", "Enrichment games", "Consistent, kind training"],
  },
  {
    name: "German Shepherd",
    size: "large",
    energy: "high",
    shedding: "high",
    traits: ["loyal", "confident", "trainable", "protective"],
    summary:
      "Athletic and intelligent. Best with structured training, socialization, and a job to do.",
    care: ["Mental work daily", "Early socialization", "Exercise + training combo"],
  },
  {
    name: "Beagle",
    size: "medium",
    energy: "moderate",
    shedding: "moderate",
    traits: ["curious", "food-motivated", "scent hound", "playful"],
    summary:
      "A nose-first explorer. Beagles shine with sniff walks, games, and secure fencing.",
    care: ["Scent games", "Watch the snacks", "Recall takes practice"],
  },
  {
    name: "French Bulldog",
    size: "small",
    energy: "low",
    shedding: "low",
    traits: ["chill", "affectionate", "apartment-friendly", "funny"],
    summary:
      "A compact buddy that loves comfort and people time. Keep activity gentle and cool.",
    care: ["Avoid heat", "Short play bursts", "Gentle daily walks"],
  },
  {
    name: "Border Collie",
    size: "medium",
    energy: "high",
    shedding: "moderate",
    traits: ["super smart", "focused", "athletic", "work-driven"],
    summary:
      "One of the brightest. Needs real mental challenges—training, sports, and purposeful play.",
    care: ["Training sessions", "Advanced enrichment", "Planned exercise"],
  },
  {
    name: "Poodle",
    size: "medium",
    energy: "moderate",
    shedding: "low",
    traits: ["smart", "low shedding", "trainable", "social"],
    summary:
      "Elegant and clever with a coat that needs upkeep. A strong pick for training lovers.",
    care: ["Regular grooming", "Puzzle toys", "Positive reinforcement"],
  },
  {
    name: "Chihuahua",
    size: "small",
    energy: "moderate",
    shedding: "low",
    traits: ["bold", "loyal", "tiny", "big personality"],
    summary:
      "Small dog, huge character. Socialization helps confidence and reduces reactivity.",
    care: ["Gentle handling", "Warmth in cold weather", "Short training moments"],
  },
  {
    name: "Bernese Mountain Dog",
    size: "large",
    energy: "moderate",
    shedding: "high",
    traits: ["sweet", "calm", "family", "gentle giant"],
    summary:
      "A big, affectionate companion. Enjoys moderate activity and lots of family time.",
    care: ["Brush often", "Moderate walks", "Space + comfy rest"],
  },
];

const FACTS = [
  { tag: "Senses", text: "Dogs can hear higher-pitched sounds than humans and can detect quiet noises we miss." },
  { tag: "Communication", text: "A wagging tail doesn’t always mean “happy”—context matters (posture, ears, and tension)." },
  { tag: "Brains", text: "Many dogs learn best in short sessions with rewards and breaks (5–10 minutes can be plenty)." },
  { tag: "Noses", text: "Sniffing is mental enrichment for dogs—“sniff walks” can be just as tiring as running." },
  { tag: "Paws", text: "Dogs sweat mostly through their paw pads and cool off mainly by panting." },
  { tag: "Social", text: "Early, gentle socialization helps dogs feel safer in new places and around new people." },
  { tag: "Sleep", text: "Adult dogs often sleep 12–14 hours a day. Puppies and seniors may sleep even more." },
];

const $ = (sel) => document.querySelector(sel);

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function debounce(fn, wait = 120) {
  let t = null;
  return (...args) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
}

function titleCase(s) {
  return s
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function loadTheme() {
  const stored = window.localStorage.getItem("doggoden_theme");
  const theme = stored === "light" || stored === "dark" ? stored : "dark";
  document.documentElement.dataset.theme = theme;
  updateThemeButton(theme);
}

function updateThemeButton(theme) {
  const btn = $("#themeToggle");
  if (!btn) return;
  const isDark = theme !== "light";
  btn.setAttribute("aria-pressed", String(isDark));
  btn.querySelector(".chip-icon").textContent = isDark ? "🌙" : "☀️";
  btn.querySelector(".chip-text").textContent = isDark ? "Dark" : "Light";
}

function toggleTheme() {
  const curr = document.documentElement.dataset.theme || "dark";
  const next = curr === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  window.localStorage.setItem("doggoden_theme", next);
  updateThemeButton(next);
}

function scoreBreed(breed, q) {
  if (!q) return 0;
  const hay = [
    breed.name,
    breed.size,
    breed.energy,
    breed.shedding,
    breed.summary,
    ...breed.traits,
    ...breed.care,
  ]
    .join(" ")
    .toLowerCase();

  const qq = q.toLowerCase().trim();
  if (!qq) return 0;
  if (hay.includes(qq)) return 10;

  const parts = qq.split(/\s+/).filter(Boolean);
  let score = 0;
  for (const p of parts) {
    if (hay.includes(p)) score += 3;
  }
  return score;
}

function getFilters() {
  const q = ($("#breedSearch")?.value || "").trim();
  const size = $("#breedSize")?.value || "all";
  const energy = $("#breedEnergy")?.value || "all";
  return { q, size, energy };
}

function filterBreeds() {
  const { q, size, energy } = getFilters();
  const list = BREEDS.filter((b) => (size === "all" ? true : b.size === size))
    .filter((b) => (energy === "all" ? true : b.energy === energy))
    .map((b) => ({ breed: b, score: scoreBreed(b, q) }))
    .filter((x) => (q ? x.score > 0 : true))
    .sort((a, b) => (b.score - a.score) || a.breed.name.localeCompare(b.breed.name))
    .map((x) => x.breed);

  return list;
}

function badgeFor(breed) {
  const bits = [];
  bits.push(titleCase(breed.size));
  bits.push(`${titleCase(breed.energy)} energy`);
  return bits.join(" • ");
}

function chipText(label, value) {
  return `${label}: ${value}`;
}

function renderBreeds() {
  const grid = $("#breedGrid");
  const empty = $("#emptyState");
  if (!grid || !empty) return;

  const list = filterBreeds();
  grid.innerHTML = "";

  if (list.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  for (const b of list) {
    const card = document.createElement("article");
    card.className = "card";

    const head = document.createElement("div");
    head.className = "card-head";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = b.name;

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = badgeFor(b);

    head.append(title, badge);

    const body = document.createElement("div");
    body.className = "card-body";

    const chips = document.createElement("div");
    chips.className = "chips";

    const c1 = document.createElement("span");
    c1.className = "chip-mini";
    c1.textContent = chipText("Energy", titleCase(b.energy));

    const c2 = document.createElement("span");
    c2.className = "chip-mini";
    c2.textContent = chipText("Shedding", titleCase(b.shedding));

    const c3 = document.createElement("span");
    c3.className = "chip-mini";
    c3.textContent = b.traits.slice(0, 2).map(titleCase).join(" • ");

    chips.append(c1, c2, c3);

    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = b.summary;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const detailsBtn = document.createElement("button");
    detailsBtn.className = "btn btn-ghost";
    detailsBtn.type = "button";
    detailsBtn.textContent = "Details";
    detailsBtn.addEventListener("click", () => openBreedDialog(b));

    const traitBtn = document.createElement("button");
    traitBtn.className = "btn btn-ghost";
    traitBtn.type = "button";
    traitBtn.textContent = "Search traits";
    traitBtn.addEventListener("click", () => {
      const q = b.traits[0] || b.energy;
      const input = $("#breedSearch");
      if (input) input.value = q;
      renderBreeds();
      $("#breedSearch")?.focus();
    });

    actions.append(detailsBtn, traitBtn);

    body.append(chips, desc, actions);
    card.append(head, body);
    grid.append(card);
  }

  $("#statBreeds").textContent = String(BREEDS.length);
}

function openBreedDialog(breed) {
  const dialog = $("#breedDialog");
  const title = $("#dialogTitle");
  const body = $("#dialogBody");
  const kicker = $("#dialogKicker");
  if (!dialog || !title || !body || !kicker) return;

  title.textContent = breed.name;
  kicker.textContent = badgeFor(breed);

  const traitLine = breed.traits.map(titleCase).join(" • ");
  const careItems = breed.care.map((c) => `<li>${escapeHtml(c)}</li>`).join("");

  body.innerHTML = `
    <div class="pill">${escapeHtml(traitLine)}</div>
    <div>${escapeHtml(breed.summary)}</div>
    <div><strong>Care notes</strong></div>
    <ul>${careItems}</ul>
  `;

  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "true");
}

function closeBreedDialog() {
  const dialog = $("#breedDialog");
  if (!dialog) return;
  if (typeof dialog.close === "function") dialog.close();
  else dialog.removeAttribute("open");
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadChecklist() {
  const stored = window.localStorage.getItem("doggoden_checklist");
  let state = {};
  try {
    state = stored ? JSON.parse(stored) : {};
  } catch {
    state = {};
  }

  const checks = document.querySelectorAll('#checklist input[type="checkbox"][data-item]');
  for (const el of checks) {
    const key = el.getAttribute("data-item");
    el.checked = Boolean(state[key]);
  }
  updateChecklistProgress();
}

function saveChecklist() {
  const checks = document.querySelectorAll('#checklist input[type="checkbox"][data-item]');
  const state = {};
  for (const el of checks) {
    const key = el.getAttribute("data-item");
    state[key] = el.checked;
  }
  window.localStorage.setItem("doggoden_checklist", JSON.stringify(state));
}

function updateChecklistProgress() {
  const checks = [...document.querySelectorAll('#checklist input[type="checkbox"][data-item]')];
  const total = checks.length || 5;
  const done = checks.filter((c) => c.checked).length;

  const pct = Math.round((done / total) * 100);
  $("#progressLabel").textContent = `${pct}% complete`;
  $("#progressValue").textContent = `${done}/${total}`;

  const fill = $("#progressFill");
  if (fill) fill.style.width = `${clamp(pct, 0, 100)}%`;

  const bar = document.querySelector(".progress-bar");
  if (bar) {
    bar.setAttribute("aria-valuenow", String(done));
    bar.setAttribute("aria-valuetext", `${done} of ${total} complete`);
  }
}

function resetChecklist() {
  const checks = document.querySelectorAll('#checklist input[type="checkbox"][data-item]');
  for (const el of checks) el.checked = false;
  saveChecklist();
  updateChecklistProgress();
}

function pickFact(prevIndex) {
  if (FACTS.length === 0) return { index: -1, fact: null };
  if (FACTS.length === 1) return { index: 0, fact: FACTS[0] };
  let i = Math.floor(Math.random() * FACTS.length);
  if (i === prevIndex) i = (i + 1) % FACTS.length;
  return { index: i, fact: FACTS[i] };
}

let lastFactIndex = -1;

function showNewFact() {
  const { index, fact } = pickFact(lastFactIndex);
  if (!fact) return;
  lastFactIndex = index;
  $("#factText").textContent = fact.text;
  $("#factTag").textContent = fact.tag;
}

async function copyFact() {
  const text = $("#factText")?.textContent || "";
  if (!text.trim()) return;

  try {
    await navigator.clipboard.writeText(text);
    const btn = $("#copyFact");
    if (btn) {
      const old = btn.textContent;
      btn.textContent = "Copied";
      window.setTimeout(() => (btn.textContent = old), 900);
    }
  } catch {
    window.prompt("Copy this:", text);
  }
}

function clearFilters() {
  const search = $("#breedSearch");
  const size = $("#breedSize");
  const energy = $("#breedEnergy");
  if (search) search.value = "";
  if (size) size.value = "all";
  if (energy) energy.value = "all";
  renderBreeds();
  search?.focus();
}

function initFooter() {
  const el = $("#footerBuild");
  if (!el) return;
  const d = new Date();
  el.textContent = `Built locally • ${d.toLocaleDateString()}`;
}

function init() {
  loadTheme();
  renderBreeds();
  loadChecklist();
  showNewFact();
  initFooter();

  $("#themeToggle")?.addEventListener("click", toggleTheme);

  const reRender = debounce(renderBreeds, 120);
  $("#breedSearch")?.addEventListener("input", reRender);
  $("#breedSize")?.addEventListener("change", renderBreeds);
  $("#breedEnergy")?.addEventListener("change", renderBreeds);

  $("#clearFilters")?.addEventListener("click", clearFilters);

  document.querySelectorAll('#checklist input[type="checkbox"][data-item]').forEach((el) => {
    el.addEventListener("change", () => {
      saveChecklist();
      updateChecklistProgress();
    });
  });

  $("#resetChecklist")?.addEventListener("click", resetChecklist);

  $("#newFact")?.addEventListener("click", showNewFact);
  $("#copyFact")?.addEventListener("click", copyFact);

  $("#dialogClose")?.addEventListener("click", closeBreedDialog);
  $("#dialogClose2")?.addEventListener("click", closeBreedDialog);
  $("#breedDialog")?.addEventListener("click", (e) => {
    const dialog = $("#breedDialog");
    if (!dialog) return;
    if (e.target === dialog) closeBreedDialog();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeBreedDialog();
  });
}

document.addEventListener("DOMContentLoaded", init);

