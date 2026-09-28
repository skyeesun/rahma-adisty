document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  initCertCoverflow();
  initFeedCarousels();
  initLightbox();
});

function initCertCoverflow() {
  const root = document.querySelector("[data-cert-carousel]");
  if (!root) return;

  const track = root.querySelector(".cert-track");
  const slides = Array.from(track.querySelectorAll(".cert-slide"));
  const caption = document.querySelector("[data-cert-caption]");
  const dotsWrap = document.querySelector("[data-cert-dots]");
  const prevBtn = root.querySelector(".cert-nav.prev");
  const nextBtn = root.querySelector(".cert-nav.next");
  const total = slides.length;
  let active = 0;
  let timer = null;

  // Build dots
  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show certificate ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function shortestDiff(i) {
    let diff = i - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  }

  function render() {
    slides.forEach((slide, i) => {
      const diff = shortestDiff(i);
      const dist = Math.abs(diff);
      slide.style.setProperty("--pos", diff);
      slide.style.setProperty("--scale", dist === 0 ? 1.22 : dist === 1 ? 0.68 : 0.5);
      slide.style.setProperty("--blur", dist === 0 ? "0px" : dist === 1 ? "2px" : "5px");
      slide.style.setProperty("--opacity", dist === 0 ? 1 : dist === 1 ? 0.55 : 0.18);
      slide.style.setProperty("--z", total - dist);
      slide.classList.toggle("is-active", dist === 0);
    });
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === active));
    if (caption) caption.textContent = slides[active].dataset.title || "";
  }

  function goTo(i) {
    active = ((i % total) + total) % total;
    render();
    restartAutoplay();
  }

  function next() { goTo(active + 1); }
  function prev() { goTo(active - 1); }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, 3800);
  }

  slides.forEach((slide, i) => {
    slide.addEventListener("click", () => { if (i !== active) goTo(i); });
  });
  if (prevBtn) prevBtn.addEventListener("click", prev);
  if (nextBtn) nextBtn.addEventListener("click", next);
  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", restartAutoplay);

  render();
  restartAutoplay();
}


function initFeedCarousels() {
  document.querySelectorAll("[data-feed-carousel]").forEach((root) => {
    const track = root.querySelector(".feed-track");
    const prev = root.querySelector(".feed-nav.prev");
    const next = root.querySelector(".feed-nav.next");

    const step = () => track.clientWidth * 0.9;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.classList.toggle("is-disabled", track.scrollLeft <= 2);
      next.classList.toggle("is-disabled", track.scrollLeft >= max);
    };

    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    // Lebar item bisa berubah saat gambar selesai dimuat (mode ukuran asli)
    track.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", update, { once: true });
    });
    update();
  });
}


function initLightbox() {
  const ITEM = ".feed-item, .gallery-item";
  const GROUP = ".feed-track, .gallery-grid";
  const items = document.querySelectorAll(ITEM);
  if (!items.length) return;

  // Bangun overlay lightbox lewat JS (tidak perlu markup HTML tambahan)
  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Image viewer");
  box.setAttribute("aria-hidden", "true");
  box.innerHTML =
    '<button class="lb-close" aria-label="Close">\u00d7</button>' +
    '<button class="lb-nav lb-prev" aria-label="Previous image">\u2039</button>' +
    '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-caption"></figcaption></figure>' +
    '<button class="lb-nav lb-next" aria-label="Next image">\u203a</button>';
  document.body.appendChild(box);

  const lbImg = box.querySelector(".lb-img");
  const lbCap = box.querySelector(".lb-caption");
  const prevBtn = box.querySelector(".lb-prev");
  const nextBtn = box.querySelector(".lb-next");
  let group = [];
  let index = 0;
  let lastFocus = null;

  function show(i) {
    index = (i + group.length) % group.length;
    const img = group[index];
    lbImg.src = img.dataset.full || img.currentSrc || img.src;
    lbImg.alt = img.alt;
    const figcap = img.closest("figure") && img.closest("figure").querySelector("figcaption");
    lbCap.textContent = figcap ? figcap.textContent : img.alt;
    const single = group.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
  }

  function open(figure) {
    const container = figure.closest(GROUP);
    group = Array.from((container || figure).querySelectorAll("img"));
    const img = figure.querySelector("img");
    lastFocus = document.activeElement;
    show(Math.max(group.indexOf(img), 0));
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    document.body.classList.add("lb-open");
    box.querySelector(".lb-close").focus();
  }

  function close() {
    box.classList.remove("is-open");
    box.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lb-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Buka: klik gambar (atau caption-nya), atau Enter/Space saat fokus
  items.forEach((figure) => {
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.addEventListener("click", () => open(figure));
    figure.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(figure); }
    });
  });

  // Tutup: tombol X, klik area gelap, atau Esc
  box.querySelector(".lb-close").addEventListener("click", close);
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lb-figure")) close();
  });
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));

  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // Swipe kiri/kanan di HP
  let touchX = null;
  box.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });
}
