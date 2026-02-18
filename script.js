const rotatingPhrases = [
  "asynchronous multi-robot planning",
  "thermal + stereo perception fusion",
  "sim-to-real manipulation transfer",
  "real-time edge autonomy on embedded GPUs",
];

const rotatingText = document.getElementById("rotatingText");
const cursorGlow = document.getElementById("cursorGlow");
const scrollBar = document.getElementById("scrollBar");
const revealEls = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".menu a");
const tiltCards = document.querySelectorAll("[data-tilt]");

let phraseIndex = 0;

function rotatePhrase() {
  if (!rotatingText) return;
  phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
  rotatingText.textContent = rotatingPhrases[phraseIndex];
}

setInterval(rotatePhrase, 2200);

window.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

window.addEventListener("scroll", () => {
  const doc = document.documentElement;
  const total = doc.scrollHeight - doc.clientHeight;
  const progress = total > 0 ? (doc.scrollTop / total) * 100 : 0;
  if (scrollBar) scrollBar.style.width = `${progress}%`;
});

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

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});
