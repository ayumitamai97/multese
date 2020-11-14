import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Dialog from './components/Dialog'

const multeseRootId = 'multeseRoot'

const onPageChangedToComparePage = (message, _sender, _callback) => {
  if (message.pageType === 'compare') {
    const multeseRoot = document.getElementById(multeseRootId) || document.createElement('div')
    multeseRoot.setAttribute('id', multeseRootId)

    const body = document.querySelector('body')
    body.appendChild(multeseRoot)

    ReactDOM.render(
      <Dialog />,
      document.getElementById(multeseRootId)
    )
  } else {
     const oldMulteseRoot = document.getElementById(multeseRootId)
     if (!oldMulteseRoot) { return }
     oldMulteseRoot.remove()
  }
}

chrome.runtime.onMessage.addListener(onPageChangedToComparePage)
