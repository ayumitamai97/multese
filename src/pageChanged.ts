import { Message } from './@types/message'

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") { return }

  if (tab.url && tab.url.match(/^https:\/\/github\.com\/\w*\/\w*\/compare\/\w*/)) {
    const message: Message = { pageType: 'compare' }
    chrome.tabs.sendMessage(tabId, message, null)
  } else {
    const message: Message = { pageType: '' }
    chrome.tabs.sendMessage(tabId, message, null)
  }
})
