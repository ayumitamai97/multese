import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Button, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root: {
    'margin-top': theme.spacing(2);
    'margin-bottom': theme.spacing(2);
  },
  textField: {
    width: '100%';
    'margin-right': theme.spacing(1);
    'margin-bottom': theme.spacing(1);
  }
})

class RequestGithubToken extends React.Component {
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
    const { classes } = this.props
    return (
      <div class={classes.root}>
        <TextField
          type="text"
          value={this.state.token}
          onChange={this.handleChange}
          placeholder="Your GitHub personal access token"
          className={classes.textField}
        />
        <Button onClick={this.handleSubmit} variant='contained' color='primary'>
          Save
        </Button>
        <div>
          {this.state.formStatus}
        </div>
      </div>
    )
  }
}

RequestGithubToken.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RequestGithubToken)
