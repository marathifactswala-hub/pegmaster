// Peg Master Bartending Academy — site behaviour
(() => {
  const WHATSAPP_NUMBER = "919922425833";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---- Loader: the logo fills like a poured glass, then the shutter lifts ----
  const loader = document.querySelector(".loader");
  const ready = () => root.classList.add("is-ready");
  const showLoader = loader && !root.classList.contains("no-loader") && !reduceMotion.matches;
  if (showLoader) {
    const started = performance.now();
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      const wait = Math.max(0, 1700 - (performance.now() - started)); // let the pour finish
      setTimeout(() => {
        loader.classList.add("is-done");
        setTimeout(ready, 250);
        loader.addEventListener("transitionend", () => loader.remove(), { once: true });
        setTimeout(() => loader.remove(), 1200); // in case transitionend never fires
        try { sessionStorage.setItem("pm-poured", "1"); } catch (e) {}
      }, wait);
    };
    if (document.readyState === "complete") close();
    else window.addEventListener("load", close, { once: true });
    setTimeout(close, 3500); // never hold slow connections hostage
  } else {
    loader?.remove();
    requestAnimationFrame(ready);
  }

  // ---- Footer year ----
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ---- Header border + scroll-linked ticker and badge ----
  const header = document.querySelector(".site-header");
  const ticker = document.querySelector(".ticker-track");
  const badge = document.querySelector(".badge");
  let ticking = false;
  let tickerHalf = 0;
  const measureTicker = () => { if (ticker) tickerHalf = ticker.scrollWidth / 2; };
  measureTicker();
  window.addEventListener("resize", measureTicker, { passive: true });
  document.fonts?.ready.then(measureTicker);
  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    if (reduceMotion.matches) return;
    if (ticker && tickerHalf) {
      ticker.style.transform = `translate3d(${-((y * 0.6) % tickerHalf)}px, 0, 0)`;
    }
    if (badge) badge.style.transform = `rotate(${y * 0.25}deg)`;
  };
  onScroll();
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });

  // ---- Mobile nav ----
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const behindNav = document.querySelectorAll("main, .site-footer, .action-bar, .header-cta, .brand");
  const setNav = (open) => {
    document.body.classList.toggle("nav-open", open);
    behindNav.forEach((el) => { el.inert = open; });
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setNav(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => { if (e.matches) setNav(false); });

  // ---- Hero video: pause control + reduced motion ----
  const video = document.querySelector(".hero-video");
  const videoBtn = document.querySelector(".video-toggle");
  if (video && videoBtn) {
    const setPaused = (paused) => {
      paused ? video.pause() : video.play().catch(() => {});
      videoBtn.setAttribute("aria-pressed", String(paused));
      videoBtn.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    };
    if (reduceMotion.matches) { video.removeAttribute("autoplay"); setPaused(true); }
    videoBtn.addEventListener("click", () => setPaused(!video.paused));
  }

  // ---- Gallery video: tap to play/pause, stops when scrolled away ----
  const galleryVideo = document.querySelector(".gallery-video");
  const galleryBtn = document.querySelector(".gallery-play");
  if (galleryVideo && galleryBtn) {
    const setPlaying = (playing) => {
      playing ? galleryVideo.play().catch(() => {}) : galleryVideo.pause();
      galleryBtn.setAttribute("aria-pressed", String(playing));
      galleryBtn.setAttribute("aria-label", playing ? "Pause video" : "Play video");
    };
    galleryBtn.addEventListener("click", () => setPlaying(galleryVideo.paused));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting && !galleryVideo.paused) setPlaying(false);
      }).observe(galleryVideo);
    }
  }

  // ---- Instagram reels strip: desktop arrows scroll it sideways ----
  const reelList = document.querySelector(".reels");
  if (reelList) {
    document.querySelectorAll(".reels-arrow").forEach((arrow) => {
      arrow.addEventListener("click", () => {
        const card = reelList.querySelector("li");
        reelList.scrollBy({ left: Number(arrow.dataset.dir) * (card.offsetWidth + 18) * 2, behavior: reduceMotion.matches ? "auto" : "smooth" });
      });
    });
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

  // ---- Admissions popup: once per visit, after 10s or 40% scroll ----
  const promo = document.querySelector(".promo");
  if (promo && typeof promo.showModal === "function") {
    let seen = false;
    try { seen = !!sessionStorage.getItem("pm-promo"); } catch (e) {}
    const show = () => {
      if (seen || document.body.classList.contains("nav-open")) return;
      seen = true;
      try { sessionStorage.setItem("pm-promo", "1"); } catch (e) {}
      window.removeEventListener("scroll", onDeep);
      promo.showModal();
      document.dispatchEvent(new CustomEvent("pm:popup"));
    };
    const onDeep = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max > 0 && scrollY / max > 0.4) show();
    };
    if (!seen) {
      setTimeout(show, 10000);
      window.addEventListener("scroll", onDeep, { passive: true });
    }
    promo.querySelector(".promo-close").addEventListener("click", () => promo.close());
    promo.addEventListener("click", (e) => { if (e.target === promo) promo.close(); }); // tap on the backdrop
    promo.addEventListener("click", (e) => { if (e.target.closest("a")) promo.close(); });
  }

  // ---- Enquiry form (contact page only) ----
  const form = document.getElementById("enquiry-form");
  if (!form) return;
  const courseSelect = document.getElementById("f-course");

  // Course links arrive as /contact?course=professional|advanced: preselect it
  const wanted = new URLSearchParams(location.search).get("course");
  const option = wanted && courseSelect.querySelector(`option[data-key="${CSS.escape(wanted)}"]`);
  if (option) courseSelect.value = option.value;

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

    document.dispatchEvent(new CustomEvent("pm:enquiry", { detail: { course: courseSelect.value, batch: form.elements.batch.value } }));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });

  ["name", "phone"].forEach((n) => {
    form.elements[n].addEventListener("input", (e) => {
      if (e.target.getAttribute("aria-invalid") === "true") showError(e.target, "");
    });
  });
})();
