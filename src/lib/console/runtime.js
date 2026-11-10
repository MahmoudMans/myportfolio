/* ══════════════════════════════════════════════════════════════════════
   CONSOLE RUNTIME
   Everything that moves on the site. The markup is rendered by React on the
   server; this file only adds behaviour to it.

   startChrome(): once per visit. Boot sequence, status strip, file-tree rail,
                  terminal, case report and screenshot dialogs, cursor, easter eggs.
   startPage():   on every page. Reveals, typed commands, hero, skills audit,
                  SOC wall, filters, career log, badges, contact form, case pages.
   Both return a cleanup function, so React can stop them cleanly.
   ══════════════════════════════════════════════════════════════════════ */
import { ICON_PATHS } from "./icons";

/* ───────────────────────── 0. HELPERS ───────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (a) => a[(Math.random() * a.length) | 0];
const nextFrame = () => new Promise((r) => requestAnimationFrame(r));
const pad = (n, l = 2) => String(n).padStart(l, "0");
const nowTime = (d = new Date()) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const nowStamp = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${nowTime(d)}`;
const hms = (ms) => {
  const s = Math.floor(ms / 1000);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
};
const prettyUrl = (u) => String(u).replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const icon = (name) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON_PATHS[name] || ICON_PATHS.shield}</svg>`;
const isInternal = (href) => typeof href === "string" && href.startsWith("/") && !href.startsWith("//") && !/\.pdf($|\?)/.test(href);

/* localStorage can be blocked (private windows, sandboxed previews), so every access is guarded */
const store = {
  get(k) {
    try {
      return localStorage.getItem("secfolio:" + k);
    } catch (e) {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem("secfolio:" + k, v);
    } catch (e) {
      /* storage blocked */
    }
  },
  del(k) {
    try {
      localStorage.removeItem("secfolio:" + k);
    } catch (e) {
      /* storage blocked */
    }
  },
};

/* One lifetime: every listener, timer, observer and loop started inside it stops on dispose() */
function scope() {
  const ac = new AbortController();
  const timers = new Set();
  const intervals = new Set();
  const observers = [];
  const cleanups = [];
  let alive = true;
  const sc = {
    signal: ac.signal,
    get alive() {
      return alive;
    },
    on(target, type, fn, opts) {
      if (target) target.addEventListener(type, fn, { ...(opts || {}), signal: ac.signal });
    },
    timeout(fn, ms) {
      const id = setTimeout(() => {
        timers.delete(id);
        if (alive) fn();
      }, ms);
      timers.add(id);
      return id;
    },
    interval(fn, ms) {
      const id = setInterval(() => {
        if (alive) fn();
      }, ms);
      intervals.add(id);
      return id;
    },
    observe(observer) {
      observers.push(observer);
      return observer;
    },
    defer(fn) {
      cleanups.push(fn);
    },
    sleep(ms) {
      return new Promise((resolve) => sc.timeout(resolve, ms));
    },
    dispose() {
      if (!alive) return;
      alive = false;
      ac.abort();
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
      observers.forEach((o) => o.disconnect());
      cleanups.splice(0).forEach((fn) => {
        try {
          fn();
        } catch (e) {
          /* already gone */
        }
      });
    },
  };
  return sc;
}

/* Shared state between the chrome (once per visit) and the current page */
const S = {
  data: null,
  navigate: (href) => {
    window.location.href = href;
  },
  reduced: false,
  finePointer: false,
  path: "/",
  lastPath: null,
  cwd: "~",
  activeSection: "",
  sectionListeners: new Set(),
  themeListeners: new Set(),
  C: { accent: "0 255 156", accent2: "255 176 32", alert: "255 59 92", mono: "monospace" },
  soc: { log() {}, recent: [] },
  booted: null,
  openCase: () => false,
  term: null,
  T0: Date.now(),
};
const root = () => document.documentElement;
const rgb = (v, a = 1) => `rgb(${v} / ${a})`;
const NAME = () => (S.data && S.data.name) || "Your Name";
const HANDLE = () => (S.data && S.data.handle) || "user";
const caseNo = (i) => "#" + pad(i + 1, 3);

function refreshColors() {
  const cs = getComputedStyle(root());
  S.C.accent = cs.getPropertyValue("--accent-rgb").trim() || S.C.accent;
  S.C.accent2 = cs.getPropertyValue("--accent-2-rgb").trim() || S.C.accent2;
  S.C.alert = cs.getPropertyValue("--alert-rgb").trim() || S.C.alert;
  S.C.mono = cs.getPropertyValue("--font-mono").trim() || S.C.mono;
  S.themeListeners.forEach((fn) => fn());
}

/* Typed text. A line is a list of segments: "plain", ["text", "class"], or { t, c, href, cmd }. */
function segNode(seg) {
  if (typeof seg === "string") seg = { t: seg };
  else if (Array.isArray(seg)) seg = { t: seg[0], c: seg[1] };
  let node = null;
  if (seg.href) {
    node = document.createElement("a");
    node.href = seg.href;
    if (/^https?:/.test(seg.href)) {
      node.target = "_blank";
      node.rel = "noopener noreferrer";
    } else if (isInternal(seg.href)) {
      node.dataset.nav = "1";
    }
  } else if (seg.cmd) {
    node = document.createElement("button");
    node.type = "button";
    node.className = "t-cmd";
    node.dataset.cmd = seg.cmd;
  } else if (seg.c) {
    node = document.createElement("span");
  }
  const text = document.createTextNode("");
  if (node) {
    if (seg.c) node.classList.add(...seg.c.split(" "));
    node.appendChild(text);
  }
  return { node: node || text, text, full: String(seg.t) };
}
async function typeSegs(container, segs, perFrame = 2, sc) {
  const parts = segs.map(segNode);
  parts.forEach((p) => container.appendChild(p.node));
  if (S.reduced || perFrame === Infinity) {
    parts.forEach((p) => {
      p.text.data = p.full;
    });
    return;
  }
  for (const p of parts) {
    for (let i = 0; i < p.full.length; ) {
      if (sc && !sc.alive) {
        p.text.data = p.full;
        break;
      }
      i = Math.min(p.full.length, i + perFrame);
      p.text.data = p.full.slice(0, i);
      await nextFrame();
    }
  }
}

