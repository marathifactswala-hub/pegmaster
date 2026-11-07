// Peg Master Bartending Academy — analytics events
// Google Tag Manager (GTM-MRDVG5FH) is loaded in <head> of index.html.
// This file pushes the academy's key actions into the dataLayer as custom events;
// GTM forwards them to Google Analytics 4 (see README → Analytics for the GTM setup).
(() => {
  window.dataLayer = window.dataLayer || [];
  const track = (event, params = {}) => window.dataLayer.push({ event, ...params });

  // Where on the page a tap happened, e.g. "hero", "courses", "action_bar"
  const placeOf = (el) => {
    if (el.closest(".promo")) return "popup";
    if (el.closest(".action-bar")) return "action_bar";
    if (el.closest(".site-header")) return "header";
    if (el.closest(".site-footer")) return "footer";
    if (el.closest(".hero")) return "hero";
    return el.closest("section[id]")?.id || "page";
  };

  // Contact taps: the actions that turn a visitor into a lead
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href");
    const where = placeOf(a);

    if (a.dataset.course) track("course_interest", { course_name: a.dataset.course, click_location: where });
    else if (href.startsWith("https://wa.me/")) track("whatsapp_click", { click_location: where });
    else if (href.startsWith("tel:")) track("call_click", { click_location: where });
    else if (href.startsWith("mailto:")) track("email_click", { click_location: where });
    else if (/maps\.app\.goo\.gl|google\.[a-z.]+\/maps/.test(href)) track("directions_click", { click_location: where });
    else if (/instagram\.com|youtube\.com/.test(href)) {
      track("social_click", { social_network: href.includes("instagram") ? "instagram" : "youtube", click_location: where });
    }
  });

  // Admissions popup shown (main.js)
  document.addEventListener("pm:popup", () => track("popup_view"));

  // Enquiry form sent to WhatsApp (main.js fires this after validation passes)
  document.addEventListener("pm:enquiry", (e) => {
    track("generate_lead", { course_name: e.detail.course, batch: e.detail.batch, lead_method: "whatsapp_form" });
  });
})();
