---
name: verify
description: Run and drive the Peg Master static site in Chrome to verify a change.
---

# Verify the Peg Master site

Static HTML/CSS/JS, no build step.

## Launch
```
python -m http.server 5173 --bind 127.0.0.1   # from repo root, run in background
```

## Drive (Claude in Chrome)
- Navigate a tab to `http://127.0.0.1:5173/robots.txt`, then replace the document with same-origin
  iframes to get phone widths (the window itself won't resize):
  `<iframe id="m" src="/" style="width:390px;height:720px">` plus a ~1040px one for desktop.
- Drive through `document.getElementById('m').contentWindow/contentDocument`.
- Stub `contentWindow.open = u => opened.push(u)` before submitting the enquiry form so WhatsApp isn't opened.
- `sessionStorage.clear()` in the top page before loading to see the logo loader again (it shows once per session).

## Gotchas
- The automation window often isn't painting: rAF, CSS animations/transitions, smooth scroll and
  IntersectionObserver stall until a screenshot forces a frame. Take a screenshot before
  re-reading anything frame-dependent (loader fill, hero fade-in, reel arrows, gallery auto-pause).
- Tool output redacts some URLs; check `href.includes(...)` instead of printing full wa.me links.
- Check 320px as well as 390px — hero overflow shows up only on the narrowest widths.

## Flows worth driving
Loader (first visit vs reload), scroll-linked ticker/badge, reels tap → single iframe, mobile nav
(inert + Escape), hero/gallery video toggles, enquiry form validation → wa.me/919922425833 message.
