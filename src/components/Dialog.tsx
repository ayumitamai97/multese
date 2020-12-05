import * as React from 'react'
import { Box, Grid, Typography, Link, Divider, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import RequestGithubToken from './RequestGithubToken'
import PullRequestTemplateSelector from './PullRequestTemplateSelector'

const styles = (theme: Theme) => (createStyles({
  root: {
    width: '360px',
    background: theme.palette.common.white,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    position: 'fixed',
    top: theme.spacing(4),
    right: theme.spacing(1),
  },
  header: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}))

interface DialogProps {
  classes: { [key: string]: string }
}
interface DialogState {
  showDialog: boolean
  showRequestGithubTokenForm: boolean
  token: string
}

class Dialog extends React.Component<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props)
    this.state = { showDialog: true, token: '', showRequestGithubTokenForm: false }
    this.showRequestGithubTokenForm = this.showRequestGithubTokenForm.bind(this)
    this.handleClose = this.handleClose.bind(this)
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
  handleClose() {
    this.setState({ showDialog: false })
  }
  render() {
    const { classes } = this.props
    if (!this.state.showDialog) { return null }
    return (
      <Box className={classes.root} boxShadow={2}>
        <Grid container justify='space-between' alignItems='center' className={classes.header}>
          <Typography variant='h6'>
            Select Pull Request Template
          </Typography>
          <IconButton size='small' onClick={this.handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        { this.state.token && <PullRequestTemplateSelector /> }
        <Divider className={classes.divider} />
        {
          this.state.token && (
            <Link component='a' onClick={this.showRequestGithubTokenForm}>
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

export default withStyles(styles)(Dialog)
