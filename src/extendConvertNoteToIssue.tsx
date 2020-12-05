import * as React from 'react'
import * as ReactDOM from 'react-dom'
import IssueTemplateSelector from './components/IssueTemplateSelector'
import { Message } from './@types/message'

const multeseRootId = 'multeseRoot'

const onPageChangedToComparePage = (message: Message, _sender, _callback) => {
  if (message.pageType) {
    if (message.pageType !== 'project') { return }

    const columnContainer = document.querySelector('.project-columns-container')
    columnContainer.addEventListener('click', event => {
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
              <IssueTemplateSelector />,
              document.getElementById(multeseRootId)
            )
          }
        }, 50)
      }
    })
  } else {
    const oldMulteseRoot = document.getElementById(multeseRootId)
    if (!oldMulteseRoot) { return }
    oldMulteseRoot.remove()
  }
}

chrome.runtime.onMessage.addListener(onPageChangedToComparePage)
