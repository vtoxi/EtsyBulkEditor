// Etsy Bulk Editor — minimal background service worker

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'downloadCSV') {
    const blob = new Blob([msg.csv || ''], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url,
      filename: msg.filename || 'etsy_listings.csv',
      saveAs: false,
    }).finally(() => {
      setTimeout(() => { try { URL.revokeObjectURL(url); } catch (_) {} }, 60000);
    });
    sendResponse({ ok: true });
  }
  return false;
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Etsy Bulk Editor installed');
});
