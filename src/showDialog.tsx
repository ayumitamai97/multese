import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './components/App'
import { Message } from './@types/message'

const multeseRootId = 'multeseRoot'

const onPageChangedToComparePage = (message: Message, _sender, _callback) => {
  if (message.pageType) {
    const multeseRoot = document.getElementById(multeseRootId) || document.createElement('div')
    multeseRoot.setAttribute('id', multeseRootId)

    const targetNodeSelectorMapper = {
      compare: 'body',
      project: '.js-convert-note-to-issue-form'
    }

    const timer = setInterval(() => {
      const targetNode = document.querySelector(targetNodeSelectorMapper[message.pageType])
      if (targetNode) {
        clearInterval(timer)
        if (document.getElementById(multeseRootId)) { return }
        targetNode.appendChild(multeseRoot)

        ReactDOM.render(
          <App pageType={message.pageType} />,
          document.getElementById(multeseRootId)
        )
      }
    }, 50)
  } else {
    const oldMulteseRoot = document.getElementById(multeseRootId)
    if (!oldMulteseRoot) { return }
    oldMulteseRoot.remove()
  }
}

chrome.runtime.onMessage.addListener(onPageChangedToComparePage)
