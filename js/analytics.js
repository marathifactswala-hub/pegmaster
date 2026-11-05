// Peg Master Bartending Academy — Google Analytics 4
// Paste your GA4 Measurement ID below (Admin → Data streams → Web → "G-XXXXXXXXXX").
// While it is empty, nothing loads and nothing is tracked.
(() => {
  const GA_ID = "";

  if (!/^G-[A-Z0-9]+$/.test(GA_ID)) return;
  // Don't count local testing
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", GA_ID);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  const track = (name, params = {}) => gtag("event", name, params);

  // Where on the page a tap happened, e.g. "hero", "courses", "action_bar"
  const placeOf = (el) => {
    if (el.closest(".action-bar")) return "action_bar";
    if (el.closest(".site-header")) return "header";
    if (el.closest(".site-footer")) return "footer";
    return el.closest("section[id]")?.id || el.closest("section")?.querySelector("h1, h2")?.textContent.trim().toLowerCase() || "page";
  };

  // Contact taps: the actions that turn a visitor into a lead
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    const where = placeOf(a);

    if (a.dataset.course) track("course_interest", { course_name: a.dataset.course, location: where });
    else if (href.startsWith("https://wa.me/")) track("whatsapp_click", { location: where });
    else if (href.startsWith("tel:")) track("call_click", { location: where });
    else if (href.startsWith("mailto:")) track("email_click", { location: where });
    else if (/maps\.app\.goo\.gl|google\.[a-z.]+\/maps/.test(href)) track("directions_click", { location: where });
    else if (/instagram\.com|youtube\.com/.test(href)) {
      track("social_click", { network: href.includes("instagram") ? "instagram" : "youtube", link_url: href, location: where });
    }
  });

  // Enquiry form sent to WhatsApp (main.js fires this after validation passes)
  document.addEventListener("pm:enquiry", (e) => {
    track("generate_lead", { course_name: e.detail.course, batch: e.detail.batch, method: "whatsapp_form" });
  });
})();
