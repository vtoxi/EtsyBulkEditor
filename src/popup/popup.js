// Check if we're on an Etsy listings page and show status

(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.includes('etsy.com/your')) {
      document.getElementById('btn-open-listings').textContent = '✅ Etsy shop manager detected';
      document.getElementById('btn-open-listings').style.background = '#15803d';
    }
  } catch (_) {}
})();
