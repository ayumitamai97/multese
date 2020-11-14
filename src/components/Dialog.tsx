import * as React from 'react'
import * as PropTypes from 'prop-types'
import { Box, Typography, Link, Divider } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import RequestGithubToken from './RequestGithubToken'
import PullRequestTemplateSelector from './PullRequestTemplateSelector'

const styles = (theme) => ({
  root: {
    width: '360px';
    background: theme.palette.common.white;
    padding: theme.spacing(2);
    'border-radius': theme.shape.borderRadius;
    position: 'fixed';
    top: theme.spacing(4);
    right: theme.spacing(1);
  },
  title: {
    'margin-bottom': theme.spacing(1);
  },
  divider: {
    'margin-top': theme.spacing(2);
    'margin-bottom': theme.spacing(2);
  }
})

class Dialog extends React.Component {
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
    const { classes } = this.props
    return (
      <Box className={classes.root} boxShadow={2}>
        <Typography variant='h6' className={classes.title}>
          Select Pull Request template
        </Typography>
        {
          this.state.token && <PullRequestTemplateSelector />
        }
        <Divider className={classes.divider} />
        {
          this.state.token && (
            <Link onClick={this.showRequestGithubTokenForm} size='small'>
              Update GitHub personal access token
            </Link>
          )
        }
        {
          (this.state.token.length === 0 || this.state.showRequestGithubTokenForm) &&
            <RequestGithubToken />
        }
      </Box>
    )
  }
}

Dialog.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Dialog)
