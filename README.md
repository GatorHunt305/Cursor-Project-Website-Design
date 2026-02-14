# H4Services

A marketing website for a service that builds and maintains websites for small and underrepresented businesses. The site is designed to be **inviting for older business owners**, with clear pricing, simple navigation, and a focus on trust and successful execution.

## Pages

- **Home** — Value proposition, benefits, and calls to action
- **About** — Mission, values (transparency, simplicity, support, results)
- **Get Started** — Pricing plans (Standard and Premium) and next steps
- **Contact** — Contact form (connect to your backend or email when ready)

## Design

- **Theme:** Clear pricing, successful execution, professional and trustworthy
- **Audience:** Small businesses underrepresented online; welcoming to older business owners
- **Typography:** Larger base font (18px), Georgia for headings, system UI for body
- **Colors:** Deep teal (trust), warm cream background, accent for CTAs
- **Accessibility:** Skip link, semantic HTML, focus styles, readable contrast

## Pricing (editable in `get-started.html`)

- **Standard:** $89/mo + $299 setup — website design and maintenance
- **Premium:** $179/mo + $449 setup — additional support, more pages, priority help

Update the amounts in `get-started.html` to match your real pricing.

## Running locally

Open `index.html` in a browser, or use a simple local server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000` (or the port shown).

## Customization

- **Brand name:** Search and replace "H4Services" across all HTML files if you need to rebrand.
- **Colors:** Edit the `:root` variables in `styles.css`.
- **Contact form:** Replace the form `action` and/or the demo `alert` in `contact.html` with your form handler or email service.

No build step required — plain HTML, CSS, and minimal JavaScript.
