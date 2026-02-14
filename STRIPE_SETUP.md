# Stripe setup: one-time setup + recurring monthly payments

Pricing is on **Get started** (`get-started.html`). Customers choose a plan and click “Pay setup & subscribe” to go to **Stripe Checkout** for the setup fee and monthly subscription. You never handle card numbers.

## 1. Create a Stripe account

- Go to **https://dashboard.stripe.com/register**
- Complete signup and verify your account (you can use test mode first).

## 2. Create products and prices in Stripe

### Standard plan

1. In Stripe Dashboard: **Product catalog** → **Add product**
2. **Name:** `H4 Services – Standard`
3. **Description:** (optional) One-time setup + $250/month maintenance
4. **Pricing:**
   - Add a **Recurring** price: **$250** / **Month**
   - Save the product.
5. Add a **one-time** price to the same product (or create a separate product “Standard setup”):
   - **One time** price: **$2,000** (name it e.g. “Standard setup fee”)

### Premium plan

1. **Add product** → **Name:** `H4 Services – Premium`
2. **Recurring** price: **$500** / **Month**
3. **One time** price: **$5,000** (e.g. “Premium setup fee”)

## 3. Create Payment Links (setup + subscription in one checkout)

Stripe **Payment Links** can collect a one-time payment and start a subscription in a single checkout.

### Option A: Subscription + one-time (recommended)

1. Go to **Payment Links** → **New**
2. **Standard:**
   - Choose the **Standard** product with **$250/month** recurring.
   - Enable **Collect a one-time payment** (or “Add one-time payment”) and set **$2,000** (or link your “Standard setup” one-time price).
   - Under **After payment**, set “Redirect to” your site (e.g. `https://yoursite.com/thank-you.html`).
   - Create link → **Copy link**.
3. **Premium:** Same steps with **$500/month** and **$5,000** one-time.

### Option B: Two-step (setup then subscribe)

If your Stripe version doesn’t support “one-time + subscription” in one link:

- Create one **Payment Link** for the **one-time** setup ($2,000 or $5,000).
- After payment, use Stripe **Customer portal** or a second link so the customer can add the monthly subscription. (More steps for the customer.)

Use **Option A** if available so the customer pays setup and subscribes in one go.

## 4. Add your links to the site

1. Open **get-started.html** (Pricing page) in your project.
2. Find the `<script>` block near the bottom with `STRIPE_LINKS`.
3. Replace the placeholders with your real Payment Link URLs:

```javascript
var STRIPE_LINKS = {
  standard: 'https://buy.stripe.com/xxxxxxxxxxxxx',   // your Standard link
  premium: 'https://buy.stripe.com/xxxxxxxxxxxxx'     // your Premium link
};
```

4. Save and deploy. The “Pay setup & subscribe” buttons will send customers to your Stripe checkout.

## 5. After payment

- You’ll see the payment and new subscriber in **Stripe Dashboard** → **Payments** and **Customers**.
- Stripe will charge the card each month for the recurring amount.
- Optionally add a **thank-you page** and set that as the “Redirect after payment” URL in the Payment Link.

## Security notes

- Card data is entered only on Stripe’s hosted page (PCI compliant).
- Do not put your Stripe **secret key** in the website; only **Payment Links** (or publishable key for Stripe.js) are safe in the browser.
- Use **test mode** (test card `4242 4242 4242 4242`) until you’re ready to go live, then switch to live mode and create live Payment Links.

## Help

- Stripe Payment Links: https://stripe.com/docs/payment-links  
- Subscriptions: https://stripe.com/docs/billing/subscriptions/overview  
