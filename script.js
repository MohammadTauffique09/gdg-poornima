/* ===== Easy edits live here ===== */
const CONFIG = {
  // Paste the community WhatsApp invite link here. The button stays hidden while this is empty.
  whatsappUrl: "",
  email: "dsc@poornima.edu.in"
};

const TRACKS = {
  web: {
    accent: "var(--blue)",
    title: "Web",
    body: "HTML, CSS and JavaScript from scratch, then modern tooling. You publish a real site on the first day.",
    list: ["A portfolio site that is yours alone", "A campus notice board", "A club event page with sign-ups"],
    file: "index.html",
    code: `<button id="hi">Say hi</button>
<script>
  document.getElementById("hi")
    .addEventListener("click", () => {
      alert("Hello, Poornima!");
    });
</script>`
  },
  ai: {
    accent: "var(--red)",
    title: "AI and ML",
    body: "Call Gemini from your own app, then learn how models are trained, tested and put to work on small datasets.",
    list: ["A study buddy that quizzes you from your notes", "A notes summariser for lecture photos", "A model that classifies campus photos"],
    file: "ask.js",
    code: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: KEY });
const res = await ai.models.generateContent({
  model: "gemini-flash-latest",
  contents: "Explain recursion in one line."
});
console.log(res.text);`
  },
  cloud: {
    accent: "var(--yellow)",
    title: "Cloud",
    body: "Store data, sign users in and host your app without managing servers. Firebase and Google Cloud, step by step.",
    list: ["A shared timetable that syncs live", "A lost-and-found board with photo uploads", "A sign-in system for event attendance"],
    file: "save.js",
    code: `import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore(app);
await addDoc(collection(db, "ideas"), {
  text: "Campus bus tracker",
  createdAt: Date.now()
});`
  },
  mobile: {
    accent: "var(--green)",
    title: "Mobile",
    body: "Build one app that runs on Android and iOS with Flutter. You see your changes on a phone within seconds.",
    list: ["A mess menu app for the hostel", "A habit tracker with reminders", "A pocket guide to the campus map"],
    file: "main.dart",
    code: `import 'package:flutter/material.dart';

