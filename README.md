# Peg Master Bartending Academy

Website for [pegmasterbartendingacademy.in](https://pegmasterbartendingacademy.in). Plain HTML, CSS and JavaScript with no build step, designed mobile-first.

## Structure

- `index.html`: all page content
- `css/styles.css`: styles (mobile base, `min-width` breakpoints at 600px and 960px)
- `js/main.js`: menu, video controls, scroll reveals, enquiry form → WhatsApp
- `assets/`: optimised images, video, icons and the social share image

## Before going live

Contact details are set: WhatsApp/phone +91 99224 25833 and pegmasterbartendingacademy@gmail.com
(the WhatsApp number also lives in `WHATSAPP_NUMBER` in `js/main.js`).

Still to confirm (search for `TODO`):

1. Academy address in the Contact section
2. Course durations and contents
3. FAQ answers

The "Viral Pours" section embeds YouTube Shorts by ID; view counts are typed into `index.html` and need a manual refresh now and then.

## Run locally

```
python -m http.server 5173
```

Then open http://127.0.0.1:5173.

## Deploy

Import this repo in Vercel (Framework preset: **Other**, no build command, output directory `.`), then add the domain `pegmasterbartendingacademy.in` under Project → Settings → Domains.
