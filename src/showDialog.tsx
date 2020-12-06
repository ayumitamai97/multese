import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './components/App'
import { Message } from './@types/message'

const multeseRootId = 'multeseRoot'
const createMulteseRoot = (): HTMLElement => {
  const multeseRoot = document.getElementById(multeseRootId) || document.createElement('div')
  multeseRoot.setAttribute('id', multeseRootId)
  return multeseRoot
}

const onPageChangedToComparePage = (message: Message, _sender, _callback) => {
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
      const renderIssueTemplateSelector = () => {
        const dataDialogId = (event.target as HTMLElement).getAttribute('data-dialog-id')
        if (dataDialogId && dataDialogId.match(/^convert-to-issue-/)) {
          const multeseRoot = createMulteseRoot()

          const timer = setInterval(() => {
            const targetNode = document.querySelector('.js-convert-note-to-issue-form')
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
        }
      }

      const columnContainer = document.querySelector('.project-columns-container')
      columnContainer.addEventListener('click', renderIssueTemplateSelector)
    }
  } else {
    const oldMulteseRoot = document.getElementById(multeseRootId)
    if (!oldMulteseRoot) { return }
    oldMulteseRoot.remove()
  }
}

chrome.runtime.onMessage.addListener(onPageChangedToComparePage)