/* Decrypt effect: random glyphs resolve into the real text from left to right */
const GLYPHS = "!<>-_\\/[]{}=+*^?#$%&01XA";
function scramble(el, text, duration = 1100, sc) {
  if (S.reduced) {
    el.textContent = text;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const start = performance.now();
    const n = text.length;
    let last = 0;
    const tick = (now) => {
      if (sc && !sc.alive) {
        el.textContent = text;
        resolve();
        return;
      }
      const p = clamp((now - start) / duration, 0, 1);
      if (now - last > 34 || p === 1) {
        last = now;
        const k = Math.floor(p * n);
        let rest = "";
        for (let i = k; i < n; i++) rest += text[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        el.innerHTML = esc(text.slice(0, k)) + (rest ? `<span class="scr">${esc(rest)}</span>` : "");
      }
      if (p < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

/* SHA-256 in plain JS. Used by the contact form and the terminal. */
function sha256(text) {
  if (!sha256.k) {
    sha256.k = [];
    sha256.h = [];
    for (let n = 2; sha256.k.length < 64; n++) {
      let prime = true;
      for (let i = 2; i * i <= n; i++)
        if (n % i === 0) {
          prime = false;
          break;
        }
      if (!prime) continue;
      if (sha256.h.length < 8) sha256.h.push((Math.sqrt(n) * 2 ** 32) | 0);
      sha256.k.push((Math.cbrt(n) * 2 ** 32) | 0);
    }
  }
  const K = sha256.k;
  const rotr = (v, n) => (v >>> n) | (v << (32 - n));
  const bytes = Array.from(new TextEncoder().encode(text));
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push(i > 3 ? 0 : (bitLen >>> (i * 8)) & 255);
  const h = sha256.h.slice();
  const w = new Array(64);
  for (let off = 0; off < bytes.length; off += 64) {
    for (let i = 0; i < 16; i++) {
      const j = off + i * 4;
      w[i] = (bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3];
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (hh + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, hh].forEach((v, i) => {
      h[i] = (h[i] + v) | 0;
    });
  }
  return h.map((v) => (v >>> 0).toString(16).padStart(8, "0")).join("");
}

let toastTimer = 0;
function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
}

/* ───────────────────────── 1. NAVIGATION STATE ───────────────────────── */
function isHome() {
  return S.path === "/";
}
function paintCwd() {
  const el = $("#cwdPath");
  if (el) el.textContent = S.cwd;
  if (S.term) S.term.paintPrompt();
}
function cwdForPath(path) {
  if (path === "/") return S.activeSection ? `~/${S.activeSection}` : "~";
  if (path === "/projects") return "~/projects";
  if (path.startsWith("/projects/")) return `~/projects/${path.split("/")[2] || ""}.md`;
  if (path === "/cv") return "~/cv.txt";
  if (path === "/posts") return "~/posts.log";
  return "~" + path;
}
function setActive(id) {
  if (id === S.activeSection) return;
  S.activeSection = id;
  $$("#tree a[data-sec]").forEach((a) => a.setAttribute("aria-current", String(a.dataset.sec === id)));
  S.cwd = cwdForPath(S.path);
  paintCwd();
  S.sectionListeners.forEach((fn) => fn(id));
}
function goTo(id) {
  const el = document.getElementById(id || "top");
  if (el) el.scrollIntoView({ behavior: S.reduced ? "auto" : "smooth", block: "start" });
}
/* Move to a home-page section: scroll when we are on the home page, navigate there otherwise */
function navSection(id) {
  if (isHome()) {
    setActive(id);
    goTo(id);
    return true;
  }
  S.navigate(id ? `/#${id}` : "/");
  return false;
}

/* ───────────────────────── 2. BOOT SEQUENCE ───────────────────────── */
function runBoot(sc) {
  const boot = $("#boot");
  const el = root();
  if (!boot || !el.classList.contains("booting")) {
    if (boot) boot.hidden = true;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let finished = false;
    const skip = $("#bootSkip");
    const finish = () => {
      if (finished) return;
      finished = true;
      store.set("boot", "1");
      boot.classList.add("done");
      el.classList.remove("booting");
      setTimeout(() => {
        boot.hidden = true;
      }, 650);
      resolve();
    };
    sc.defer(() => {
      if (!finished) resolve();
    });
    sc.on(
      document,
      "keydown",
      (e) => {
        if (finished) return;
        if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          finish();
        }
      },
      { capture: true },
    );
    sc.on(skip, "click", finish);
    if (skip) skip.focus({ preventScroll: true });

    (async () => {
      $("#bootHead").textContent = `SECURE BOOT 4.2  ::  host ${HANDLE()}-portfolio  ::  ${nowStamp()}`;
      const list = $("#bootLines");
      const prog = $("#bootProg");
      list.innerHTML = "";
      $("#bootGrant").classList.remove("show");
      const lines = (S.data && S.data.boot) || ["Initializing secure kernel"];
      const bar = (k) => {
        const n = Math.round(k * 28);
        prog.textContent = `[${"#".repeat(n)}${".".repeat(28 - n)}] ${Math.round(k * 100)}%`;
      };
      bar(0);
      for (let i = 0; i < lines.length && !finished && sc.alive; i++) {
        const li = document.createElement("li");
        li.innerHTML = '<span class="st">[ .. ]</span> <span class="bl"></span>';
        list.appendChild(li);
        await typeSegs($(".bl", li), [lines[i] + "..."], 3, sc);
        await sc.sleep(90 + Math.random() * 130);
        $(".st", li).innerHTML = '[ <span class="ok">OK</span> ]';
        bar((i + 1) / lines.length);
      }
      if (finished || !sc.alive) return;
      await sc.sleep(260);
      $("#bootGrant").classList.add("show");
      await sc.sleep(1150);
      finish();
    })();
  });
}

/* ───────────────────────── 3. CHROME: STRIP, RAIL, CLOCK ───────────────────────── */
function initStrip(sc) {
  const bar = $("#scanBar");
  const label = $("#scanLabel");
  let queued = false;
  const update = () => {
    queued = false;
    const max = root().scrollHeight - innerHeight;
    const p = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
    const pct = Math.round(p * 100);
    if (bar) bar.style.transform = `scaleX(${p})`;
    if (label) label.textContent = pct >= 100 ? "Scan complete: 100%" : `Scanning... ${pct}%`;
  };
  sc.on(
    window,
    "scroll",
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  sc.on(window, "resize", update);
  S.updateScan = update;
  update();

  /* File-tree drawer on tablets and phones */
  const rail = $("#rail");
  const scrim = $("#railScrim");
  const btn = $("#menuBtn");
  const setRail = (open) => {
    if (!rail) return;
    rail.classList.toggle("open", open);
    if (scrim) scrim.hidden = !open;
    if (btn) {
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close section menu" : "Open section menu");
    }
  };
  sc.on(btn, "click", () => setRail(!rail.classList.contains("open")));
  sc.on(scrim, "click", () => setRail(false));
  sc.on(rail, "click", (e) => {
    if (e.target.closest("a, button")) setRail(false);
  });
  sc.on(document, "keydown", (e) => {
    if (e.key === "Escape" && rail && rail.classList.contains("open")) {
      setRail(false);
      if (btn) btn.focus();
    }
  });

  /* Session details in the rail */
  const sess = $("#sessId");
  if (sess) sess.textContent = "0x" + ((Math.random() * 0xffff) | 0).toString(16).toUpperCase().padStart(4, "0");
  sc.interval(() => {
    const up = $("#sessUp");
    if (up) up.textContent = hms(Date.now() - S.T0);
    const live = $("#liveLine .ts");
    if (live) live.textContent = `[${nowStamp()}]`;
  }, 1000);
}

/* Links created by the runtime (terminal output, report dialog) go through the Next.js router */
function initInternalLinks(sc) {
  sc.on(document, "click", (e) => {
    const a = e.target instanceof Element ? e.target.closest("a[data-nav]") : null;
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute("href");
    if (!isInternal(href)) return;
    e.preventDefault();
    const dlg = a.closest("dialog");
    if (dlg && dlg.open) dlg.close();
    S.navigate(href);
  });
  sc.on(document, "click", (e) => {
    const b = e.target instanceof Element ? e.target.closest("[data-open-case]") : null;
    if (b) S.openCase(+b.dataset.openCase);
  });
  sc.on(document, "click", (e) => {
    const b = e.target instanceof Element ? e.target.closest("[data-open-term]") : null;
    if (b && S.term) S.term.open();
  });
}

/* ───────────────────────── 4. CASE REPORT DIALOG ───────────────────────── */
function initReport(sc) {
  const dlg = $("#report");
  if (!dlg) return;
  const close = () => {
    if (dlg.open && dlg.close) dlg.close();
    else dlg.removeAttribute("open");
    root().classList.remove("modal-open");
  };
  S.openCase = (i) => {
    const p = S.data && S.data.projects[i];
    if (!p) return false;
    let n = 0;
    const sec = (title, body) => {
      n += 1;
      return `<section class="report-sec"><h4>${n}.0 ${esc(title)}</h4>${body}</section>`;
    };
    $("#reportMeta").innerHTML = `<span>CASE ${esc(p.no)}</span><span class="status ${esc(p.statusClass)}">${esc(p.status)}</span><span>${esc(p.tags.join(", ").toLowerCase())}</span>`;
    $("#reportTitle").textContent = p.title;
    const cover = p.cover
      ? `<figure class="report-cover${p.cover.position === "contain" ? " fit-contain" : ""}"><img src="${esc(p.cover.src)}" alt="${esc(p.cover.alt)}" width="${p.cover.width}" height="${p.cover.height}" loading="lazy" decoding="async"></figure>`
      : "";
    $("#reportBody").innerHTML =
      cover +
      sec("Objective", `<p>${esc(p.objective)}</p>`) +
      (p.approach ? sec("Approach", `<p>${esc(p.approach)}</p>`) : "") +
      sec("Tools", `<ul class="chips">${p.tech.map((t) => `<li class="chip">${esc(t)}</li>`).join("")}</ul>`) +
      sec(p.resultsTitle, `<ul class="findings">${p.results.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>`);
    const actions = p.links
      .map((l) => `<a class="btn" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${icon("code")} ${esc(l.label)}</a>`)
      .concat(`<a class="btn btn-primary" href="/projects/${esc(p.slug)}" data-nav="1">${icon("file")} Read the full case file</a>`);
    $("#reportActions").innerHTML = actions.join("");
    $("#reportFoot").textContent = `Filed by ${NAME()}`;
    if (!dlg.open) {
      if (dlg.showModal) dlg.showModal();
      else dlg.setAttribute("open", "");
    }
    $("#reportBody").scrollTop = 0;
    root().classList.add("modal-open");
    return true;
  };
  sc.on(dlg, "close", () => root().classList.remove("modal-open"));
  sc.on($("#reportClose"), "click", close);
  sc.on(dlg, "click", (e) => {
    if (e.target === dlg) close();
  });
  sc.defer(() => {
    close();
    S.openCase = () => false;
  });
}

/* ───────────────────────── 5. SCREENSHOT VIEWER ───────────────────────── */
const viewer = { list: [], index: 0 };
function initViewer(sc) {
  const dlg = $("#viewer");
  if (!dlg) return;
  const img = $("#viewerImage");
  const show = (i) => {
    const n = viewer.list.length;
    if (!n) return;
    viewer.index = (i + n) % n;
    const item = viewer.list[viewer.index];
    img.src = item.src;
    img.alt = item.alt;
    img.width = item.width;
    img.height = item.height;
    img.classList.toggle("tall", item.height > item.width * 1.4);
    $("#viewerCaption").textContent = item.caption || item.alt;
    $("#viewerCount").textContent = `evidence ${viewer.index + 1} / ${n}`;
    $("#viewerOpen").href = item.src;
    $("#viewerPrev").hidden = n < 2;
    $("#viewerNext").hidden = n < 2;
  };
  viewer.open = (i) => {
    show(i);
    if (!dlg.open) {
      if (dlg.showModal) dlg.showModal();
      else dlg.setAttribute("open", "");
    }
    root().classList.add("modal-open");
  };
  const close = () => {
    if (dlg.open && dlg.close) dlg.close();
    root().classList.remove("modal-open");
  };
  sc.on(dlg, "close", () => root().classList.remove("modal-open"));
  sc.on($("#viewerClose"), "click", close);
  sc.on($("#viewerPrev"), "click", () => show(viewer.index - 1));
  sc.on($("#viewerNext"), "click", () => show(viewer.index + 1));
  sc.on(dlg, "click", (e) => {
    if (e.target === dlg || e.target === $("#viewerStage")) close();
  });
  sc.on(dlg, "keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      show(viewer.index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      show(viewer.index - 1);
    }
  });
  sc.defer(close);
}

/* ───────────────────────── 6. TERMINAL ───────────────────────── */
function confetti() {
  if (S.reduced) return;
  const cv = $("#confetti");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = innerWidth;
  const H = innerHeight;
  const cols = [S.C.accent, S.C.accent2, "255 255 255"];
  cv.hidden = false;
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const parts = Array.from({ length: 150 }, () => ({
    x: W / 2 + rand(-80, 80),
    y: H * 0.66,
    vx: rand(-10, 10),
    vy: rand(-19, -7),
    g: rand(0.24, 0.4),
    s: rand(5, 11),
    rot: rand(0, 6.28),
    vr: rand(-0.25, 0.25),
    col: pick(cols),
    ch: Math.random() < 0.45 ? pick(["0", "1"]) : "",
  }));
  const t0 = performance.now();
  const step = (t) => {
    const k = (t - t0) / 3200;
    ctx.clearRect(0, 0, W, H);
    if (k >= 1) {
      cv.hidden = true;
      return;
    }
    for (const p of parts) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = rgb(p.col, Math.min(1, (1 - k) * 1.6));
      if (p.ch) {
        ctx.font = `600 ${Math.round(p.s + 7)}px ${S.C.mono}`;
        ctx.fillText(p.ch, 0, 0);
      } else ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      ctx.restore();
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function setTheme(red) {
  root().classList.toggle("redteam", red);
  const mode = $("#sessMode");
  if (mode) mode.textContent = red ? "red team" : "blue team";
  const level = $("#threatLevel");
  if (level) level.textContent = red ? "red team engaged" : "threat level: low";
  refreshColors();
}

function captureFlag(quiet) {
  const badge = $("#flagBadge");
  if (badge) badge.hidden = false;
  const strip = $("#stripFlag");
  if (strip) strip.hidden = false;
  store.set("flag", "1");
  if (!quiet) {
    toast("You found the flag!");
    confetti();
  }
}

function initTerminal(sc) {
  const el = $("#term");
  const out = $("#termOut");
  const input = $("#termInput");
  const form = $("#termForm");
  const fab = $("#termFab");
  const cursor = $("#termCursor");
  const ps1 = $("#termPs1");
  const cwdEl = $("#termCwd");
  const chips = $("#termChips");
  if (!el || !out || !input) return null;
  const P = S.data;
  const FLAG_B64 = (P && P.flagBase64) || "";
  const SECTIONS = P.sections.map((s) => s.id);
  const history = [];
  let hIdx = -1;
  let draft = "";
  let greeted = false;
  let lastFocus = null;
  let navHint = false;
  let chain = Promise.resolve();
  const wait = (ms) => (S.reduced ? Promise.resolve() : sc.sleep(ms));
  const caseFile = (i) => `case-${pad(i + 1, 3)}-${P.projects[i].slug}.md`;
  const badgeFile = (b) => `${slug(b.code)}.badge`;
  out.innerHTML = "";

  function paintPrompt() {
    ps1.innerHTML = `<span>${esc(S.cwd)}</span> $`;
    cwdEl.textContent = S.cwd;
  }
  function updateCursor() {
    cursor.style.setProperty("--pos", input.selectionStart == null ? input.value.length : input.selectionStart);
    cursor.style.setProperty("--scroll", input.scrollLeft);
  }

  /* Print one line. Lines stream fast, like real terminal output. */
  async function print(segs, cls, instant) {
    if (typeof segs === "string") segs = [segs];
    const div = document.createElement("div");
    div.className = "tl" + (cls ? " " + cls : "");
    out.appendChild(div);
    const len = segs.reduce((n, s) => n + String(typeof s === "string" ? s : Array.isArray(s) ? s[0] : s.t).length, 0);
    await typeSegs(div, segs, instant ? Infinity : Math.max(10, Math.ceil(len / 2)), sc);
    out.scrollTop = out.scrollHeight;
  }
  const kv = (k, v) => print([[k.padEnd(11), "dim"], v]);

  async function nav(id) {
    const stayed = navSection(id);
    if (stayed && !navHint && innerWidth <= 640) {
      navHint = true;
      await print("The page scrolled behind this window. Type exit to see it.", "dim");
    }
  }
  async function go(href) {
    if (S.path !== href) S.navigate(href);
  }

  /* The site is the filesystem: home sections are directories, pages are files */
  function listing(dir, all) {
    const items = [];
    if (!dir) {
      if (all) items.push({ n: ".flag.enc", cmd: "cat .flag.enc" });
      SECTIONS.forEach((s) => items.push({ n: s + "/", dir: true, cmd: "cd " + s }));
      ["about.txt", "contact.txt", "cv.txt", "posts.log", "cv.pdf"].forEach((f) => items.push({ n: f, cmd: "cat " + f }));
    } else if (dir === "projects") {
      P.projects.forEach((_, i) => items.push({ n: caseFile(i), cmd: "cat " + caseFile(i) }));
    } else if (dir === "certs") {
      P.certifications.forEach((b) => items.push({ n: badgeFile(b), cmd: "cat " + badgeFile(b) }));
    } else {
      items.push({ n: "README.md", cmd: "cat README.md" });
    }
    return items;
  }

  async function contactLines() {
    const c = P.contact || {};
    if (c.email) await print([["email      ", "dim"], { t: c.email, href: "mailto:" + c.email }]);
    if (c.linkedin) await print([["linkedin   ", "dim"], { t: prettyUrl(c.linkedin), href: c.linkedin }]);
    if (c.github) await print([["github     ", "dim"], { t: prettyUrl(c.github), href: c.github }]);
    await print([["cv         ", "dim"], { t: "cv.pdf", href: P.resumeUrl }]);
  }
  async function caseText(i) {
    const p = P.projects[i];
    await print([[`CASE ${caseNo(i)}  ${p.title}`, "hl"], `  [${p.status}]`]);
    await print(p.summary);
    await kv("objective", p.objective);
    await kv("tools", p.tech.join(", "));
    for (const r of p.results) await print([["[+] ", "ok"], r]);
    await print(["Report: ", { t: `open ${i + 1}`, cmd: `open ${i + 1}` }, "   Full case file: ", { t: `/projects/${p.slug}`, href: `/projects/${p.slug}` }], "dim");
  }
  function decode(str) {
    try {
      const txt = atob(str.replace(/^['"]|['"]$/g, ""));
      return print(txt, "ok").then(() => (btoa(txt) === FLAG_B64 ? print("That looks like a flag. Hand it in with: submit <flag>", "dim") : null));
    } catch (e) {
      return print("base64: invalid input", "err");
    }
  }
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    return d[a.length][b.length];
  }

  const H = HANDLE();
  const HELP = [
    ["about", "Bio and key facts"],
    ["research", "Research interests and what I am looking for"],
    ["skills", "Skill audit"],
    ["projects", "Case files (open <n> for a report)"],
    ["experience", "Career log"],
    ["certs", "Certifications"],
    ["community", "Community roles"],
    ["contact", "Ways to reach me"],
    ["cv", "Open the CV page"],
    ["posts", "Open the LinkedIn posts"],
    ["resume", "Download my CV as a PDF"],
    ["soc", "Latest events from the SOC wall"],
    null,
    ["ls", "List this directory (ls -a shows hidden files)"],
    ["cd <dir>", "Move to a section; cd .. goes home"],
    ["cat <file>", "Print a file"],
    ["pwd", "Print the working directory"],
    null,
    ["whoami", "Who is who"],
    ["nmap portfolio", "Scan this site"],
    [`ping ${H}`, "Check that I respond"],
    [`ssh recruiter@${H}`, "Open a priority channel"],
    ["sudo hire-me", "Recommended"],
    null,
    ["history", "Commands you have run"],
    ["clear", "Clear the screen"],
    ["theme red", "Switch sides (theme green to switch back)"],
    ["exit", "Close the terminal"],
  ];

  const commands = {
    async help() {
      await print("Available commands. Tab completes, the arrow keys recall history.", "dim");
      for (const row of HELP) {
        if (!row) {
          await print("");
          continue;
        }
        const [name, desc] = row;
        const runnable = !/[<>]/.test(name);
        await print(["  ", runnable ? { t: name, cmd: name } : [name, "hl"], " ".repeat(Math.max(2, 24 - name.length)), [desc, "dim"]]);
      }
    },
    async whoami() {
      await print([["visitor", "hl"], "  uid=1001, read-only guest"]);
      await print(["You are looking at ", [NAME(), "hl"], `, ${P.currentRole}.`]);
      await print(P.tagline, "dim");
    },
    async about() {
      await print([[NAME(), "hl"], `  ${P.titles[0]}`]);
      for (const t of P.bio) await print(t);
      await kv("location", `${P.location}, ${P.timezone}`);
      if (P.study) await kv("study", P.study);
      await kv("focus", P.focus.join(", "));
      await kv("speaks", P.languages.join(", "));
      await nav("about");
    },
    async research() {
      for (const r of P.research) await print([["[*] ", "ok"], [r.title, "hl"], `  ${r.body}`]);
      await print([[P.goal.title, "hl"]]);
      await print(P.goal.body, "dim");
      await nav("research");
    },
    async skills() {
      for (const s of P.skills) {
        const n = Math.round(clamp(+s.share, 0, 100) / 5);
        await print([["[PASS] ", "ok"], s.name.padEnd(16), ["█".repeat(n) + "░".repeat(20 - n), "ok"], ` ${s.share}%  (${s.count} projects)`]);
      }
      for (const g of P.toolGroups) await kv(slug(g.title).slice(0, 10), g.items.join(", "));
      await nav("skills");
    },
    async projects() {
      for (let i = 0; i < P.projects.length; i++) {
        const p = P.projects[i];
        await print([
          { t: caseNo(i), cmd: `open ${i + 1}` },
          "  ",
          [p.title.padEnd(26), "hl"],
          [`[${p.status}]`.padEnd(11), p.status === "PUBLIC" ? "ok" : "dim"],
          [p.tags.join(", ").toLowerCase(), "dim"],
        ]);
      }
      await print("Run open <n> for the report, for example open 1.", "dim");
      if (isHome()) await nav("projects");
      else await go("/projects");
    },
    async open(args) {
      const i = parseInt(args[0], 10) - 1;
      if (!P.projects[i]) return print(`open: no case ${args[0] || ""}. Cases run from 1 to ${P.projects.length}.`, "warn");
      await print(`Opening case ${caseNo(i)}: ${P.projects[i].title}`, "dim");
      S.openCase(i);
    },
    async experience() {
      for (const x of P.experience) await print([[`[${x.date}] `, "dim"], x.line]);
      await nav("experience");
    },
    async certs() {
      for (const b of P.certifications) await print([[String(b.code).padEnd(8), "hl"], `${b.name}, ${b.issuer} `, [`(${b.year})`, "dim"]]);
      await nav("certs");
    },
    async community() {
      for (const c of P.community) await print([[c.role, "hl"], `, ${c.organization} `, [`(${c.period})`, "dim"]]);
      await nav("community");
    },
    async contact() {
      await contactLines();
      await nav("contact");
    },
    async cv() {
      await print(["Opening ", { t: "~/cv.txt", href: "/cv" }], "dim");
      await go("/cv");
    },
    async posts() {
      await print(["Opening ", { t: "~/posts.log", href: "/posts" }], "dim");
      await go("/posts");
    },
    async resume() {
      await print(["Downloading CV: ", { t: "cv.pdf", href: P.resumeUrl }]);
      const a = document.createElement("a");
      a.href = P.resumeUrl;
      a.download = "";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    async soc() {
      if (!S.soc.recent.length) {
        await print("The SOC wall runs on the home page. Taking you there.", "dim");
        return nav("soc");
      }
      await print("tail -n 5 /var/log/soc/live.log   (simulated)", "dim");
      for (const l of S.soc.recent.slice(-5)) await print(l);
      await nav("soc");
    },
    async ls(args) {
      const flags = args.filter((a) => a.startsWith("-")).join("");
      const target = args.find((a) => !a.startsWith("-"));
      const dir = target ? target.replace(/^~\/?|\/$/g, "") : isHome() ? S.activeSection : "";
      if (dir && !SECTIONS.includes(dir)) return print(`ls: ${target}: No such directory`, "err");
      const items = listing(dir, flags.includes("a"));
      if (flags.includes("l")) {
        for (const it of items) await print([[it.dir ? "drwxr-xr-x  " : "-rw-r--r--  ", "dim"], [`${H}  `, "dim"], { t: it.n, cmd: it.cmd, c: it.dir ? "" : "hl" }]);
      } else {
        await print(items.flatMap((it) => [{ t: it.n, cmd: it.cmd, c: it.dir ? "" : "hl" }, "   "]));
      }
    },
    async cd(args) {
      const d = (args[0] || "~").replace(/^~\/?|^\.\/|\/$/g, "");
      if (!d || d === ".." || d === "/") return nav("");
      if (!SECTIONS.includes(d)) return print(`cd: ${args[0]}: No such directory. Run ls to see the sections.`, "err");
      await nav(d);
    },
    async pwd() {
      await print(P.home + S.cwd.replace(/^~/, ""));
    },
    async cat(args) {
      const f = (args[0] || "").replace(/^\.\/|^~\//, "");
      if (!f) return print("cat: name a file, for example cat about.txt", "warn");
      if (f === "about.txt") {
        for (const t of P.bio) await print(t);
        return;
      }
      if (f === "contact.txt") return contactLines();
      if (f === "cv.txt") return commands.cv();
      if (f === "posts.log") return commands.posts();
      if (f === "cv.pdf") return print("cv.pdf is a binary file. Run resume to download it.", "dim");
      if (f === ".flag.enc") {
        await print(FLAG_B64, "warn");
        return print("Encoded, not encrypted. Decode it, then run: submit <flag>", "dim");
      }
      if (f === "/etc/passwd") {
        await print("root:x:0:0:root:/root:/usr/sbin/nologin");
        await print(`${H}:x:1000:1000:${NAME()}:${P.home}:/bin/zsh`);
        return print("recruiter:x:1001:1001:VIP guest:/home/recruiter:/bin/hire");
      }
      if (f === "/etc/shadow") return print("cat: /etc/shadow: Permission denied", "err");
      if (f === "README.md") return print(`This directory is the ${S.activeSection || "home"} section of the page behind this window.`, "dim");
      const base = f.split("/").pop();
      const ci = P.projects.findIndex((_, i) => caseFile(i) === base || `${P.projects[i].slug}.md` === base);
      if (ci >= 0) return caseText(ci);
      const b = P.certifications.find((x) => badgeFile(x) === base);
      if (b) return print([[b.code, "hl"], `  ${b.name}, ${b.issuer} (${b.year})`]);
      return print(`cat: ${f}: No such file. Run ls to see what is here.`, "err");
    },
    async nmap(args) {
      const target = args.find((a) => !a.startsWith("-"));
      if (!target) return print("nmap: no target given. Try nmap portfolio", "warn");
      await print(`Starting Nmap 7.95 at ${nowStamp().slice(0, 16)}`, "dim");
      await wait(550);
      await print(`Nmap scan report for ${target} (10.13.37.1)`);
      await print("Host is up (0.00042s latency).", "dim");
      await print("PORT       STATE      SERVICE", "hl");
      const rows = [
        ["22/tcp", "open", "ssh", "contact"],
        ["80/tcp", "open", "about", "about"],
        ["443/tcp", "open", "case-files", "projects"],
        ["3306/tcp", "filtered", "mysql", ""],
        ["5601/tcp", "open", "soc-wall", "soc"],
        ["8080/tcp", "open", "skill-audit", "skills"],
        ["8443/tcp", "open", "badges", "certs"],
        ["8888/tcp", "open", "research-lab", "research"],
      ];
      for (const [port, st, svc, sec] of rows) {
        await wait(110);
        await print([port.padEnd(11), [st.padEnd(11), st === "open" ? "ok" : "warn"], sec ? { t: svc, cmd: "cd " + sec } : [svc, "dim"]]);
      }
      await print("Nmap done: 1 IP address (1 host up) scanned in 1.37 seconds", "dim");
    },
    async ping(args) {
      const host = args[0] || H;
      await print(`PING ${host} (10.13.37.1) 56(84) bytes of data.`);
      for (let i = 1; i <= 4; i++) {
        await wait(380);
        await print(`64 bytes from ${host} (10.13.37.1): icmp_seq=${i} ttl=64 time=${rand(0.2, 0.9).toFixed(2)} ms`);
      }
      await print(`--- ${host} ping statistics ---`, "dim");
      await print(["4 packets transmitted, 4 received, ", ["0% packet loss", "ok"], "."]);
    },
    async ssh(args) {
      const target = args[0] || `recruiter@${H}`;
      const user = target.includes("@") ? target.split("@")[0] : "guest";
      await print(`Connecting to ${H}.sec port 22...`, "dim");
      await wait(450);
      await print(`Host key fingerprint: SHA256:${btoa(sha256(H).slice(0, 32)).slice(0, 43)}`, "dim");
      await wait(350);
      if (user === "root") return print("Permission denied: root login is disabled on this host, as it should be.", "err");
      await print(["Authenticating ", [user, "hl"], "... ", ["accepted (publickey)", "ok"]]);
      await wait(300);
      await print(`Welcome, ${user}. Priority channel open:`, "ok");
      await contactLines();
      await nav("contact");
    },
    async history() {
      for (let i = 0; i < history.length; i++) await print([[String(i + 1).padStart(4) + "  ", "dim"], history[i]]);
    },
    async clear() {
      out.innerHTML = "";
    },
    async date() {
      await print(new Date().toString());
    },
    async uptime() {
      await print(`session up ${hms(Date.now() - S.T0)}, 1 visitor, load average: 0.07, 0.03, 0.01`);
    },
    async echo(args) {
      await print(args.join(" ").replace(/^['"]|['"]$/g, ""));
    },
    async base64(args) {
      if (args[0] !== "-d" && args[0] !== "--decode") return print("Usage: base64 -d <string>", "warn");
      if (!args[1]) return print("base64: nothing to decode", "warn");
      await decode(args[1]);
    },
    async submit(args) {
      const guess = args.join(" ").trim();
      if (!guess) return print("Usage: submit flag{...}", "warn");
      let ok = false;
      try {
        ok = btoa(guess) === FLAG_B64;
      } catch (e) {
        ok = false;
      }
      if (!ok) return print("Wrong flag. Keep digging: ls -a is a good start.", "err");
      await print("Flag accepted. You found it!", "ok");
      captureFlag(false);
    },
    async theme(args) {
      const t = (args[0] || "").toLowerCase();
      if (t !== "red" && t !== "green" && t !== "blue") return print("Usage: theme red  or  theme green", "warn");
      setTheme(t === "red");
      await print(t === "red" ? "Red team mode engaged. Scope: this page only." : "Back to blue team. Shields up.", t === "red" ? "err" : "ok");
    },
    async reboot() {
      await print("Rebooting...", "dim");
      store.del("boot");
      setTimeout(() => location.reload(), 400);
    },
    async rm() {
      await print("Nice try. This incident has been logged.", "err");
      S.soc.log("blocked", "Destructive command from the visitor terminal");
    },
    async exit() {
      close();
    },
  };
  commands.flag = commands.submit;
  commands.quit = commands.logout = commands.exit;
  commands.cls = commands.clear;
  commands.home = () => nav("");
  commands.redteam = () => commands.theme(["red"]);
  commands.vim = commands.vi = commands.nano = commands.emacs = () => print("Editor wars are out of scope for this engagement.", "dim");
  commands.man = () => print("No manual here. Run help instead.", "dim");

  async function sudo(args) {
    const rest = args.join(" ").toLowerCase();
    if (!rest) return print("Usage: sudo <command>", "warn");
    if (/^hire[-_ ]?me\b/.test(rest)) {
      await print("[sudo] password for visitor: ********", "dim");
      await wait(420);
      await print("Access granted. Privilege escalated to: hiring manager", "ok");
      confetti();
      await print("Good call. Here is where to send the offer:");
      await contactLines();
      S.soc.log("flagged", "Privilege escalation by a recruiter, approved by the owner");
      return;
    }
    if (/^rm\b/.test(rest)) return commands.rm();
    await print("visitor is not in the sudoers file. This incident will be reported.", "err");
  }

  /* Commands run one after another, so fast typists never lose input while output is still streaming */
  function run(raw) {
    chain = chain.then(() => exec(raw)).catch(() => {});
    return chain;
  }
  async function exec(raw) {
    raw = String(raw).trim();
    await print([[`${S.cwd} $ `, "p"], raw], "echo", true);
    if (!raw) return;
    if (history[history.length - 1] !== raw) history.push(raw);
    hIdx = -1;
    draft = "";
    out.setAttribute("aria-busy", "true");
    try {
      const piped = raw.match(/^echo\s+(.+?)\s*\|\s*base64\s+(?:-d|--decode)$/);
      const [name, ...args] = raw.split(/\s+/);
      const key = name.toLowerCase();
      if (piped) await decode(piped[1]);
      else if (key === "sudo") await sudo(args);
      else if (Object.prototype.hasOwnProperty.call(commands, key)) await commands[key](args);
      else {
        const near = Object.keys(commands).find((k) => lev(k, key) <= (key.length >= 4 ? 2 : 1));
        await print(
          [`${name}: command not found. `, near ? "Did you mean " : "Run ", { t: near || "help", cmd: near || "help" }, near ? "?" : " to see what works."],
          "warn",
        );
      }
    } catch (err) {
      await print("The command hit an unexpected error. Try it again.", "err");
    }
    out.setAttribute("aria-busy", "false");
    out.scrollTop = out.scrollHeight;
  }

  /* Tab completion: commands first, then arguments that make sense for the command */
  function complete() {
    const v = input.value;
    const parts = v.split(/\s+/);
    const last = parts[parts.length - 1];
    let pool;
    if (parts.length === 1) pool = [...Object.keys(commands), "sudo"];
    else {
      const head = parts[0].toLowerCase();
      pool =
        head === "cd" || head === "ls"
          ? [...SECTIONS, ".."]
          : head === "cat"
            ? listing(isHome() ? S.activeSection : "", true)
                .filter((i) => !i.dir)
                .map((i) => i.n)
            : head === "sudo"
              ? ["hire-me"]
              : head === "nmap"
                ? ["portfolio"]
                : head === "ping"
                  ? [H]
                  : head === "ssh"
                    ? [`recruiter@${H}`]
                    : head === "theme"
                      ? ["red", "green"]
                      : head === "open"
                        ? P.projects.map((_, i) => String(i + 1))
                        : head === "base64"
                          ? ["-d"]
                          : [];
    }
    const hits = pool.filter((x) => x.startsWith(last)).sort();
    if (!hits.length) return;
    let fill = hits[0];
    if (hits.length > 1) {
      while (!hits.every((h) => h.startsWith(fill))) fill = fill.slice(0, -1);
      print(hits.join("   "), "dim");
    } else fill += " ";
    parts[parts.length - 1] = fill;
    input.value = parts.join(" ");
    updateCursor();
  }

  async function greet() {
    const sess = $("#sessId");
    await print([["SecureShell 4.2", "hl"], `  session ${sess ? sess.textContent : "0x0000"}, read-only guest access`]);
    await print(
      ["Type ", { t: "help", cmd: "help" }, " to list commands, or try ", { t: "nmap portfolio", cmd: "nmap portfolio" }, " and ", { t: "sudo hire-me", cmd: "sudo hire-me" }, "."],
      "dim",
    );
    await print("");
  }

  function syncKeyboard() {
    const vv = window.visualViewport;
    if (!vv) return;
    el.style.setProperty("--kb", Math.max(0, innerHeight - vv.height - vv.offsetTop) + "px");
    out.scrollTop = out.scrollHeight;
  }
  function open() {
    if (!el.hidden) {
      input.focus();
      return;
    }
    lastFocus = document.activeElement;
    el.hidden = false;
    fab.hidden = true;
    fab.setAttribute("aria-expanded", "true");
    paintPrompt();
    if (!greeted) {
      greeted = true;
      greet();
    }
    if (S.finePointer) input.focus({ preventScroll: true });
    updateCursor();
    syncKeyboard();
  }
  function close() {
    if (el.hidden) return;
    el.hidden = true;
    fab.hidden = false;
    fab.setAttribute("aria-expanded", "false");
    if (lastFocus && document.contains(lastFocus) && lastFocus !== document.body) lastFocus.focus({ preventScroll: true });
    else fab.focus({ preventScroll: true });
  }
  const toggle = () => (el.hidden ? open() : close());

  paintPrompt();
  chips.innerHTML = ["help", "about", "research", "projects", "nmap portfolio", "sudo hire-me", "ls -a", "contact", "clear", "exit"]
    .map((c) => `<button type="button" data-cmd="${c}">${c}</button>`)
    .join("");

  sc.on(form, "submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    updateCursor();
    run(v);
  });
  sc.on(input, "keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!history.length) return;
      e.preventDefault();
      if (hIdx === -1) {
        if (e.key === "ArrowDown") return;
        draft = input.value;
        hIdx = history.length;
      }
      hIdx = clamp(hIdx + (e.key === "ArrowUp" ? -1 : 1), 0, history.length);
      input.value = hIdx === history.length ? draft : history[hIdx];
      if (hIdx === history.length) hIdx = -1;
      requestAnimationFrame(() => {
        input.setSelectionRange(input.value.length, input.value.length);
        updateCursor();
      });
    } else if (e.key === "Tab" && input.value.trim() && !e.shiftKey) {
      e.preventDefault();
      complete();
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      out.innerHTML = "";
    } else if (e.ctrlKey && e.key.toLowerCase() === "c" && input.selectionStart === input.selectionEnd) {
      e.preventDefault();
      print([[`${S.cwd} $ `, "p"], input.value + "^C"], "echo", true);
      input.value = "";
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
    requestAnimationFrame(updateCursor);
  });
  ["input", "keyup", "click", "focus", "select", "scroll"].forEach((ev) => sc.on(input, ev, updateCursor));

  sc.on(el, "click", (e) => {
    const b = e.target.closest("[data-cmd]");
    if (b) {
      run(b.dataset.cmd);
      if (S.finePointer) input.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest("a, button, input") || String(getSelection())) return;
    input.focus({ preventScroll: true });
  });
  sc.on($("#termClose"), "click", close);
  sc.on(fab, "click", open);
  sc.on(document, "keydown", (e) => {
    if (e.ctrlKey && !e.altKey && !e.metaKey && (e.key === "`" || e.code === "Backquote")) {
      e.preventDefault();
      toggle();
    }
  });
  if (window.visualViewport) {
    sc.on(window.visualViewport, "resize", syncKeyboard);
    sc.on(window.visualViewport, "scroll", syncKeyboard);
  }
  sc.defer(() => {
    if (!el.hidden) {
      el.hidden = true;
      fab.hidden = false;
    }
  });
  return { open, close, run, paintPrompt };
}

/* ───────────────────────── 7. CURSOR, MAGNETIC BUTTONS, COPY, EASTER EGGS ───────────────────────── */
function initCursor(sc) {
  if (!S.finePointer || S.reduced) return;
  const ring = $("#curRing");
  const dot = $("#curDot");
  if (!ring || !dot) return;
  let x = -100;
  let y = -100;
  let rx = -100;
  let ry = -100;
  let raf = 0;
  let shown = false;
  root().classList.add("has-cursor");
  const show = (on) => {
    ring.classList.toggle("on", on);
    dot.classList.toggle("on", on);
  };
  const loop = () => {
    rx += (x - rx) * 0.24;
    ry += (y - ry) * 0.24;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 && sc.alive ? requestAnimationFrame(loop) : 0;
  };
  sc.on(
    window,
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        show(true);
      }
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (!raf) raf = requestAnimationFrame(loop);
      const t = e.target instanceof Element ? e.target : null;
      const overText = !!(t && t.closest("input, textarea"));
      ring.classList.toggle("lock", !!(t && t.closest("a, button, .badge, label")));
      ring.style.visibility = dot.style.visibility = overText ? "hidden" : "";
    },
    { passive: true },
  );
  sc.on(root(), "mouseleave", () => {
    shown = false;
    show(false);
  });
  sc.on(window, "pointerdown", () => ring.classList.add("down"));
  sc.on(window, "pointerup", () => ring.classList.remove("down"));
  sc.defer(() => {
    cancelAnimationFrame(raf);
    root().classList.remove("has-cursor");
    show(false);
  });
}

function initMagnets(sc) {
  if (!S.finePointer || S.reduced) return;
  let current = null;
  const reset = (b) => {
    b.style.setProperty("--bx", "0px");
    b.style.setProperty("--by", "0px");
  };
  sc.on(
    document,
    "pointermove",
    (e) => {
      const b = e.target instanceof Element ? e.target.closest(".btn") : null;
      if (current && current !== b) reset(current);
      current = b;
      if (!b) return;
      const r = b.getBoundingClientRect();
      b.style.setProperty("--bx", `${((e.clientX - r.left) / r.width - 0.5) * 10}px`);
      b.style.setProperty("--by", `${((e.clientY - r.top) / r.height - 0.5) * 8}px`);
    },
    { passive: true },
  );
}

function initCopy(sc) {
  sc.on(document, "click", async (e) => {
    const b = e.target instanceof Element ? e.target.closest("[data-copy]") : null;
    if (!b) return;
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      toast("Copied to clipboard");
    } catch (err) {
      const link = b.parentElement.querySelector("a");
      if (link) {
        const r = document.createRange();
        r.selectNodeContents(link);
        const s = getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }
      toast("Address selected. Press Ctrl + C to copy it.");
    }
  });
}

function initEggs(sc) {
  const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let k = 0;
  sc.on(document, "keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    k = key === KONAMI[k] ? k + 1 : key === KONAMI[0] ? 1 : 0;
    if (k < KONAMI.length) return;
    k = 0;
    const red = !root().classList.contains("redteam");
    setTheme(red);
    toast(red ? "Red team mode engaged. Scope: this page only." : "Back to blue team. Shields up.");
    S.soc.log(red ? "critical" : "blocked", red ? "Operator switched sides: red team mode" : "Operator back on the blue team");
  });

  if (!window.__consoleGreeted) {
    window.__consoleGreeted = true;
    const art = [
      "    .-------.",
      "   /  .---.  \\",
      "   |  |   |  |",
      " .-'--'---'--'-.",
      " |    .---.    |",
      " |    | o |    |     " + NAME(),
      " |    '-|-'    |     " + ((S.data && S.data.titles[0]) || ""),
      " '-------------'",
      "",
    ].join("\n");
    try {
      console.log("%c" + art, "color:#00ff9c;font-family:monospace;font-size:12px;line-height:1.25");
      console.log("%cYou opened the console. Good instinct.", "color:#00ff9c;font:600 14px monospace");
      console.log(
        "%cThere is a flag hidden on this site. Start in the terminal (Ctrl + `) with:  ls -a\nThen decode what you find and run:  submit <flag>",
        "color:#94a5a3;font:12px monospace",
      );
    } catch (e) {
      /* console unavailable */
    }
  }

  if (store.get("flag")) captureFlag(true);

  /* Tab title while the visitor is away */
  let saved = "";
  sc.on(document, "visibilitychange", () => {
    if (document.hidden) {
      saved = document.title;
      document.title = `Session locked | ${NAME()}`;
    } else if (saved) {
      document.title = saved;
    }
  });
}

/* ───────────────────────── 8. PAGE: REVEALS, TYPED COMMANDS, ACTIVE SECTION ───────────────────────── */
async function typeCmd(p, sc) {
  const out = $(".cmd-text", p);
  const text = p.dataset.cmd;
  if (!out) return;
  out.textContent = "";
  p.classList.add("typed");
  if (S.reduced) {
    out.textContent = text;
    return;
  }
  const caret = document.createElement("span");
  caret.className = "caret";
  caret.setAttribute("aria-hidden", "true");
  p.appendChild(caret);
  sc.defer(() => {
    out.textContent = text;
    caret.remove();
  });
  for (let i = 1; i <= text.length; i++) {
    if (!sc.alive) return;
    out.textContent = text.slice(0, i);
    await sc.sleep(18 + Math.random() * 26);
  }
  await sc.sleep(500);
  caret.remove();
}

function initReveals(sc) {
  const reveals = $$("#main .reveal");
  if (!("IntersectionObserver" in window) || root().hasAttribute("data-fallback")) {
    reveals.forEach((el) => el.classList.add("in"));
    $$("#main .cmd").forEach((p) => p.classList.add("typed"));
    return;
  }
  const io = sc.observe(
    new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
          $$("[data-scramble]", e.target).forEach((b) => scramble(b, b.dataset.scramble, 900, sc));
        }),
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    ),
  );
  reveals.forEach((el) => io.observe(el));

  const cmdIO = sc.observe(
    new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            cmdIO.unobserve(e.target);
            typeCmd(e.target, sc);
          }
        }),
      { threshold: 0.8 },
    ),
  );
  $$("#main .cmd").forEach((p) => {
    if (p.classList.contains("typed")) return;
    cmdIO.observe(p);
  });
}

