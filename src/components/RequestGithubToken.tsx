import * as React from 'react'

export default class RequestGithubToken extends React.Component {
  constructor(props) {
    super(props)
    this.state = { token: '', formStatus: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange({ target }) {
    this.setState({ token: target.value })
  }
  handleSubmit() {
    chrome.storage.sync.set({
      token: this.state.token
    }, () => {
      this.setState({ formStatus: 'Saved' })
      setTimeout(() => {
        this.setState({ formStatus: '' })
        location.reload()
      }, 1000)
    })
  }
  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.token}
          onChange={this.handleChange}
          placeholder="Your GitHub personal access token"
        />
        <button onClick={this.handleSubmit}>
          Save
        </button>
        <div>
          {this.state.formStatus}
        </div>
      </div>
    )
  }
}

