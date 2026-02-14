# Taking H4 Services Online (GitHub Pages + Custom Domain)

Your site is in the repo **GatorHunt305/Cursor-Project-Website-Design**. You can go live in two steps: (1) turn on GitHub Pages for an instant URL, then (2) add your H4 Services domain when you have it.

---

## Step 1: Go live with GitHub Pages (do this first)

1. On GitHub, open your repo: **https://github.com/GatorHunt305/Cursor-Project-Website-Design**
2. Click **Settings** (top menu of the repo).
3. In the left sidebar, click **Pages** (under "Code and automation").
4. Under **Build and deployment**:
   - **Source:** select **Deploy from a branch**
   - **Branch:** choose **main**, folder **/ (root)**
   - Click **Save**.
5. Wait 1–2 minutes. GitHub will build and deploy your site.

**Your live site URL (right away):**

**https://gatorhunt305.github.io/Cursor-Project-Website-Design/**

- Home: `.../index.html` · About: `.../about.html` · Contact: `.../contact.html` · Get started: `.../get-started.html` · Case studies: `.../case-studies.html` · HVAC mock: `.../mock-hvac.html`

If the URL doesn’t work right away, wait a few minutes and try again.

---

## Step 2: Secure and use an H4 Services domain

### Register the domain

Pick a registrar and search for names you want (e.g. **h4services.com**, **h4-services.com**). Common registrars:

- [Cloudflare](https://www.cloudflare.com/products/registrar/) – at-cost pricing, good DNS
- [Namecheap](https://www.namecheap.com/)
- [Google Domains](https://domains.google/) (now Squarespace Domains)
- [Porkbun](https://porkbun.com/)

Buy the domain. You’ll manage DNS at the registrar.

### Connect the domain to GitHub Pages

1. In your repo on GitHub, go to **Settings** → **Pages**.
2. Under **Custom domain**, type your domain (e.g. `h4services.com` or `www.h4services.com`).
3. Click **Save**. GitHub may show a “DNS check” or “Not yet verified” until DNS is set.
4. At your **domain registrar** (where you bought the domain), add these records:

   | Type | Name  | Value |
   |------|--------|--------|
   | **A**  | `@`    | `185.199.108.153` |
   | **A**  | `@`    | `185.199.109.153` |
   | **A**  | `@`    | `185.199.110.153` |
   | **A**  | `@`    | `185.199.111.153` |
   | **CNAME** | `www` | `gatorhunt305.github.io` |

   (If the registrar has a “root” or “apex” option, use it for the `@` A records; `www` is the subdomain for the CNAME.)

5. Wait for DNS to propagate (often 5–30 minutes, sometimes up to 48 hours).
6. Back in GitHub **Settings** → **Pages**, if **Enforce HTTPS** is available, turn it on so the site is served over HTTPS.

After DNS is correct, your site will load at **https://yourdomain.com** (and **https://www.yourdomain.com** if you use the CNAME).

### After the domain is live

- In **Stripe** (Dashboard → Payment links), set the “Redirect after payment” URL for each plan to your real site (e.g. `https://h4services.com/thank-you.html` if you add that page).
- Replace the test Payment Link URLs in `get-started.html` with your **live** Stripe links when you’re ready to accept real payments.
