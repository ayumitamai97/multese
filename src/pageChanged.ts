chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") { return }

  if (tab.url && tab.url.match(/^https:\/\/github\.com\/\w*\/\w*\/compare\/\w*/)) {
    const message = { pageType: 'compare' }
    chrome.tabs.sendMessage(tabId, message, null)
  } else {
    const message = { pageType: '' }
    chrome.tabs.sendMessage(tabId, message, null)
  }
})
