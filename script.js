const rotatingPhrases = [
  "asynchronous multi-robot planning",
  "thermal + stereo perception fusion for night safety",
  "cm-level vehicle offset estimation",
  "real-time autonomy on NVIDIA AGX Orin",
];

const rotatingText = document.getElementById("rotatingText");
const cursorGlow = document.getElementById("cursorGlow");
const scrollBar = document.getElementById("scrollBar");
const revealEls = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".menu a");
const tiltCards = document.querySelectorAll("[data-tilt]");
const finePointer = window.matchMedia("(pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let phraseIndex = 0;

function rotatePhrase() {
  if (!rotatingText) return;
  phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
  rotatingText.textContent = rotatingPhrases[phraseIndex];
}

setInterval(rotatePhrase, 2200);

if (cursorGlow && finePointer && !reduceMotion) {
  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      cursorGlow.style.left = `${mouseX}px`;
      cursorGlow.style.top = `${mouseY}px`;
      rafId = null;
    });
  });
} else if (cursorGlow) {
  cursorGlow.style.display = "none";
}

window.addEventListener("scroll", () => {
  const doc = document.documentElement;
  const total = doc.scrollHeight - doc.clientHeight;
  const progress = total > 0 ? (doc.scrollTop / total) * 100 : 0;
  if (scrollBar) scrollBar.style.width = `${progress}%`;
}, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const target = link.getAttribute("href")?.slice(1);
        link.classList.toggle("active", target === entry.target.id);
      });
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll("section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

if (finePointer && !reduceMotion && window.innerWidth > 900) {
  tiltCards.forEach((card) => {
    let rafId = null;
    let rotateX = 0;
    let rotateY = 0;

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      rotateY = ((x / rect.width) - 0.5) * 6;
      rotateX = ((y / rect.height) - 0.5) * -6;

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        rafId = null;
      });
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });
}
