// Etsy Bulk Editor — injects bulk-select tools into the Etsy shop manager listings page

(function () {
  'use strict';

  // Only run once
  if (document.getElementById('ebe-toolbar')) return;

  // State
  let selectedListings = new Set();
  let allListings = [];

  // ── Listing detection ──────────────────────────────────────
  function getListingRows() {
    // Etsy shop manager listing rows — try multiple selectors for compatibility
    return [
      ...document.querySelectorAll('[data-listing-id]'),
      ...document.querySelectorAll('.listing-row'),
      ...document.querySelectorAll('[class*="listing-card"]'),
    ].filter(el => {
      const id = el.getAttribute('data-listing-id') || el.dataset.listingId;
      return !!id;
    });
  }

  function getListingId(row) {
    return row.getAttribute('data-listing-id') || row.dataset.listingId || null;
  }

  function getListingData(row) {
    const id = getListingId(row);
    const titleEl = row.querySelector('[class*="title"], h3, h2, .listing-title, [data-testid*="title"]');
    const title = titleEl ? titleEl.textContent.trim() : `Listing ${id}`;
    const priceEl = row.querySelector('[class*="price"], .currency-value, [data-testid*="price"]');
    const priceText = priceEl ? priceEl.textContent.trim() : '';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || null;
    const tagsEl = row.querySelector('[class*="tag"], [data-testid*="tag"]');
    const tags = tagsEl ? tagsEl.textContent.trim() : '';
    const imageEl = row.querySelector('img');
    const image = imageEl ? imageEl.src : '';
    return { id, title, price, tags, image };
  }

  // ── Toolbar HTML ───────────────────────────────────────────
  function createToolbar() {
    const bar = document.createElement('div');
    bar.id = 'ebe-toolbar';
    bar.innerHTML = `
      <div class="ebe-inner">
        <div class="ebe-left">
          <button id="ebe-select-all" class="ebe-btn ebe-btn-ghost" title="Select all visible listings">Select all</button>
          <button id="ebe-deselect-all" class="ebe-btn ebe-btn-ghost">Deselect all</button>
          <span id="ebe-count" class="ebe-count">0 selected</span>
        </div>
        <div class="ebe-right">
          <button id="ebe-copy-tags" class="ebe-btn" disabled title="Copy tags from first selected listing to all others">Copy tags</button>
          <button id="ebe-price-adjust" class="ebe-btn" disabled title="Adjust prices of selected listings by a percentage">Adjust price</button>
          <button id="ebe-export-csv" class="ebe-btn" disabled title="Export selected listings to CSV">Export CSV</button>
        </div>
      </div>
      <!-- Price adjust panel -->
      <div id="ebe-price-panel" class="ebe-panel" style="display:none">
        <label class="ebe-label">Adjust prices by (%)</label>
        <div class="ebe-row">
          <input id="ebe-price-pct" type="number" class="ebe-input" placeholder="e.g. +10 or -5" step="0.1">
          <button id="ebe-price-apply" class="ebe-btn ebe-btn-primary">Apply</button>
          <button id="ebe-price-cancel" class="ebe-btn ebe-btn-ghost">Cancel</button>
        </div>
        <p class="ebe-note">⚠️ This shows new prices for review — you must save changes in Etsy manually.</p>
      </div>
    `;
    return bar;
  }

  // ── Inject checkboxes ──────────────────────────────────────
  function injectCheckboxes() {
    const rows = getListingRows();
    allListings = rows.map(getListingData);

    for (const row of rows) {
      if (row.querySelector('.ebe-checkbox-wrap')) continue;
      const id = getListingId(row);
      if (!id) continue;

      const wrap = document.createElement('label');
      wrap.className = 'ebe-checkbox-wrap';
      wrap.setAttribute('title', 'Select this listing');
      wrap.innerHTML = `<input type="checkbox" class="ebe-checkbox" data-id="${id}" aria-label="Select listing ${id}">`;

      wrap.addEventListener('click', e => e.stopPropagation());
      wrap.querySelector('input').addEventListener('change', function () {
        if (this.checked) selectedListings.add(id);
        else selectedListings.delete(id);
        updateToolbar();
      });

      row.style.position = 'relative';
      row.prepend(wrap);
    }
  }

  function updateToolbar() {
    const count = selectedListings.size;
    document.getElementById('ebe-count').textContent = `${count} selected`;
    const hasAny = count > 0;
    document.getElementById('ebe-copy-tags').disabled = count < 2;
    document.getElementById('ebe-price-adjust').disabled = !hasAny;
    document.getElementById('ebe-export-csv').disabled = !hasAny;
  }

  // ── Toolbar actions ────────────────────────────────────────

  function onSelectAll() {
    document.querySelectorAll('.ebe-checkbox').forEach(cb => {
      cb.checked = true;
      selectedListings.add(cb.dataset.id);
    });
    updateToolbar();
  }

  function onDeselectAll() {
    document.querySelectorAll('.ebe-checkbox').forEach(cb => {
      cb.checked = false;
    });
    selectedListings.clear();
    updateToolbar();
  }

  function onCopyTags() {
    const selected = allListings.filter(l => selectedListings.has(l.id));
    if (selected.length < 2) return;
    const sourceTags = selected[0].tags;
    if (!sourceTags) { alert('AmazonHunt: First selected listing has no visible tags.'); return; }

    const msg = `Copy tags from:\n"${selected[0].title}"\n\nTo ${selected.length - 1} other listing(s)?\n\nTags: ${sourceTags}\n\n⚠️ Note: Etsy does not expose a write API. This will copy the tags to your clipboard so you can paste them manually in each listing's edit page.`;
    if (!confirm(msg)) return;

    navigator.clipboard.writeText(sourceTags).then(() => {
      showToast(`Tags copied to clipboard! Open each listing's edit page and paste.`);
    }).catch(() => {
      prompt('Copy these tags:', sourceTags);
    });
  }

  function onPriceAdjust() {
    const panel = document.getElementById('ebe-price-panel');
    panel.style.display = panel.style.display === 'none' ? '' : 'none';
  }

  function onPriceApply() {
    const pct = parseFloat(document.getElementById('ebe-price-pct').value);
    if (isNaN(pct)) { showToast('Enter a valid percentage (e.g. 10 or -5)'); return; }

    const selected = allListings.filter(l => selectedListings.has(l.id));
    const lines = selected.map(l => {
      if (!l.price) return `${l.title}: (no price detected)`;
      const newPrice = Math.round(l.price * (1 + pct / 100) * 100) / 100;
      return `${l.title}: $${l.price} → $${newPrice}`;
    });

    const msg = `Proposed price changes (${pct > 0 ? '+' : ''}${pct}%):\n\n${lines.join('\n')}\n\n⚠️ Etsy does not allow extensions to change prices directly. Copy this to adjust in Etsy's bulk edit tool.`;
    const result = lines.map(l => l).join('\n');
    navigator.clipboard.writeText(result).catch(() => {});
    alert(msg);
    document.getElementById('ebe-price-panel').style.display = 'none';
  }

  function onExportCSV() {
    const selected = allListings.filter(l => selectedListings.has(l.id));
    const header = ['Listing ID', 'Title', 'Price', 'Tags'];
    const rows = selected.map(l => [
      l.id,
      `"${(l.title || '').replace(/"/g, '""')}"`,
      l.price !== null ? l.price : '',
      `"${(l.tags || '').replace(/"/g, '""')}"`,
    ].join(','));
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etsy_listings_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${selected.length} listings to CSV`);
    // Also send to background for chrome.downloads fallback
    chrome.runtime.sendMessage({ action: 'downloadCSV', csv, filename: a.download });
  }

  // ── Toast notification ─────────────────────────────────────
  function showToast(msg) {
    const existing = document.getElementById('ebe-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'ebe-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  // ── Mount ──────────────────────────────────────────────────
  function mount() {
    const toolbar = createToolbar();

    // Try to inject before the listing grid
    const targetSelectors = [
      '[class*="listing-manager"]',
      '[data-testid*="listing"]',
      '#manage-listings',
      'main',
      '.page-content',
    ];
    let target = null;
    for (const sel of targetSelectors) {
      target = document.querySelector(sel);
      if (target) break;
    }
    if (!target) target = document.body;
    target.insertBefore(toolbar, target.firstChild);

    injectCheckboxes();

    // Wire up events
    document.getElementById('ebe-select-all').addEventListener('click', onSelectAll);
    document.getElementById('ebe-deselect-all').addEventListener('click', onDeselectAll);
    document.getElementById('ebe-copy-tags').addEventListener('click', onCopyTags);
    document.getElementById('ebe-price-adjust').addEventListener('click', onPriceAdjust);
    document.getElementById('ebe-price-apply').addEventListener('click', onPriceApply);
    document.getElementById('ebe-price-cancel').addEventListener('click', () => {
      document.getElementById('ebe-price-panel').style.display = 'none';
    });
    document.getElementById('ebe-export-csv').addEventListener('click', onExportCSV);
  }

  // Wait for DOM to be populated, then mount
  function tryMount() {
    if (getListingRows().length > 0) {
      mount();
    } else {
      // Observe for dynamic content
      const observer = new MutationObserver(() => {
        if (getListingRows().length > 0 && !document.getElementById('ebe-toolbar')) {
          mount();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      // Fallback after 5s
      setTimeout(() => {
        if (!document.getElementById('ebe-toolbar')) mount();
      }, 5000);
    }
  }

  // Re-inject checkboxes on navigation (Etsy is an SPA)
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      selectedListings.clear();
      setTimeout(() => {
        if (!document.getElementById('ebe-toolbar')) tryMount();
        else injectCheckboxes();
      }, 1500);
    }
  }).observe(document, { subtree: true, childList: true });

  tryMount();
})();