function initSpy(sc) {
  if (!isHome()) {
    $$("#tree a[data-sec]").forEach((a) => a.setAttribute("aria-current", "false"));
    S.activeSection = "";
    return;
  }
  const ids = S.data.sections.map((s) => s.id);
  const spy = sc.observe(
    new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id === "top" ? "" : e.target.id);
        }),
      { rootMargin: "-45% 0px -54% 0px" },
    ),
  );
  ["top", ...ids].forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });
  sc.defer(() => {
    S.activeSection = "";
    $$("#tree a[data-sec]").forEach((a) => a.setAttribute("aria-current", "false"));
  });
}

/* ───────────────────────── 9. HERO: NAME, TYPED TITLES, NETWORK GRAPH ───────────────────────── */
async function typeLoop(el, items, sc) {
  if (S.reduced || items.length < 2) {
    el.textContent = items[0] || "";
    return;
  }
  for (let i = 0; sc.alive; i++) {
    const t = items[i % items.length];
    for (let k = 1; k <= t.length && sc.alive; k++) {
      el.textContent = t.slice(0, k);
      await sc.sleep(46 + Math.random() * 44);
    }
    await sc.sleep(1800);
    for (let k = t.length; k >= 0 && sc.alive; k--) {
      el.textContent = t.slice(0, k);
      await sc.sleep(20);
    }
    await sc.sleep(280);
  }
}

