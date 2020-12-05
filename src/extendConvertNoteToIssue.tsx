import * as React from 'react'
import * as ReactDOM from 'react-dom'
import IssueTemplateSelector from './components/IssueTemplateSelector'
import { Message } from './@types/message'
import App from './components/app'

const PAGE_TYPE_PROJECT = 'project'
const multeseRootId = 'multeseRoot'

const renderIssueTemplateSelector = (event) => {
  const dataDialogId = (event.target as HTMLElement).getAttribute('data-dialog-id')
  if (dataDialogId && dataDialogId.match(/^convert-to-issue-/)) {
    const multeseRoot = document.getElementById(multeseRootId) || document.createElement('div')
    multeseRoot.setAttribute('id', multeseRootId)

    const timer = setInterval(() => {
      const targetNode = document.querySelector('.js-convert-note-to-issue-form')
      if (targetNode) {
        clearInterval(timer)
        if (document.getElementById(multeseRootId)) { return }
        targetNode.appendChild(multeseRoot)

        ReactDOM.render(
          <App pageType={PAGE_TYPE_PROJECT} />,
          document.getElementById(multeseRootId)
        )
      }
    }, 50)
  }
}

const onPageChangedToComparePage = (message: Message, _sender, _callback) => {
  if (message.pageType) {
    if (message.pageType !== PAGE_TYPE_PROJECT) { return }

    const columnContainer = document.querySelector('.project-columns-container')
    columnContainer.addEventListener('click', renderIssueTemplateSelector)
  } else {
    const oldMulteseRoot = document.getElementById(multeseRootId)
    if (!oldMulteseRoot) { return }
    oldMulteseRoot.remove()
  }
}

chrome.runtime.onMessage.addListener(onPageChangedToComparePage)
