# H4 Services contact form and email setup

Your contact form can send submissions to an H4 Services email (e.g. **contact@h4services.co**). Two steps:

---

## 1. Create the email address (contact@h4services.co)

Since your domain is on **Cloudflare**, use **Email Routing** (free) to receive mail at any address @h4services.co:

1. In Cloudflare, open your domain **h4services.co**.
2. Go to **Email** → **Email Routing** (or **Workers & Pages** might show it; look for “Email” in the left sidebar).
3. Click **Get started** / **Enable Email Routing**.
4. Add a **Destination address**: the inbox where you want to receive contact form messages (e.g. your personal Gmail).
5. Add a **Custom address**: **contact** (so you get **contact@h4services.co**). Cloudflare will forward mail sent to contact@h4services.co to your destination inbox.

You can add more addresses later (e.g. hello@, support@). This setup is **receive-only**; to send *from* contact@h4services.co you’d use Google Workspace, Zoho, or another mail host.

---

## 2. Connect the form to that email (Formspree)

The site uses **Formspree** so the static site can send form submissions without a server. Formspree will email each submission to you.

1. Go to **[formspree.io](https://formspree.io)** and sign up (free plan is enough).
2. Click **+ New Form**.
3. **Email:** enter **contact@h4services.co** (or the address you set up in step 1). That’s where submissions will be sent.
4. **Form name:** e.g. “H4 Contact”.
5. Create the form. Formspree will show a form endpoint like **https://formspree.io/f/xyzdqwer**.
6. Copy the **form ID** (the part after `/f/`, e.g. `xyzdqwer`).
7. In your project, open **contact.html**. Find:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   Replace **YOUR_FORM_ID** with your Formspree form ID (e.g. `xyzdqwer`).
8. Save and push to GitHub. New submissions will go to contact@h4services.co (then forwarded to your inbox if you use Cloudflare Email Routing).

---

## Optional: thank-you page

After submit, the form redirects to `contact.html?sent=1` and shows a success message. To use a dedicated thank-you page instead, create e.g. **thank-you.html** and in the form add a hidden input:

```html
<input type="hidden" name="_next" value="https://www.h4services.co/thank-you.html">
```

(You can also set the redirect URL in Formspree’s form settings.)