function initHero(sc) {
  const hero = $("#top");
  const nameEl = $("#heroName span");
  if (!hero || !nameEl) return;
  const typed = $("#typed");
  (S.booted || Promise.resolve()).then(() => {
    if (!sc.alive) return;
    scramble(nameEl, NAME(), 1300, sc);
    if (typed) typeLoop(typed, S.data.titles, sc);
  });
  sc.defer(() => {
    nameEl.textContent = NAME();
    if (typed) typed.textContent = S.data.titles[0] || "";
  });
  initNet(sc, hero);
}

/* Network graph: nodes drift, link when close, lean away from the pointer; now and then one
   lights up as a threat and is "contained". Paused when the hero is off screen. */
function initNet(sc, hero) {
  const cv = $("#net");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const LINK = 150;
  const mouse = { x: -9999, y: -9999 };
  const C = S.C;
  let W = 0;
  let H = 0;
  let nodes = [];
  let packets = [];
  let running = false;
  let onScreen = true;
  let raf = 0;
  let tPrev = 0;
  let nextHot = 1800;
  let nextPacket = 500;

  function resize() {
    const r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const widthChanged = Math.abs(r.width - W) > 1;
    W = r.width;
    H = r.height;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (widthChanged || !nodes.length) {
      const n = Math.round(clamp((W * H) / 9500, 26, 120));
      nodes = Array.from({ length: n }, () => ({ x: rand(0, W), y: rand(0, H), vx: rand(-0.16, 0.16), vy: rand(-0.16, 0.16), r: rand(1, 2.1), hot: 0 }));
      packets = [];
    }
    draw(0);
  }
  function draw(dt) {
    ctx.clearRect(0, 0, W, H);
    if (dt)
      for (const n of nodes) {
        n.x += n.vx * dt * 0.06;
        n.y += n.vy * dt * 0.06;
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500 && d2 > 1) {
          const d = Math.sqrt(d2);
          const f = (1 - d / 150) * 0.7;
          n.x += (dx / d) * f;
          n.y += (dy / d) * f;
        }
        if (n.x < -20) n.x = W + 20;
        else if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        else if (n.y > H + 20) n.y = -20;
        if (n.hot > 0) n.hot = Math.max(0, n.hot - dt / 2600);
      }
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          ctx.strokeStyle = rgb(C.accent, (1 - Math.sqrt(d2) / LINK) * 0.3);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    for (const n of nodes) {
      const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
      if (d < 190) {
        ctx.strokeStyle = rgb(C.accent, (1 - d / 190) * 0.5);
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
    for (const n of nodes) {
      if (n.hot > 0) {
        const col = n.hot > 0.45 ? C.alert : C.accent;
        ctx.strokeStyle = rgb(col, Math.min(1, n.hot * 2) * 0.7);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 5 + (1 - n.hot) * 16, 0, 6.283);
        ctx.stroke();
        ctx.fillStyle = rgb(col, 0.95);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.6, 0, 6.283);
        ctx.fill();
      } else {
        ctx.fillStyle = rgb(C.accent, 0.7);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 6.283);
        ctx.fill();
      }
    }
    for (const p of packets) {
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.fillStyle = rgb(C.accent, 1 - Math.abs(p.t - 0.5) * 1.4);
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, 6.283);
      ctx.fill();
    }
  }
  function spawnPacket() {
    const a = pick(nodes);
    let best = null;
    let bd = LINK * LINK;
    for (const b of nodes) {
      if (b === a) continue;
      const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
      if (d2 < bd && Math.random() < 0.6) {
        best = b;
        bd = d2;
      }
    }
    if (best) packets.push({ a, b: best, t: 0, dur: rand(500, 900) });
  }
  function loop(t) {
    if (!sc.alive) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(50, t - (tPrev || t));
    tPrev = t;
    if ((nextHot -= dt) <= 0) {
      pick(nodes).hot = 1;
      nextHot = rand(2600, 5200);
    }
    if ((nextPacket -= dt) <= 0) {
      spawnPacket();
      nextPacket = rand(300, 800);
    }
    packets = packets.filter((p) => (p.t += dt / p.dur) < 1);
    draw(dt);
  }
  function sync() {
    const want = onScreen && !document.hidden && !S.reduced && sc.alive;
    if (want && !running) {
      running = true;
      tPrev = 0;
      raf = requestAnimationFrame(loop);
    } else if (!want && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  sc.on(hero, "pointermove", (e) => {
    const r = cv.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  sc.on(hero, "pointerleave", () => {
    mouse.x = mouse.y = -9999;
  });
  if ("ResizeObserver" in window) sc.observe(new ResizeObserver(resize)).observe(cv);
  else sc.on(window, "resize", resize);
  if ("IntersectionObserver" in window)
    sc.observe(
      new IntersectionObserver((es) => {
        onScreen = es[0].isIntersecting;
        sync();
      }),
    ).observe(hero);
  sc.on(document, "visibilitychange", sync);
  const repaint = () => {
    if (!running) draw(0);
  };
  S.themeListeners.add(repaint);
  sc.defer(() => {
    S.themeListeners.delete(repaint);
    cancelAnimationFrame(raf);
    running = false;
  });
  resize();
  sync();
}

/* ───────────────────────── 10. SKILLS: AUDIT RUN + RADAR ───────────────────────── */
function initSkills(sc) {
  const list = $("#auditList");
  if (!list) return;
  const rows = $$(".audit-row", list);
  const state = $("#auditState");
  const sum = $("#auditSum");
  const radar = $("#radar");
  rows.forEach((row) => {
    row.classList.remove("run", "done");
    $(".audit-tag", row).textContent = "[ -- ]";
    $(".audit-pct", row).textContent = "--";
  });
  if (sum) sum.textContent = "";
  let ran = false;
  async function run() {
    if (ran) return;
    ran = true;
    state.textContent = "scanning";
    state.className = "warn";
    for (const row of rows) {
      if (!sc.alive) return;
      const lvl = +row.dataset.level;
      const tag = $(".audit-tag", row);
      const pct = $(".audit-pct", row);
      row.classList.add("run");
      tag.textContent = "[SCAN]";
      if (!S.reduced) {
        const t0 = performance.now();
        const dur = 360;
        for (let k = 0; k < 1 && sc.alive; ) {
          k = clamp((performance.now() - t0) / dur, 0, 1);
          pct.textContent = Math.round(lvl * k) + "%";
          await nextFrame();
        }
      }
      pct.textContent = lvl + "%";
      row.classList.replace("run", "done");
      tag.textContent = "[PASS]";
    }
    state.textContent = "secure";
    state.className = "ok";
    await typeSegs(sum, ["> ", [`${rows.length}/${rows.length} checks passed`, "ok"], ", 0 vulnerabilities found\n> overall posture: ", ["SECURE", "ok"]], 2, sc);
  }
  if ("IntersectionObserver" in window) {
    const io = sc.observe(
      new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            if (e.target === list) run();
            else if (radar) radar.classList.add("in");
          }),
        { threshold: 0.25 },
      ),
    );
    io.observe(list);
    if (radar) io.observe(radar);
  } else {
    run();
    if (radar) radar.classList.add("in");
  }
}

