import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './components/app'
import { Message } from './@types/message'

const PAGE_TYPE_PROJECT = 'project'
const multeseRootId = 'multeseRoot'

const onPageChangedToComparePage = (message: Message, _sender, _callback) => {
  if (message.pageType) {
    if (message.pageType === PAGE_TYPE_PROJECT) { return }

    const multeseRoot = document.getElementById(multeseRootId) || document.createElement('div')
    multeseRoot.setAttribute('id', multeseRootId)

    const body = document.querySelector('body')
    body.appendChild(multeseRoot)

    ReactDOM.render(
      <App pageType={message.pageType} />,
      document.getElementById(multeseRootId)
    )
  } else {
    const oldMulteseRoot = document.getElementById(multeseRootId)
    if (!oldMulteseRoot) { return }
    oldMulteseRoot.remove()
  }
}

chrome.runtime.onMessage.addListener(onPageChangedToComparePage)
