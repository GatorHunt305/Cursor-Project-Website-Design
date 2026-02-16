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

### Charging setup fee first, then monthly

The site is set up so customers **pay the one-time setup fee upfront** and **monthly billing starts the following month**. To do this in Stripe:

1. **Option A (recommended):** Use **two Payment Links** per plan:
   - **Link 1 (main CTA):** One-time payment only — the setup fee (e.g. $2,000 or $5,000). Put this link in `get-started.html` as the plan’s “Pay setup fee” button.
   - **Link 2:** Subscription only — the monthly amount (e.g. $250 or $500). After the customer pays the setup fee, send them this link (email, thank-you page, or Stripe Customer Portal) so they add the subscription. When creating the subscription in Stripe, you can set a 1‑month free trial so the first monthly charge is ~30 days after they subscribe.

2. **Option B:** In the Stripe Dashboard, edit your existing Payment Links so they **only** include the one-time setup product (remove the recurring line item from the first payment). Then use a separate subscription link or Customer Portal for monthly billing after they’ve paid setup.

Update the URLs in `get-started.html` (the `STRIPE_LINKS` object in the script) to point to your setup-only Payment Links.

### First month free with a coupon

To give one-time discount equal to one month’s maintenance (so the first month is free), use a **Stripe coupon** and attach it to the Payment Link.

**1. Create the coupon (Stripe Dashboard)**  
- Go to [Stripe Dashboard → Products → Coupons](https://dashboard.stripe.com/coupons) (or [Billing → Coupons](https://dashboard.stripe.com/coupons)).  
- Click **Create coupon**.  
- Choose **Amount off** and set the value to one month’s fee (e.g. **$250** for Standard, **$500** for Premium).  
- Optionally set **Duration: once** so it only applies to one invoice.  
- Save.

**2. Create a promotion code**  
- Open the coupon you created → **Create promotion code**.  
- Enter a code (e.g. `FIRSTMONTHFREE` or `STANDARD250` / `PREMIUM500`). Use only letters and numbers.  
- Save. You can create one promo per plan (one for Standard, one for Premium).

**3. Allow promotion codes on the Payment Link**  
- Go to [Payment Links](https://dashboard.stripe.com/payment-links), open the link for that plan.  
- Click the **⋮** menu → **Update details** (or create a new link).  
- In **Options**, turn on **Allow promotion codes** so customers can use a code at checkout.  
- Save.

**4. Attach the coupon to the link (so it applies automatically)**  
- In `get-started.html`, find `STRIPE_PROMO_STANDARD` and `STRIPE_PROMO_PREMIUM` in the script.  
- Set each to the promotion code you created, e.g. `var STRIPE_PROMO_STANDARD = 'FIRSTMONTHFREE';`  
- The button URL will then include `?prefilled_promo_code=FIRSTMONTHFREE`, so the discount is applied when they click through (they can still change or remove it on the Stripe page).

You can’t “attach” a coupon to a product or link in the Dashboard so it’s the only option; using **prefilled_promo_code** in the URL is how you make one specific code apply by default for that plan.

**If the code shows “Invalid” at checkout:**

1. **Code name must match exactly**  
   In [Stripe → Billing → Coupons](https://dashboard.stripe.com/coupons), open the coupon → **Promotion codes**. The code string (e.g. `STANDARD250` / `PREMIUM500`) must match what’s in `get-started.html`. Stripe treats it as case-insensitive, but spelling must match.

2. **Allow promotion codes on the Payment Link**  
   [Payment Links](https://dashboard.stripe.com/payment-links) → open the link → **⋮** → **Update details** → under **Options** turn **on** “Allow promotion codes”. Save.

3. **Don’t restrict the coupon to other products**  
   When you created the coupon, if you set “Limit to specific products” (e.g. **applies_to**), the promotion code only works for those products. Your Payment Link must be for one of those products. Easiest fix: edit the coupon and **remove** the product restriction so the code applies to any product on that link (or add the correct product IDs that each Payment Link uses).

4. **Test vs Live**  
   Promotion codes and Payment Links must be in the same mode. If your site uses a **live** Stripe link, create the coupon and promotion code in **Live** mode in the Dashboard (toggle in the top-right), not Test.

5. **Coupon still valid**  
   Check the coupon isn’t expired and hasn’t hit “Max redemptions” (if set).

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