/* ───────────────────────── 11. SOC DASHBOARD (everything here is simulated) ───────────────────────── */
/* Simplified coastlines as flat [lon, lat, lon, lat, ...] rings; rasterised into the dotted map at load. */
const LAND = [
  /* North + Central America */ [-168,66,-162,68,-156,71,-141,70,-128,70,-116,69,-108,68,-96,68,-93,71,-85,69,-82,67,-87,64,-93,61,-94,58,-88,56.5,-82,55,-79,51.5,-78,55,-77,60,-78,62.5,-73,62,-69,59,-64,60,-61,56,-56,52,-59,49,-65,48.5,-61,46,-66,44.5,-70,43.5,-70,41.5,-74,40,-76,37,-76,35,-81,31.5,-80,27,-81,25,-82.5,28,-84,30,-89,30,-94,29.5,-97,27.5,-97.5,22,-96,19,-91.5,18.5,-90.5,21,-87,21.5,-88,16,-84,15.5,-83.5,11,-81,8.5,-77.5,8.5,-78,7,-81,7.5,-83,8.5,-86,11,-88,13,-92,14.5,-95,16,-100,17,-105,19.5,-106,23,-109,26,-112.5,30,-114.5,31.5,-114.5,30,-112,27,-110,24,-110,23,-112,25,-115,29,-117,32.5,-120.5,34.5,-123,38,-124.5,42,-124,47,-127,50,-131,54,-135,58,-141,60,-147,60.5,-152,58.5,-158,56.5,-164,54.5,-160,58,-164,60,-166,63,-162,64,-166,65.5],
  /* South America */ [-77.5,8.5,-75,11,-72,12,-70,11.5,-64,10.5,-61,10,-57,6,-52,5,-50,1,-48,-1,-44,-2.5,-39,-3.5,-35,-5.5,-35,-9,-38,-13,-39,-18,-41,-22,-45,-24,-48.5,-27,-52,-32,-54,-34.5,-57,-36,-58,-38.5,-62,-39,-63,-42,-65.5,-45.5,-66,-48,-69,-51,-68.5,-53,-71,-54,-74.5,-52,-75,-47,-73,-42,-73.5,-37,-71.5,-31,-70.5,-24,-70.5,-18.5,-76,-14,-79,-8,-81,-5,-80,-2,-80,1,-78,2.5,-77.5,6],
  /* Greenland */ [-70,78,-60,76,-55,70,-52,65,-48,61,-44,60,-41,63,-38,65.5,-30,68,-23,70,-20,74,-19,78],
  /* Iceland */ [-24,65.5,-22,64,-18,63.5,-14,64.5,-15,66,-20,66.5],
  /* Baffin */ [-88,73,-78,73.5,-68,70,-62,66.5,-66,62.5,-72,64,-78,65.5,-80,69.5,-88,70.5],
  /* Victoria Island */ [-118,73,-106,73,-102,70.5,-112,69.5,-118,71],
  /* Africa */ [-6,35.5,-2,35.2,3,36.8,10,37.2,11,33.5,15,32.3,19,30.5,20,32.5,23,32.5,25,31.6,29,31,32,31.3,32.5,30,34,27,35.5,24,37,21,38.5,18,40,15,43,12,43.5,11.5,45,10.5,51,12,51,10.5,48,5,45,2,42,-1,40,-4,39,-7,40,-11,40.5,-15,36,-19,35,-24,33,-26,32,-29,28,-33,24,-34,20,-34.8,18,-33.5,17,-29,15,-26,14,-22,12,-17,13.5,-12,12,-6,9,-1,9.5,3,8.5,4.5,5,6,1,6,-4,5,-8,4.5,-11,7,-13,9,-15,11,-17,14.5,-16.5,18,-16,21,-17,21.5,-15,24,-13,27.5,-10,29.5,-9.5,32,-7,34],
  /* Madagascar */ [44,-16,47,-13.5,49.5,-12.5,50.5,-16,49,-20,47,-25,44.5,-25,43.5,-22,44,-19],
  /* Eurasia */ [-9,37,-9.5,39,-9,43,-2,43.5,-1.2,46,-4.5,48.3,-1.5,48.7,1,50,3,51.3,5,53.3,8.5,54,8,57,10.5,57.7,10.5,56,10,54.5,12,54,14,54,18.5,54.7,21,55,21,57.5,24,57.5,23.5,59.3,28,59.7,30,60,28,60.5,23,60,21.5,61,21.5,63,25,65,24,65.8,22,65.5,17.5,62,17,60.5,18.5,59.5,16.5,57,16,56,13,55.5,12.5,56.5,11,59,8,58,5.5,59,5,62,9,64,12,66,14,68,18,69.8,23,70.8,28,71,31,70,33,69.3,41,67.5,40,65,44,66.3,44.5,68,53,68.5,60,69,66,69,68,71.5,73,71.5,73,73,80,73,87,75,100,77.5,106,77.5,112,76,113,73.5,125,73.5,130,71,140,72.5,150,71.5,160,70,170,70,180,69,180,65,178,64.5,175,62.5,170,60,165,59.8,162,58,163,56,160,53,157,51,156,54,155.5,57,157.5,58.5,161,60.2,163,62,158,61.7,154,59.5,148,59.3,142,59,135.5,54.7,138,54,141,53,140,48,135.5,44,132.5,43,130,42.5,129.5,40.5,127.5,39.5,129.5,36.5,129,35,126.5,34.5,126,37,125,38.5,124.5,40,121.6,38.9,122.2,40.6,121,40.9,119.5,39.8,117.8,39,119,37.5,122.5,37.2,119.5,35,121,32,122,30,120,27,118,24.5,114,22.5,110.5,21,108,21.5,106,19,108.5,15.5,109.5,12.5,107,10.5,105,9,104.5,10.5,101,13,100,13.5,99.5,10,101,6.5,103.5,4.5,104,1.5,101,2.5,98.5,8,98.5,12,97.5,16.5,94.5,16,94,19,91.5,22.5,89,22,86.5,20,82,16,80,13.5,80,10,77.5,8,76,10.5,74.5,14,73,17.5,72.7,21,70,21,68.5,23.5,66.5,25.3,61.5,25.2,57,25.7,56.3,27,54,26.7,51.5,27.8,50,30,48.5,30,48,28.5,50.5,25,51.5,26,51.6,24.3,54,24,56,26,56.5,24.5,58.5,23.5,59.8,22.5,58.5,20.5,57.5,19,55,17,52,16,48.5,14,45,12.8,43.3,12.7,42.7,15,40.5,19.5,39,22,37,25,35,28,34.8,29.5,34,28,32.6,30,32.3,31.2,34.3,31.3,35,33,36,35.8,36,36.8,33,36.2,30.5,36.5,28,36.7,27,37.5,26.5,39.5,26,40.2,29,41,31,41.2,35,42,38,41,41.5,41.5,41.5,43,39,44.3,37.5,45.3,39,47,37,46.8,35.5,45.3,33.5,44.5,33,46,30.5,46.3,29.5,45,28,43.5,28,41.8,26.2,40.7,24,40.8,22.8,40.3,23.5,38.5,23,36.5,21.5,37,21,39,19.5,40.5,19.5,42,16,43.5,13.5,45.5,12.3,45.3,12.5,44,14,42.3,16,41.7,18.5,40.2,17,39.5,16.5,38,15.7,38,16,39.7,14.5,40.7,12.5,41.5,10.5,43,9,44.3,6.5,43.2,3.5,43.3,3,41.8,0.5,40.5,-0.5,38.5,-2,36.8,-5,36.3,-6,36.7],
  /* Great Britain */ [-5.5,50,-3,50.5,1.5,51.2,1.7,52.7,0,53.5,-1.5,55,-2,56,-2,57.7,-4,57.7,-3,58.6,-5,58.6,-6,57,-5.5,55.5,-3.5,54.8,-3,53.4,-4.7,53.2,-4.3,52,-5.2,51.8,-3.3,51.4],
  /* Ireland */ [-10,52,-6.3,52.2,-6,54,-6.3,55.2,-8.2,55.2,-10,54],
  /* Novaya Zemlya */ [52,71,57,70.6,55.5,73,60,75.5,68.5,76.8,62,76.3,55,74.5,53,72.5],
  /* Chukotka, east of the date line */ [-180,65,-180,69,-175,67.5,-170,66,-172.5,64.5,-176,65.5],
  /* Japan */ [130,31.5,131.5,31.5,132,33.5,135,33.5,137,34.7,139,35,140.8,35.7,141,38,142,39.5,141.5,41.3,140.2,41,140,39,138.5,37.5,137,37,136,36,133,35.5,131,34.3,129.7,33],
  /* Hokkaido */ [140,42,141,43,141.7,45.3,143.5,44.2,145.5,43.5,144,43,143,42,141,42.5],
  /* Sakhalin */ [142,46,143.5,47.5,143,49.5,144,50,143,54,142,53,142,49,141.8,47],
  /* Taiwan */ [120,23,121,25,122,25,121,22],
  /* Luzon */ [120,16,121,18.5,122.3,18.3,122,15,124,13,123,12.5,121,14],
  /* Mindanao */ [122,7,124,8.5,126.3,9,126.3,6.5,125,5.8,124,7],
  /* Sumatra */ [95.3,5.5,98,4,103,0,106,-3,105.5,-5.8,102,-4,98.5,0.5,96,3.5],
  /* Borneo */ [109,1.5,112,3,115,5,117,7,119,5,118,1,116.5,-3.5,114,-4,110.5,-3,109,-0.5],
  /* Java */ [105.5,-6.5,108,-6.5,111,-6.5,114.5,-7.5,114.5,-8.5,110,-8,106,-7.3],
  /* Sulawesi */ [119,-3,120,1,124.8,1.5,121,-0.5,122.8,-4.5,121,-5,120.3,-3,120,-5.5],
  /* New Guinea */ [131,-0.8,134,-0.8,135.5,-3.3,138,-1.7,141,-2.6,145,-4.5,147.5,-6,147,-7,150.5,-10.5,147,-9.5,144,-7.7,141,-9,138.5,-8,138,-5.5,133,-4,132,-2.8],
  /* Sri Lanka */ [80,9.7,81.8,7.5,81,6,80,6,79.8,8],
  /* Australia */ [113.5,-22,114,-26.5,115.7,-31.8,115,-34.3,118,-35,123.5,-33.9,129,-31.6,131.5,-31.5,135.5,-34.8,137.8,-32.8,138,-35.5,140.5,-38,143.5,-38.8,146.5,-39,150,-37.5,151.5,-33.5,153.5,-28.5,153,-25,149.5,-22,146,-19,145.5,-15,143.5,-14.2,142.5,-10.8,141.5,-13,141,-17.5,139,-17.5,135.5,-15,136.8,-12.2,132.5,-11.3,130,-12.5,129.5,-14.8,127,-14,125,-15.5,122.3,-18,119,-20,116,-21],
  /* Tasmania */ [144.7,-40.8,148.3,-40.8,148,-43.3,146,-43.6,145.2,-42],
  /* New Zealand, north */ [172.7,-34.5,174.5,-36.5,176,-37.5,178.5,-37.7,177,-39.5,175.3,-41.6,174.8,-39.5,173.8,-39.3,174.7,-37.5],
  /* New Zealand, south */ [172.7,-40.6,174.3,-41.7,172.8,-43.8,171,-45.5,169,-46.6,166.5,-46,168,-44,171,-42],
  /* Cuba */ [-84.8,21.9,-82,23.1,-79,22.4,-74.3,20.2,-77.7,19.9,-78,20.7,-80.5,21.8],
  /* Hispaniola */ [-74.4,18.5,-72.8,19.9,-69.9,19.7,-68.4,18.6,-71,18.2,-73.5,18.2],
].map((pts) => {
  let x0 = 999;
  let x1 = -999;
  let y0 = 999;
  let y1 = -999;
  for (let i = 0; i < pts.length; i += 2) {
    x0 = Math.min(x0, pts[i]);
    x1 = Math.max(x1, pts[i]);
    y0 = Math.min(y0, pts[i + 1]);
    y1 = Math.max(y1, pts[i + 1]);
  }
  return { pts, x0, x1, y0, y1 };
});
const CASPIAN = [49, 46.5, 52.5, 46.8, 53, 45, 51, 44.5, 52.8, 42, 53.8, 40.5, 53.8, 37.2, 51.5, 36.7, 49, 37.5, 49.5, 40.5, 47.5, 43, 47, 45];

