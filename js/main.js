// Peg Master Bartending Academy — site behaviour
(() => {
  // TODO: replace with the academy's WhatsApp number (country code, no + or spaces)
  const WHATSAPP_NUMBER = "919999999999";

  const root = document.documentElement;
  root.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---- Footer year ----
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ---- Header shadow on scroll ----
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---- Mobile nav ----
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const setNav = (open) => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a[href^='#']")) setNav(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setNav(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => { if (e.matches) setNav(false); });

  // ---- Hero video: pause control + reduced motion ----
  const video = document.querySelector(".hero-video");
  const videoBtn = document.querySelector(".video-toggle");
  const setPaused = (paused) => {
    paused ? video.pause() : video.play().catch(() => {});
    videoBtn.setAttribute("aria-pressed", String(paused));
    videoBtn.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
  };
  if (video && videoBtn) {
    if (reduceMotion.matches) { video.removeAttribute("autoplay"); setPaused(true); }
    videoBtn.addEventListener("click", () => setPaused(!video.paused));
  }

  // ---- Gallery video plays only while visible ----
  const galleryVideo = document.querySelector(".gallery-video");
  if (galleryVideo && "IntersectionObserver" in window && !reduceMotion.matches) {
    new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? galleryVideo.play().catch(() => {}) : galleryVideo.pause();
    }, { threshold: 0.5 }).observe(galleryVideo);
  }

  // ---- Reveal on scroll ----
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // ---- Course buttons preselect the course in the form ----
  const form = document.getElementById("enquiry-form");
  const courseSelect = document.getElementById("f-course");
  document.querySelectorAll("[data-course]").forEach((btn) => {
    btn.addEventListener("click", () => { courseSelect.value = btn.dataset.course; });
  });

  // ---- Enquiry form -> WhatsApp ----
  const showError = (input, message) => {
    const el = document.getElementById(input.id + "-error");
    el.textContent = message;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", el.id);
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const phone = form.elements.phone;
    const digits = phone.value.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

    showError(name, name.value.trim().length < 2 ? "Enter your name so we know who to reply to." : "");
    showError(phone, /^[6-9]\d{9}$/.test(digits) ? "" : "Enter a valid 10-digit Indian mobile number, e.g. 98765 43210.");

    const firstInvalid = form.querySelector("[aria-invalid='true']");
    if (firstInvalid) { firstInvalid.focus(); return; }

    const lines = [
      "Hi Peg Master! I'd like to enquire about a course.",
      "",
      `Name: ${name.value.trim()}`,
      `Mobile: ${digits}`,
      `Course: ${courseSelect.value}`,
      `Batch: ${form.elements.batch.value}`,
    ];
    const msg = form.elements.message.value.trim();
    if (msg) lines.push(`Message: ${msg}`);

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });

  ["name", "phone"].forEach((n) => {
    form.elements[n].addEventListener("input", (e) => {
      if (e.target.getAttribute("aria-invalid") === "true") showError(e.target, "");
    });
  });
})();
