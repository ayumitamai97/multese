import * as React from 'react'
import RequestGithubToken from './RequestGithubToken'
import PullRequestTemplateSelectBox from './PullRequestTemplateSelectBox'

export default class Dialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { token: '' }
  }
  componentDidMount() {
    chrome.storage.sync.get({
      token: ''
    }, (items) => {
      this.setState({ token: items.token })
    })
  }
  render() {
    return (
      <div>
        <RequestGithubToken />
        <PullRequestTemplateSelectBox />
      </div>
    )
  }
}
