# Etsy Bulk Editor

Free Chrome extension for one focused task: bulk-editing Etsy shop manager listings. Select multiple listings, copy tags, preview price adjustments, and export to CSV directly on the page.

## Features

- **Bulk checkboxes** — appears automatically on your Etsy listings page
- **Copy tags** — copies tags from first selected listing to your clipboard
- **Price adjustment** — previews price changes by percentage across selected listings
- **Export CSV** — downloads selected listings as CSV with title, price, and tags

## Install (developer / sideload)

1. Clone or download this repo
2. Open Chrome → `chrome://extensions`
3. Enable **Developer mode**
4. **Load unpacked** → select this folder
5. Pin **Etsy Bulk Editor**

## Package for Web Store

```powershell
.\scripts\package.ps1
```

## Usage

1. Go to `etsy.com/your/shops/ME/tools/listings`
2. The bulk toolbar appears at the top automatically
3. Check the listings you want to work with
4. Use **Copy tags**, **Adjust price**, or **Export CSV**

## Notes

- Etsy does not expose a write API to extensions — price changes are shown for reference and must be applied manually in Etsy
- Tags are copied to clipboard for manual pasting
- Works on the listings management page only (`etsy.com/your/*`)

## License

MIT
