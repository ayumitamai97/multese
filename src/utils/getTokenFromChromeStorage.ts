export const getTokenFromChromeStorage = (callback: (items: { [key: string]: any }) => void) => {
  return chrome.storage.sync.get({ token: '' }, callback)
}
