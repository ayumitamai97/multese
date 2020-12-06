import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './components/App'
import { Message } from './@types/message'
import waitQuerySelector from './utils/waitQuerySelector'

const multeseRootId = 'multeseRoot'
const createMulteseRoot = (): HTMLElement => {
  const multeseRoot = document.getElementById(multeseRootId) || document.createElement('div')
  multeseRoot.setAttribute('id', multeseRootId)
  return multeseRoot
}

const renderIssueTemplateSelector = function (event) {
  const { message } = this as any
  const dataDialogId = (event.target as HTMLElement).getAttribute('data-dialog-id')
  if (dataDialogId && dataDialogId.match(/^convert-to-issue-/)) {
    const multeseRoot = createMulteseRoot()

    waitQuerySelector('.js-convert-note-to-issue-form', (targetNode) => {
      if (document.getElementById(multeseRootId)) { return }
      targetNode.appendChild(multeseRoot)

      ReactDOM.render(
        <App pageType={message.pageType} />,
        document.getElementById(multeseRootId)
      )
    })
  }
}

const onPageChangedToComparePage = function (message: Message, _sender, _callback): void {
  if (message.pageType) {
    const multeseRoot = createMulteseRoot()

    if (message.pageType === 'compare') {
      const targetNode = document.querySelector('body')
      targetNode.appendChild(multeseRoot)

      ReactDOM.render(
        <App pageType={message.pageType} />,
        document.getElementById(multeseRootId)
      )
    } else if (message.pageType === 'project') {
      const columnContainer = document.querySelector('.project-columns-container')
      this.message = message
      columnContainer.addEventListener('click', renderIssueTemplateSelector.bind(this))
    }
  } else {
    const oldMulteseRoot = document.getElementById(multeseRootId)
    if (!oldMulteseRoot) { return }
    oldMulteseRoot.remove()
  }
}

chrome.runtime.onMessage.addListener(onPageChangedToComparePage)
