// =========================================================
// Portfolio — Aya Hamrouni
// =========================================================

// ----- Thème clair / sombre (mémorisé) -----
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
} catch (e) {}
document.getElementById("themeToggle").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

// ----- Navbar : fond au scroll + menu mobile -----
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20));
document.getElementById("burger").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// ----- Lien actif selon la section visible -----
const sections = document.querySelectorAll("main section[id]");
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.querySelectorAll("a").forEach(a =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
sections.forEach(s => spy.observe(s));

// ----- Effet machine à écrire -----
const FR_WORDS = ["Génie Logiciel", "Microservices .NET", "Angular", "IA & Automatisation", "DevOps · Kubernetes"];
let words = FR_WORDS;
const typed = document.getElementById("typed");
let w = 0, c = 0, deleting = false;

// ----- Changement de langue (FR / EN / DE / AR) -----
const I18N = window.I18N || {};
const frText = {}, frAlt = {};
document.querySelectorAll("[data-i18n]").forEach(el => frText[el.dataset.i18n] = el.innerHTML);
document.querySelectorAll("[data-i18n-alt]").forEach(el => frAlt[el.dataset.i18nAlt] = el.alt);
const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");

function setLang(lang) {
  const dict = lang === "fr" ? null : I18N[lang];
  if (lang !== "fr" && !dict) lang = "fr";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.dataset.i18n;
    el.innerHTML = (dict && dict[k]) || frText[k];
  });
  document.querySelectorAll("[data-i18n-alt]").forEach(el => {
    const k = el.dataset.i18nAlt;
    el.alt = (dict && dict[k]) || frAlt[k];
  });
  root.lang = lang;
  root.dir = lang === "ar" ? "rtl" : "ltr";
  words = (dict && dict.typed) || FR_WORDS;
  w = 0; c = 0; deleting = false;
  document.getElementById("langCurrent").textContent = lang.toUpperCase();
  langMenu.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
  try { localStorage.setItem("lang", lang); } catch (e) {}
}
langBtn.addEventListener("click", e => {
  e.stopPropagation();
  const open = langMenu.classList.toggle("open");
  langBtn.setAttribute("aria-expanded", open);
});
langMenu.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
  setLang(b.dataset.lang);
  langMenu.classList.remove("open");
  langBtn.setAttribute("aria-expanded", false);
}));
document.addEventListener("click", () => langMenu.classList.remove("open"));
let startLang = "fr";
try { startLang = localStorage.getItem("lang") || "fr"; } catch (e) {}
setLang(startLang);

(function type() {
  const word = words[w % words.length];
  typed.textContent = word.slice(0, c);
  if (!deleting && c < word.length) c++;
  else if (deleting && c > 0) c--;
  else if (!deleting) { deleting = true; return setTimeout(type, 1600); }
  else { deleting = false; w = (w + 1) % words.length; }
  setTimeout(type, deleting ? 45 : 85);
})();

// ----- Apparition au scroll -----
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 80 + "ms";
  revealObs.observe(el);
});

// ----- Compteurs animés -----
const counters = document.querySelectorAll("[data-count]");
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    let n = 0;
    const step = () => { n++; el.textContent = n; if (n < target) setTimeout(step, 120); };
    step();
    countObs.unobserve(el);
  });
});
counters.forEach(c => countObs.observe(c));

// ----- Filtres des projets -----
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    document.querySelectorAll(".project").forEach(p => {
      p.classList.toggle("hide", f !== "all" && p.dataset.cat !== f);
    });
  });
});

// ----- Lightbox pour les captures d'écran -----
const lb = document.createElement("div");
lb.className = "lightbox";
lb.innerHTML = '<img alt="" /><button class="lb-nav lb-prev" aria-label="Précédente">‹</button>' +
  '<button class="lb-nav lb-next" aria-label="Suivante">›</button><p class="lb-cap"></p>';
document.body.appendChild(lb);
let group = [], idx = 0;
function showShot() {
  const s = group[idx], img = lb.querySelector("img");
  img.src = s.dataset.full;
  img.alt = s.querySelector("img").alt;
  lb.querySelector(".lb-cap").textContent = img.alt + (group.length > 1 ? `  (${idx + 1}/${group.length})` : "");
  lb.querySelectorAll(".lb-nav").forEach(b => b.style.display = group.length > 1 ? "" : "none");
}
document.querySelectorAll(".shot").forEach(s => s.addEventListener("click", () => {
  const box = s.closest(".gallery, .pf-media, .defense-grid");
  group = box ? [...box.querySelectorAll(".shot")] : [s];
  idx = group.indexOf(s);
  showShot();
  lb.classList.add("open");
}));
const step = d => { idx = (idx + d + group.length) % group.length; showShot(); };
lb.querySelector(".lb-prev").addEventListener("click", e => { e.stopPropagation(); step(-1); });
lb.querySelector(".lb-next").addEventListener("click", e => { e.stopPropagation(); step(1); });
lb.addEventListener("click", () => lb.classList.remove("open"));
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") lb.classList.remove("open");
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});

// ----- Année du footer -----
document.getElementById("year").textContent = new Date().getFullYear();
