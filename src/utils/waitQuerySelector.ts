const waitQuerySelector = (query: string, callback: (targetNode: Element) => void): void => {
  const timer = setInterval(() => {
    const targetNode = document.querySelector(query)
    if (targetNode) {
      clearInterval(timer)
      callback(targetNode)
    }
  }, 50)
}

export default waitQuerySelector