function inRing(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) {
    const xi = pts[i];
    const yi = pts[i + 1];
    const xj = pts[j];
    const yj = pts[j + 1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const isLand = (lon, lat) => !inRing(lon, lat, CASPIAN) && LAND.some((p) => lon >= p.x0 && lon <= p.x1 && lat >= p.y0 && lat <= p.y1 && inRing(lon, lat, p.pts));

/* name, country code, lon, lat */
const CITIES = [
  ["São Paulo", "BR", -46.6, -23.5], ["New York", "US", -74, 40.7], ["San Francisco", "US", -122.4, 37.8],
  ["Toronto", "CA", -79.4, 43.7], ["Mexico City", "MX", -99.1, 19.4], ["Buenos Aires", "AR", -58.4, -34.6],
  ["London", "GB", -0.1, 51.5], ["Madrid", "ES", -3.7, 40.4], ["Stockholm", "SE", 18.1, 59.3],
  ["Istanbul", "TR", 29, 41], ["Moscow", "RU", 37.6, 55.8], ["Lagos", "NG", 3.4, 6.5],
  ["Johannesburg", "ZA", 28, -26.2], ["Cairo", "EG", 31.2, 30], ["Dubai", "AE", 55.3, 25.2],
  ["Mumbai", "IN", 72.9, 19.1], ["Jakarta", "ID", 106.8, -6.2], ["Hong Kong", "HK", 114.2, 22.3],
  ["Beijing", "CN", 116.4, 39.9], ["Seoul", "KR", 127, 37.6], ["Tokyo", "JP", 139.7, 35.7],
  ["Sydney", "AU", 151.2, -33.9], ["Los Angeles", "US", -118.2, 34], ["Nairobi", "KE", 36.8, -1.3],
];
const dotCache = {};

function initSOC(sc) {
  const sec = $("#soc");
  const cv = $("#map");
  if (!sec || !cv) return;
  const ctx = cv.getContext("2d");
  const base = document.createElement("canvas");
  const bctx = base.getContext("2d");
  const feed = $("#feed");
  const blockedEl = $("#blocked");
  const epsEl = $("#eps");
  const spark = $("#spark");
  const sctx = spark.getContext("2d");
  const C = S.C;
  const LAT_T = 78;
  const LAT_B = -56;
  const home = (S.data.soc && S.data.soc.home) || { label: "SOC", lon: 10.18, lat: 36.81 };
  const SITES = [
    { label: home.label || "SOC", lon: +home.lon, lat: +home.lat },
    { label: "us-east", lon: -77.5, lat: 38.9 },
    { label: "ap-south", lon: 103.8, lat: 1.35 },
  ];
  const VECTORS = [
    { label: "SSH brute-force", msg: "SSH brute-force", n: 412, w: 5 },
    { label: "Port scan", msg: "Port scan (SYN, 1,024 ports)", n: 351, w: 4 },
    { label: "SQL injection", msg: "SQL injection attempt on /api/login", n: 268, w: 3 },
    { label: "Credential stuffing", msg: "Credential stuffing on the VPN portal", n: 190, w: 2 },
    { label: "C2 beacon", msg: "Malware C2 beacon", n: 74, w: 1 },
  ];
  let W = 0;
  let H = 0;
  let running = false;
  let onScreen = false;
  let raf = 0;
  let tPrev = 0;
  let nextSpawn = 300;
  let secAcc = 0;
  let burst = 0;
  let arcs = [];
  let rips = [];
  let blocked = 1284019 + ((Math.random() * 900) | 0);
  const vals = Array.from({ length: 48 }, (_, i) => Math.round(760 + Math.sin(i / 3.1) * 70 + rand(-60, 90)));
  const X = (lon) => ((lon + 180) / 360) * W;
  const Y = (lat) => ((LAT_T - lat) / (LAT_T - LAT_B)) * H;
  feed.innerHTML = "";
  $("#vecs").innerHTML = "";
  S.soc.recent = [];

  function landDots(step) {
    if (dotCache[step]) return dotCache[step];
    const out = [];
    let row = 0;
    for (let lat = LAT_T - step / 2; lat > LAT_B; lat -= step, row++) {
      for (let lon = -180 + step * (row % 2 ? 0.75 : 0.25); lon < 180; lon += step) if (isLand(lon, lat)) out.push(lon, lat);
    }
    return (dotCache[step] = out);
  }
  function paintBase() {
    const step = W < 420 ? 4 : W < 720 ? 3 : 2.4;
    const pts = landDots(step);
    const r = clamp((W / (360 / step)) * 0.27, 0.7, 1.7);
    bctx.clearRect(0, 0, W, H);
    bctx.strokeStyle = rgb(C.accent, 0.06);
    bctx.lineWidth = 1;
    bctx.beginPath();
    for (let lon = -150; lon < 180; lon += 30) {
      bctx.moveTo(X(lon), 0);
      bctx.lineTo(X(lon), H);
    }
    for (let lat = 60; lat > LAT_B; lat -= 30) {
      bctx.moveTo(0, Y(lat));
      bctx.lineTo(W, Y(lat));
    }
    bctx.stroke();
    bctx.fillStyle = rgb(C.accent, 0.42);
    bctx.beginPath();
    for (let i = 0; i < pts.length; i += 2) {
      const x = X(pts[i]);
      const y = Y(pts[i + 1]);
      bctx.moveTo(x + r, y);
      bctx.arc(x, y, r, 0, 6.283);
    }
    bctx.fill();
  }
  function size() {
    const r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width;
    H = r.height;
    for (const c of [cv, base]) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBase();
    const sr = spark.getBoundingClientRect();
    spark.width = Math.round(sr.width * dpr);
    spark.height = Math.round(sr.height * dpr);
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSpark();
    paint(performance.now());
  }
  function curve(a) {
    const x1 = X(a.s[2]);
    const y1 = Y(a.s[3]);
    const x2 = X(a.d.lon);
    const y2 = Y(a.d.lat);
    const d = Math.hypot(x2 - x1, y2 - y1);
    return { x1, y1, x2, y2, cx: (x1 + x2) / 2, cy: (y1 + y2) / 2 - d * 0.3 };
  }
  function drawArc(a, from, to, alpha) {
    const q = curve(a);
    const N = 18;
    let px = 0;
    let py = 0;
    for (let i = 0; i <= N; i++) {
      const t = from + ((to - from) * i) / N;
      const u = 1 - t;
      const x = u * u * q.x1 + 2 * u * t * q.cx + t * t * q.x2;
      const y = u * u * q.y1 + 2 * u * t * q.cy + t * t * q.y2;
      if (i) {
        ctx.strokeStyle = rgb(C.alert, alpha * (0.06 + (0.9 * i) / N));
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      px = x;
      py = y;
    }
    return [px, py];
  }
  function paint(t) {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(base, 0, 0, W, H);
    ctx.lineWidth = 1.3;
    for (const a of arcs) {
      const head = Math.min(1, a.t);
      const tail = S.reduced ? 0 : Math.max(0, a.t - 0.45);
      const [hx, hy] = drawArc(a, tail, head, S.reduced ? 0.55 : 1);
      if (a.t < 1) {
        ctx.fillStyle = rgb(C.alert, 1);
        ctx.beginPath();
        ctx.arc(hx, hy, 2, 0, 6.283);
        ctx.fill();
      }
    }
    for (const r of rips) {
      if (r.t < 0) continue;
      ctx.strokeStyle = rgb(r.col, 1 - r.t);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(X(r.lon), Y(r.lat), r.r0 + (r.r1 - r.r0) * r.t, 0, 6.283);
      ctx.stroke();
    }
    ctx.font = `500 10px ${C.mono}`;
    ctx.textBaseline = "middle";
    SITES.forEach((s, i) => {
      const x = X(s.lon);
      const y = Y(s.lat);
      const k = S.reduced ? 0.5 : (t / 1800 + i * 0.33) % 1;
      ctx.strokeStyle = rgb(C.accent, 0.5 * (1 - k));
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 4 + k * 12, 0, 6.283);
      ctx.stroke();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = rgb(C.accent, 1);
      ctx.fillRect(-3, -3, 6, 6);
      ctx.restore();
      if (W > 460 || i === 0) {
        const tw = ctx.measureText(s.label).width;
        ctx.fillStyle = "rgb(5 7 10 / .78)";
        ctx.fillRect(x + 8, y - 8, tw + 8, 16);
        ctx.fillStyle = rgb(C.accent, 1);
        ctx.fillText(s.label, x + 12, y + 0.5);
      }
    });
  }
  function drawSpark() {
    const r = spark.getBoundingClientRect();
    const w = r.width;
    const h = r.height;
    if (!w) return;
    const lo = 500;
    const hi = 1500;
    const n = vals.length;
    const px = (i) => (i / (n - 1)) * w;
    const py = (v) => h - 4 - ((clamp(v, lo, hi) - lo) / (hi - lo)) * (h - 10);
    sctx.clearRect(0, 0, w, h);
    sctx.strokeStyle = rgb(C.accent, 0.1);
    sctx.lineWidth = 1;
    sctx.beginPath();
    for (let g = 1; g <= 3; g++) {
      const y = Math.round((h * g) / 4) + 0.5;
      sctx.moveTo(0, y);
      sctx.lineTo(w, y);
    }
    sctx.stroke();
    sctx.beginPath();
    vals.forEach((v, i) => (i ? sctx.lineTo(px(i), py(v)) : sctx.moveTo(px(i), py(v))));
    sctx.strokeStyle = rgb(C.accent, 0.95);
    sctx.lineWidth = 1.5;
    sctx.lineJoin = "round";
    sctx.stroke();
    sctx.lineTo(w, h);
    sctx.lineTo(0, h);
    sctx.closePath();
    const g = sctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, rgb(C.accent, 0.28));
    g.addColorStop(1, rgb(C.accent, 0));
    sctx.fillStyle = g;
    sctx.fill();
    sctx.fillStyle = rgb(C.accent, 1);
    sctx.beginPath();
    sctx.arc(w - 3, py(vals[n - 1]), 3, 0, 6.283);
    sctx.fill();
  }
  function paintVectors() {
    const max = Math.max(...VECTORS.map((v) => v.n));
    const box = $("#vecs");
    if (!box.children.length) {
      box.innerHTML = VECTORS.map((v) => `<div class="vec"><span>${esc(v.label)}</span><div class="bar"><i></i></div><b></b></div>`).join("");
    }
    VECTORS.forEach((v, i) => {
      const row = box.children[i];
      $("i", row).style.setProperty("--v", (v.n / max).toFixed(3));
      $("b", row).textContent = v.n.toLocaleString("en-US");
    });
  }
  function log(kind, text, when) {
    const tag = kind === "blocked" ? ["BLOCKED", "ok"] : kind === "flagged" ? ["FLAGGED", "warn"] : ["CRITICAL", "err"];
    const li = document.createElement("li");
    li.innerHTML = `<time>${when || nowTime()}</time><b class="${tag[1]}">[${tag[0]}]</b>${esc(text)}`;
    feed.appendChild(li);
    while (feed.children.length > 14) feed.firstElementChild.remove();
    S.soc.recent.push(`[${tag[0]}] ${text}`);
    if (S.soc.recent.length > 6) S.soc.recent.shift();
  }
  S.soc.log = (kind, text) => {
    log(kind, text);
    if (kind === "blocked") {
      blocked++;
      blockedEl.textContent = blocked.toLocaleString("en-US");
    }
  };
  function makeEvent() {
    const src = pick(CITIES);
    const site = Math.random() < 0.65 ? SITES[0] : pick(SITES);
    let roll = Math.random() * 15;
    let v = VECTORS[0];
    for (const c of VECTORS) {
      if ((roll -= c.w) <= 0) {
        v = c;
        break;
      }
    }
    const k = Math.random();
    return { s: src, d: site, v, kind: k < 0.8 ? "blocked" : k < 0.95 ? "flagged" : "critical", t: 0, dur: 0 };
  }
  function describe(a) {
    const ip = `${pick([185, 45, 103, 91, 193, 212, 5, 77, 141, 198])}.${(Math.random() * 254 + 1) | 0}.x.x`;
    const tail = a.kind === "flagged" ? ", rate-limited" : a.kind === "critical" ? ", host isolated" : "";
    return `${a.v.msg} from ${ip} (${a.s[0]}, ${a.s[1]})${tail}`;
  }
  function land(a) {
    if (a.kind === "blocked") {
      blocked += 1 + ((Math.random() * 6) | 0);
      blockedEl.textContent = blocked.toLocaleString("en-US");
    }
    log(a.kind, describe(a));
    a.v.n++;
    burst++;
    paintVectors();
    const col = a.kind === "blocked" ? C.accent : a.kind === "flagged" ? C.accent2 : C.alert;
    rips.push({ lon: a.d.lon, lat: a.d.lat, t: 0, dur: 750, r0: 3, r1: 20, col });
    if (a.kind === "critical") rips.push({ lon: a.d.lon, lat: a.d.lat, t: -0.3, dur: 750, r0: 3, r1: 30, col });
  }
  function spawn() {
    const a = makeEvent();
    if (Math.abs(a.s[2] - a.d.lon) < 8 && Math.abs(a.s[3] - a.d.lat) < 8) return;
    const q = curve(a);
    a.dur = clamp(Math.hypot(q.x2 - q.x1, q.y2 - q.y1) * 4.2, 1100, 2400);
    arcs.push(a);
    rips.push({ lon: a.s[2], lat: a.s[3], t: 0, dur: 500, r0: 1, r1: 8, col: C.alert });
  }
  function tick(t) {
    if (!sc.alive) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min(60, t - (tPrev || t));
    tPrev = t;
    if ((nextSpawn -= dt) <= 0) {
      if (arcs.length < 7) spawn();
      nextSpawn = rand(450, 1250);
    }
    if ((secAcc += dt) >= 1000) {
      secAcc = 0;
      const v = Math.round(760 + rand(-110, 130) + burst * 95);
      burst = 0;
      vals.push(v);
      vals.shift();
      epsEl.textContent = v.toLocaleString("en-US");
      drawSpark();
    }
    for (const a of arcs) {
      const was = a.t;
      a.t += dt / a.dur;
      if (was < 1 && a.t >= 1) land(a);
    }
    arcs = arcs.filter((a) => a.t < 1.45);
    for (const r of rips) r.t += dt / r.dur;
    rips = rips.filter((r) => r.t < 1);
    paint(t);
  }
  function sync() {
    const want = onScreen && !document.hidden && !S.reduced && sc.alive;
    if (want && !running) {
      running = true;
      tPrev = 0;
      raf = requestAnimationFrame(tick);
    } else if (!want && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  /* A realistic resting state before anything moves */
  blockedEl.textContent = blocked.toLocaleString("en-US");
  epsEl.textContent = vals[vals.length - 1].toLocaleString("en-US");
  paintVectors();
  const now = Date.now();
  for (let i = 7; i >= 0; i--) {
    const a = makeEvent();
    log(a.kind, describe(a), nowTime(new Date(now - i * 4200 - 1500)));
  }
  if (S.reduced) {
    arcs = Array.from({ length: 6 }, makeEvent).filter((a) => Math.abs(a.s[2] - a.d.lon) > 8);
    arcs.forEach((a) => {
      a.t = 1;
    });
  }

  if ("ResizeObserver" in window) sc.observe(new ResizeObserver(size)).observe(cv);
  else sc.on(window, "resize", size);
  if ("IntersectionObserver" in window)
    sc.observe(
      new IntersectionObserver(
        (es) => {
          onScreen = es[0].isIntersecting;
          sync();
        },
        { rootMargin: "100px" },
      ),
    ).observe(sec);
  else onScreen = true;
  sc.on(document, "visibilitychange", sync);
  const repaint = () => {
    if (W) {
      paintBase();
      drawSpark();
      paint(performance.now());
    }
  };
  S.themeListeners.add(repaint);
  sc.defer(() => {
    S.themeListeners.delete(repaint);
    cancelAnimationFrame(raf);
    running = false;
    S.soc.log = () => {};
    S.soc.recent = [];
  });
  size();
  sync();
}

/* ───────────────────────── 12. FILTERS: CASE FILES AND POSTS ───────────────────────── */
function initFilterSet(sc, { group, grid, itemSelector, search, stackChip, countEl, emptyEl, readUrl }) {
  if (!group || !grid) return;
  const items = $$(itemSelector, grid);
  const state = { cat: "All", query: "", stack: "" };
  let token = 0;
  const matches = (el) =>
    (state.cat === "All" || (el.dataset.cat || "").split(" ").includes(state.cat)) &&
    (!state.query || (el.dataset.search || el.textContent.toLowerCase()).includes(state.query)) &&
    (!state.stack || (el.dataset.stack || "").split("|").includes(state.stack));
  const finish = () => {
    const shown = items.filter((c) => !c.hidden).length;
    if (countEl) countEl.textContent = String(shown);
    if (emptyEl) emptyEl.hidden = shown > 0;
  };

  /* FLIP: leaving items fade, the rest slide to their new places */
  async function apply(animate = true) {
    const my = ++token;
    $$(".filter", group).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === state.cat)));
    if (!animate || S.reduced || !grid.animate) {
      items.forEach((c) => {
        c.hidden = !matches(c);
        c.classList.add("in");
      });
      finish();
      return;
    }
    const leaving = items.filter((c) => !c.hidden && !matches(c));
    await Promise.all(
      leaving.map((c) =>
        c
          .animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.94)" }], { duration: 170, easing: "ease-in", fill: "forwards" })
          .finished.catch(() => {}),
      ),
    );
    if (my !== token || !sc.alive) return;
    const before = new Map(items.filter((c) => !c.hidden && matches(c)).map((c) => [c, c.getBoundingClientRect()]));
    items.forEach((c) => {
      c.getAnimations().forEach((a) => a.cancel());
      c.hidden = !matches(c);
      c.classList.add("in");
    });
    items
      .filter((c) => !c.hidden)
      .forEach((c) => {
        const a = before.get(c);
        const b = c.getBoundingClientRect();
        if (a) {
          const dx = a.left - b.left;
          const dy = a.top - b.top;
          if (dx || dy) c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 440, easing: "cubic-bezier(.22,.8,.24,1)" });
        } else {
          c.animate([{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], { duration: 340, easing: "ease-out" });
        }
      });
    finish();
  }

  sc.on(group, "click", (e) => {
    const b = e.target.closest(".filter");
    if (!b) return;
    state.cat = b.dataset.filter;
    apply(true);
  });
  if (search) {
    sc.on(search, "input", () => {
      state.query = search.value.trim().toLowerCase();
      apply(false);
    });
  }
  const setStack = (value) => {
    state.stack = (value || "").toLowerCase();
    if (stackChip) {
      stackChip.hidden = !state.stack;
      const name = $("#stackName", stackChip);
      if (name) name.textContent = value || "";
    }
  };
  if (stackChip) {
    sc.on(stackChip, "click", () => {
      setStack("");
      try {
        const url = new URL(location.href);
        url.searchParams.delete("stack");
        history.replaceState(history.state, "", url.pathname + url.search + url.hash);
      } catch (e) {
        /* ignore */
      }
      apply(true);
    });
  }
  if (readUrl) {
    try {
      const params = new URLSearchParams(location.search);
      const stack = params.get("stack");
      const tag = params.get("tag");
      if (stack) setStack(stack);
      if (tag && $$(".filter", group).some((b) => b.dataset.filter === tag)) state.cat = tag;
      if (stack || tag) apply(false);
    } catch (e) {
      /* ignore */
    }
  }
  finish();
}

