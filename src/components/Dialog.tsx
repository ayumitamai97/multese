import * as React from 'react'
import RequestGithubToken from './RequestGithubToken'
import PullRequestTemplateSelector from './PullRequestTemplateSelector'
import '../assets/dialog.scss'

export default class Dialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { token: '', showRequestGithubTokenForm: false }
    this.showRequestGithubTokenForm = this.showRequestGithubTokenForm.bind(this)
  }
  componentDidMount() {
    chrome.storage.sync.get({
      token: ''
    }, (items) => {
      this.setState({ token: items.token })
    })
  }
  showRequestGithubTokenForm() {
    this.setState({ showRequestGithubTokenForm: true })
  }
  render() {
    return (
      <div className='multese-dialog'>
        {
          this.state.token && <PullRequestTemplateSelector />
        }
        {
          this.state.token && (
            <button onClick={this.showRequestGithubTokenForm}>
              Update GitHub personal access token
            </button>
          )
        }
        {
          (this.state.token.length === 0 || this.state.showRequestGithubTokenForm) &&
            <RequestGithubToken />
        }
      </div>
    )
  }
}