void main() => runApp(
  const MaterialApp(
    home: Scaffold(
      body: Center(child: Text('Hello, Flutter')),
    ),
  ),
);`
  }
};

/* Add or change events here. "when" is free text so you can write "To be announced". */
const EVENTS = [
  { kind: "Workshop", color: "var(--blue)", title: "Build your first website", text: "From an empty folder to a live link in one session. No experience needed.", when: "Date to be announced" },
  { kind: "Workshop", color: "var(--red)", title: "Your first app with the Gemini API", text: "Send a prompt, show the answer, wrap it in a small interface.", when: "Date to be announced" },
  { kind: "Build", color: "var(--yellow)", title: "Build night", text: "Bring a project idea. Work in teams, get feedback from mentors, eat something.", when: "Date to be announced" },
  { kind: "Build", color: "var(--green)", title: "Flutter build night", text: "Make a working mobile app from a blank project, with mentors on hand.", when: "Date to be announced" },
  { kind: "Showcase", color: "var(--blue)", title: "Demo day", text: "Teams show what they built. Everyone votes, and every project goes on GitHub.", when: "End of semester" }
];

/* ===== Theme ===== */
const root = document.documentElement;
document.getElementById("themeToggle").addEventListener("click", () => {
  const dark = getComputedStyle(root).getPropertyValue("--bg").trim().toLowerCase() === "#0f141b";
  const next = dark ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("gdg-theme", next); } catch (e) {}
  paint.recolour();
});

/* ===== Mobile menu ===== */
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuToggle");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
menu.addEventListener("click", e => {
  if (e.target.tagName === "A") { menu.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }
});

/* ===== Tracks ===== */
const tabs = [...document.querySelectorAll(".tab")];
const panel = document.getElementById("panel");
function showTrack(key) {
  const t = TRACKS[key];
  tabs.forEach(b => {
    const on = b.dataset.track === key;
    b.setAttribute("aria-selected", String(on));
    b.tabIndex = on ? 0 : -1;
  });
  panel.style.setProperty("--accent", t.accent);
  panel.setAttribute("aria-labelledby", "tab-" + key);
  document.getElementById("panelTitle").textContent = t.title;
  document.getElementById("panelBody").textContent = t.body;
  document.getElementById("panelList").innerHTML = t.list.map(i => `<li>${i}</li>`).join("");
  document.getElementById("codeName").textContent = t.file;
  document.getElementById("codeBody").textContent = t.code;
  document.getElementById("copyBtn").textContent = "Copy";
}
tabs.forEach((b, i) => {
  b.addEventListener("click", () => showTrack(b.dataset.track));
  b.addEventListener("keydown", e => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    n.focus(); showTrack(n.dataset.track);
  });
});
document.getElementById("copyBtn").addEventListener("click", async e => {
  const btn = e.currentTarget;
  try { await navigator.clipboard.writeText(document.getElementById("codeBody").textContent); btn.textContent = "Copied"; }
  catch (err) { btn.textContent = "Select and copy"; }
});
showTrack("web");

/* ===== Events ===== */
const list = document.getElementById("eventList");
function renderEvents(filter) {
  const items = EVENTS.filter(e => filter === "all" || e.kind === filter);
  list.innerHTML = items.length
    ? items.map(e => `<li class="event" style="--c:${e.color}"><span class="event__kind">${e.kind}</span><h3>${e.title}</h3><p>${e.text}</p><span class="event__when">${e.when}</span></li>`).join("")
    : `<li class="events__empty">Nothing here yet. Check the WhatsApp group for new dates.</li>`;
}
document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
  document.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", String(x === c)));
  renderEvents(c.dataset.filter);
}));
renderEvents("all");

/* ===== Join links ===== */
const wa = document.getElementById("waBtn");
if (CONFIG.whatsappUrl) { wa.href = CONFIG.whatsappUrl; wa.target = "_blank"; wa.rel = "noopener"; wa.hidden = false; }
document.getElementById("mailBtn").href = "mailto:" + CONFIG.email;

/* ===== Pixel grid: spells GDG, then paints under the pointer ===== */
const paint = (() => {
  const canvas = document.getElementById("pixels");
  const ctx = canvas.getContext("2d");
  const G = ["01110","10001","10000","10111","10001","10001","01110"];
  const D = ["11110","10001","10001","10001","10001","10001","11110"];
  const word = [G, D, G];
  const COLS = 19, ROWS = 11;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cell = 30, dpr = 1, colors = [], line = "#ddd", fill = "#fff";
  const letters = [];            // {c, r, color, delay}
  const trail = new Map();       // "c,r" -> {t, color}
  let start = performance.now(), raf = 0, last = null;

  word.forEach((glyph, gi) => glyph.forEach((row, r) => [...row].forEach((v, c) => {
    if (v === "1") {
      const col = 1 + gi * 6 + c;
      letters.push({ c: col, r: r + 2, k: (col * 3 + r * 2) % 4, delay: col * 55 + r * 25 });
    }
  })));

  function recolour() {
    const s = getComputedStyle(document.documentElement);
    colors = ["--blue", "--red", "--yellow", "--green"].map(v => s.getPropertyValue(v).trim());
    line = s.getPropertyValue("--line").trim();
    fill = s.getPropertyValue("--surface").trim();
    draw(performance.now());
  }
  function resize() {
    const w = canvas.parentElement.clientWidth;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cell = w / COLS;
    canvas.style.height = cell * ROWS + "px";
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(cell * ROWS * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  }
  function square(c, r, color, scale, alpha) {
    const pad = cell * 0.09, s = (cell - pad * 2) * scale, off = (cell - s) / 2;
    ctx.globalAlpha = alpha; ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(c * cell + off, r * cell + off, s, s, cell * 0.14);
    ctx.fill(); ctx.globalAlpha = 1;
  }
  function draw(now) {
    const w = cell * COLS, h = cell * ROWS;
    ctx.fillStyle = fill; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = line;
    for (let c = 0; c <= COLS; c++) for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath(); ctx.arc(c * cell, r * cell, 1.4, 0, 6.283); ctx.fill();
    }
    const t = now - start; let busy = false;
    for (const L of letters) {
      const p = reduce ? 1 : Math.min(Math.max((t - L.delay) / 420, 0), 1);
      if (p < 1) busy = true;
      if (p > 0) square(L.c, L.r, colors[L.k], 1 - Math.pow(1 - p, 3), 1);
    }
    for (const [key, v] of trail) {
      const age = now - v.t, a = 1 - age / 1500;
      if (a <= 0) { trail.delete(key); continue; }
      const [c, r] = key.split(",").map(Number);
      square(c, r, v.color, 1, a * 0.9); busy = true;
    }
    return busy;
  }
  function loop(now) {
    raf = 0;
    if (draw(now)) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  function at(e) {
    const b = canvas.getBoundingClientRect();
    return [Math.floor((e.clientX - b.left) / cell), Math.floor((e.clientY - b.top) / cell)];
  }
  let n = 0;
  canvas.addEventListener("pointermove", e => {
    const [c, r] = at(e);
    if (c < 0 || r < 0 || c >= COLS || r >= ROWS) return;
    const key = c + "," + r;
    if (key === last) return;
    last = key;
    trail.set(key, { t: performance.now(), color: colors[n++ % 4] });
    kick();
  });
  canvas.addEventListener("pointerleave", () => { last = null; });
  canvas.addEventListener("click", () => { trail.clear(); start = performance.now() - 5000; draw(performance.now()); });

  new ResizeObserver(resize).observe(canvas.parentElement);
  recolour(); resize();
  if (!reduce) { start = performance.now(); kick(); }
  return { recolour };
})();
