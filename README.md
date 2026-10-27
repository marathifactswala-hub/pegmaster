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

1. Academy exact street address in Pune in the Contact section
2. Course syllabi updated from official documents:
   - `3-Month Professional Bartending`: based on `Pegmasters_3_Month_Professional_Bartending_Handbook.docx` (5 parts, 30+ modules)
   - `6-Month Advanced Mixology`: based on `Peg_Master_6_Month_Advanced_Mixology_Detailed_Syllabus.docx` (8 modules)

The "Viral Pours" section embeds YouTube Shorts by ID; view counts are typed into `index.html` and need a manual refresh now and then.

## SEO, AEO and GEO

- `index.html` head: title, description, canonical, Open Graph/Twitter cards, local meta (`geo.region` IN-MH, Pune)
- Structured data (JSON-LD `@graph` in `index.html`): EducationalOrganization + LocalBusiness, founder Person,
  WebSite, WebPage (speakable), 2 Courses, FAQPage and the 8 YouTube Shorts as VideoObjects.
  **The FAQ and course entries mirror the visible text, so update both together.**
- `sitemap.xml`: page, image and video sitemap
- `robots.txt`: open to search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…)
- `llms.txt`: plain-language summary for AI assistants
- `404.html`: branded not-found page (Vercel serves it automatically)

After going live: add the site to Google Search Console and Bing Webmaster Tools, submit `sitemap.xml`,
and create a Google Business Profile for the Pune address.

## Run locally

```
python -m http.server 5173
```

Then open http://127.0.0.1:5173.

## Deploy

Import this repo in Vercel (Framework preset: **Other**, no build command, output directory `.`), then add the domain `pegmasterbartendingacademy.in` under Project → Settings → Domains.
