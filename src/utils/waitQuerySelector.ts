const waitQuerySelector = (query: string, callback: (targetNode: Element) => void): void => {
  let milliseconds = 0
  const timer = setInterval(() => {
    const targetNode = document.querySelector(query)
    milliseconds += 50
    if (targetNode) {
      clearInterval(timer)
      callback(targetNode)
    } else if (milliseconds >= 5000) {
      console.error('Multese could not find target node')
      clearInterval(timer)
    }
  }, 50)
}

export default waitQuerySelector