function initCaseGrid(sc) {
  initFilterSet(sc, {
    group: $("#filters"),
    grid: $("#cases"),
    itemSelector: ".case",
    search: $("#caseSearch"),
    stackChip: $("#stackChip"),
    countEl: $("#caseCount"),
    emptyEl: $("#casesEmpty"),
    readUrl: S.path === "/projects",
  });
  initFilterSet(sc, { group: $("#postFilters"), grid: $("#postLog"), itemSelector: ".post" });
}

/* ───────────────────────── 13. CAREER LOG: LINES TYPE OUT ONE BY ONE ───────────────────────── */
const logSegs = new WeakMap();
function readSegments(line) {
  if (logSegs.has(line)) return logSegs.get(line);
  const segs = [];
  line.childNodes.forEach((n) => {
    if (n.nodeType === 3) segs.push(n.data);
    else if (n.nodeType === 1 && !n.classList.contains("caret")) segs.push([n.textContent, n.className]);
  });
  logSegs.set(line, segs);
  return segs;
}
function initLog(sc) {
  const lines = $$("#log .log-line");
  if (!lines.length) return;
  lines.forEach(readSegments);
  let queue = Promise.resolve();
  const type = async (line) => {
    if (!sc.alive) return;
    line.textContent = "";
    line.classList.add("typed");
    await typeSegs(line, readSegments(line), 3, sc);
    if (line.id === "liveLine") {
      const caret = document.createElement("span");
      caret.className = "caret";
      caret.setAttribute("aria-hidden", "true");
      line.appendChild(caret);
    }
  };
  if (!("IntersectionObserver" in window) || root().hasAttribute("data-fallback")) {
    lines.forEach((l) => l.classList.add("typed"));
    return;
  }
  const io = sc.observe(
    new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          queue = queue.then(() => type(e.target));
        }),
      { threshold: 0.9 },
    ),
  );
  lines.forEach((l) => {
    if (l.classList.contains("typed")) return;
    io.observe(l);
  });
  sc.defer(() => {
    lines.forEach((l) => {
      if (l.classList.contains("typed")) return;
      l.classList.add("typed");
    });
  });
}

