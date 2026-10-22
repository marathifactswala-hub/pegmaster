# Peg Master Bartending Academy

Website for [pegmasterbartendingacademy.in](https://pegmasterbartendingacademy.in). Plain HTML, CSS and JavaScript with no build step, designed mobile-first.

## Structure

- `index.html`: all page content
- `css/styles.css`: styles (mobile base, `min-width` breakpoints at 600px and 960px)
- `js/main.js`: menu, video controls, scroll reveals, enquiry form → WhatsApp
- `assets/`: optimised images, video, icons and the social share image

## Before going live

Replace the placeholders (search for `9999999999` and `TODO`):

1. WhatsApp/phone number in `index.html` (6 places) and `WHATSAPP_NUMBER` in `js/main.js`
2. Email and academy address in the Contact section
3. Course durations and contents, and the FAQ answers

## Run locally

```
python -m http.server 5173
```

Then open http://127.0.0.1:5173.

## Deploy

Import this repo in Vercel (Framework preset: **Other**, no build command, output directory `.`), then add the domain `pegmasterbartendingacademy.in` under Project → Settings → Domains.
