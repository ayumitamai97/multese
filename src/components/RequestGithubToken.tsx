import * as React from 'react'
import { Button, TextField } from '@material-ui/core'
import { withStyles, Theme } from '@material-ui/core/styles'

const styles = (theme: Theme) => ({
  root: {
    'margin-top': theme.spacing(2),
    'margin-bottom': theme.spacing(2),
  },
  textField: {
    width: '100%',
    'margin-right': theme.spacing(1),
    'margin-bottom': theme.spacing(1),
  }
})

interface RequestGithubTokenProps {
  classes: { [key: string]: string }
}
interface RequestGithubTokenState {
  token: string
  submitButtonText: string
}

class RequestGithubToken extends React.Component<RequestGithubTokenProps, RequestGithubTokenState> {
  constructor(props) {
    super(props)
    this.state = { token: '', submitButtonText: 'Save' }
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
      this.setState({ submitButtonText: 'Saved' })
      setTimeout(() => {
        location.reload()
      }, 1000)
    })
  }
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <TextField
          type='text' // Avoid password manager detection
          value={this.state.token}
          onChange={this.handleChange}
          placeholder='Your GitHub personal access token'
          className={classes.textField}
        />
        <Button onClick={this.handleSubmit} variant='contained' color='primary' size='small'>
          {this.state.submitButtonText}
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(RequestGithubToken)