/* ───────────────────────── 14. ACCESS BADGES: 3D TILT + HOLOGRAM ───────────────────────── */
function initBadges(sc) {
  if (S.reduced || !S.finePointer) return;
  $$(".badge-wrap").forEach((wrap) => {
    const b = $(".badge", wrap);
    sc.on(wrap, "pointermove", (e) => {
      const r = wrap.getBoundingClientRect();
      const x = clamp((e.clientX - r.left) / r.width, 0, 1);
      const y = clamp((e.clientY - r.top) / r.height, 0, 1);
      b.classList.add("tilting");
      b.style.setProperty("--ry", `${(x - 0.5) * 22}deg`);
      b.style.setProperty("--rx", `${(0.5 - y) * 18}deg`);
      b.style.setProperty("--mx", `${x * 100}%`);
      b.style.setProperty("--my", `${y * 100}%`);
    });
    sc.on(wrap, "pointerleave", () => {
      b.classList.remove("tilting");
      b.style.setProperty("--rx", "0deg");
      b.style.setProperty("--ry", "0deg");
    });
  });
}

/* ───────────────────────── 15. CONTACT: SECURE CHANNEL ───────────────────────── */
function initContact(sc) {
  const form = $("#contactForm");
  if (!form) return;
  const tx = $("#tx");
  const btn = $("#sendBtn");
  const state = $("#chanState");
  const c = S.data.contact || {};
  const fields = [
    ["f-name", "e-name", (v) => (v.trim() ? "" : "Add your name so I know who is writing.")],
    ["f-email", "e-email", (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Add an email address I can reply to, like name@company.com.")],
    ["f-msg", "e-msg", (v) => (v.trim().length >= 10 ? "" : "Write a short message of at least 10 characters.")],
  ];
  const check = ([id, errId, test]) => {
    const inp = $("#" + id);
    const err = $("#" + errId);
    const msg = test(inp.value);
    err.textContent = msg;
    err.hidden = !msg;
    inp.closest(".field").classList.toggle("bad", !!msg);
    inp.setAttribute("aria-invalid", String(!!msg));
    return msg ? inp : null;
  };
  fields.forEach((f) =>
    sc.on($("#" + f[0]), "input", () => {
      if ($("#" + f[0]).closest(".field").classList.contains("bad")) check(f);
    }),
  );
  const line = async (segs, cls) => {
    const li = document.createElement("li");
    if (cls) li.className = cls;
    tx.appendChild(li);
    await typeSegs(li, segs, 3, sc);
  };
  const pause = (ms) => (S.reduced ? Promise.resolve() : sc.sleep(ms));

  sc.on(form, "submit", async (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    const bad = fields.map(check).filter(Boolean);
    if (bad.length) {
      bad[0].focus();
      return;
    }
    const name = $("#f-name").value.trim();
    const email = $("#f-email").value.trim();
    const msg = $("#f-msg").value.trim();
    const digest = sha256(`${name}\n${email}\n${msg}`);
    btn.disabled = true;
    tx.hidden = false;
    tx.innerHTML = "";
    state.textContent = "handshake";
    state.className = "warn";
    await line(["> Encrypting message (AES-256-GCM)... ", ["done", "ok"]]);
    await pause(380);
    await line(["> Generating SHA-256 hash... ", [digest.slice(0, 32) + "…", "ok"]]);
    await pause(380);
    await line(["> Transmitting via secure channel..."]);
    await pause(480);
    if (!c.email) {
      await line([["✖ No contact address is configured. ", "err"], "Use one of the direct lines instead."]);
      state.textContent = "failed";
      state.className = "err";
      btn.disabled = false;
      return;
    }
    const a = document.createElement("a");
    a.href = `mailto:${c.email}?subject=${encodeURIComponent("Portfolio contact from " + name)}&body=${encodeURIComponent(`${msg}\n\n${name}\n${email}\n\nSHA-256: ${digest}`)}`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    await line([["✔ Message packaged. ", "ok"], "Your mail client should open with it ready. Press send there to deliver it."]);
    await line(["  Nothing opened? Write to ", { t: c.email, href: `mailto:${c.email}` }, " directly."]);
    state.textContent = "ready to send";
    state.className = "ok";
    btn.disabled = false;
  });
}

/* ───────────────────────── 16. CASE FILE PAGES: SCREENSHOTS AND CONTENTS ───────────────────────── */
function initScreens(sc) {
  const links = $$("#main a[data-screen]");
  if (!links.length || !viewer.open) return;
  const list = links.map((a) => {
    const img = $("img", a);
    return {
      src: a.getAttribute("href"),
      alt: img ? img.alt : "",
      caption: a.dataset.caption || (img ? img.alt : ""),
      width: +a.dataset.width || 1600,
      height: +a.dataset.height || 1000,
    };
  });
  sc.on(document, "click", (e) => {
    const a = e.target instanceof Element ? e.target.closest("#main a[data-screen]") : null;
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    viewer.list = list;
    viewer.open(links.indexOf(a));
  });
}

function initToc(sc) {
  const toc = $(".toc");
  if (!toc || !("IntersectionObserver" in window)) return;
  const links = $$("a[data-toc]", toc);
  const spy = sc.observe(
    new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.setAttribute("aria-current", String(a.dataset.toc === e.target.id)));
        }),
      { rootMargin: "-30% 0px -60% 0px" },
    ),
  );
  $$(".dossier-sec").forEach((s) => spy.observe(s));
}

function initNotFound() {
  const el = $("#nfPath");
  if (!el) return;
  el.textContent = location.pathname;
  const cmd = $("#main .cmd");
  if (cmd) {
    cmd.dataset.cmd = `cd ${location.pathname}`;
    const text = $(".cmd-text", cmd);
    if (text) text.textContent = cmd.dataset.cmd;
  }
}

/* ───────────────────────── 17. ENTRY POINTS ───────────────────────── */
export function startChrome(options) {
  const sc = scope();
  const el = root();
  S.data = options.data;
  if (typeof options.navigate === "function") S.navigate = options.navigate;
  S.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  S.finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  S.path = location.pathname;
  const fallback = el.hasAttribute("data-fallback");
  if (!fallback) el.classList.add("js");
  const run = (fn) => {
    try {
      return fn(sc);
    } catch (err) {
      console.error("Portfolio console:", err);
      return null;
    }
  };
  refreshColors();
  run(initStrip);
  run(initInternalLinks);
  run(initReport);
  run(initViewer);
  S.term = run(initTerminal);
  run(initCursor);
  run(initMagnets);
  run(initCopy);
  run(initEggs);
  el.setAttribute("data-runtime", "ready");
  S.booted = fallback ? Promise.resolve() : run(runBoot) || Promise.resolve();
  if (!S.booted.then) S.booted = Promise.resolve();
  sc.defer(() => {
    S.term = null;
  });
  return () => sc.dispose();
}

export function startPage(options) {
  const sc = scope();
  const path = (options && options.path) || location.pathname;
  const first = S.lastPath === null;
  const changed = S.lastPath !== path;
  S.path = path;
  S.lastPath = path;
  if (!S.data) return () => sc.dispose();
  S.activeSection = "";
  S.cwd = cwdForPath(path);
  paintCwd();
  const run = (fn) => {
    try {
      fn(sc);
    } catch (err) {
      console.error("Portfolio console:", err);
    }
  };
  run(initNotFound);
  run(initReveals);
  run(initSpy);
  run(initHero);
  run(initSkills);
  run(initSOC);
  run(initCaseGrid);
  run(initLog);
  run(initBadges);
  run(initContact);
  run(initScreens);
  run(initToc);
  if (S.updateScan) S.updateScan();
  const main = $("#main");
  if (!first && changed && main && main.animate && !S.reduced) {
    main.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 360, easing: "cubic-bezier(.22,.8,.24,1)" });
  }
  return () => sc.dispose();
}
