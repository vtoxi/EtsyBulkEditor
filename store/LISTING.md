# Chrome Web Store Listing — Etsy Bulk Editor

## Privacy policy URL
https://github.com/vtoxi/EtsyBulkEditor/blob/main/PRIVACY.md

## Listing fields

### Name
Etsy Bulk Editor — Bulk Listing Editor

### Short description (≤132 characters)
Bulk-edit selected Etsy listings by copying tags, previewing price changes, or exporting listing data to CSV. No account needed.

### Detailed description

Etsy's native bulk editing tools are limited. Etsy Bulk Editor gives you one focused workflow for working with multiple listings at once.

A toolbar appears automatically on your Etsy listings page. Select any number of listings with checkboxes, then:

• **Copy tags** — Copy the tags from one listing to your clipboard, ready to paste into others
• **Adjust prices** — Preview how a percentage change (e.g. +10% or -5%) affects your selected listings' prices
• **Export CSV** — Download your selected listings as a CSV file (listing ID, title, price, tags)

The editor stays focused on bulk listing work:
• Works directly on etsy.com/your/shops — no external dashboard
• Checkbox on every listing row
• Select all / deselect all buttons
• Activity toast notifications
• No login, no account, no data collected

How to use:
1. Install and pin Etsy Bulk Editor
2. Go to your Etsy shop manager → Listings
3. The bulk toolbar appears at the top automatically
4. Check listings → use Copy tags, Adjust price, or Export CSV

### Category
Productivity

### Language
English

## Privacy practices

- **Website content** — Yes (reads listing data visible on your Etsy shop manager page)
- **Personally identifiable information** — No
- **Does not sell data** — Yes
- **Limited Use** — Yes

Remote code: No
Single purpose: Bulk editing Etsy shop manager listings

## Permission justifications

**storage**
Reserved for future settings preferences. Currently no data is stored.

**downloads**
Saves the exported CSV file of selected listings to the user's Downloads folder when they click Export CSV.

**Host permission: https://www.etsy.com/***
Required to inject the bulk toolbar and checkboxes into the Etsy shop manager listings page, which runs on www.etsy.com.

## Screenshots needed (1280×800)

| # | Shows |
|---|-------|
| 1 | Listings page with bulk toolbar and checkboxes visible |
| 2 | Price adjustment panel open with preview |
| 3 | CSV export dialog / download confirmation |

See `store/screenshots/` for HTML mockup files.

## Developer checklist

- [ ] Run `.\scripts\generate-icons.ps1`
- [ ] Run `.\scripts\package.ps1`
- [ ] Load unpacked on your Etsy listings page and test all 3 actions
- [ ] Upload ZIP from `dist/`
- [ ] Submit for review
