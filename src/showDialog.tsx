import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Dialog from './components/Dialog'
import { Message } from './@types/message'

const multeseRootId = 'multeseRoot'

const onPageChangedToComparePage = (message: Message, _sender, _callback) => {
  if (message.pageType) {
    if (message.pageType === 'project') { return }

    const multeseRoot = document.getElementById(multeseRootId) || document.createElement('div')
    multeseRoot.setAttribute('id', multeseRootId)

    const body = document.querySelector('body')
    body.appendChild(multeseRoot)

    ReactDOM.render(
      <Dialog pageType={message.pageType} />,
      document.getElementById(multeseRootId)
    )
  } else {
    const oldMulteseRoot = document.getElementById(multeseRootId)
    if (!oldMulteseRoot) { return }
    oldMulteseRoot.remove()
  }
}

chrome.runtime.onMessage.addListener(onPageChangedToComparePage)
