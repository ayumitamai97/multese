import * as React from 'react'
import * as PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { FormControlLabel, Chip } from '@material-ui/core'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient, { gql } from 'apollo-boost'
const qs = require('querystring')

const GET_PR_TEMPLATES = gql`
query Query($repositoryName: String!, $repositoryOwner: String!, $refsRefPrefix: String!, $refsFirst: Int, $filePath: String!) {
  repository(name: $repositoryName, owner: $repositoryOwner) {
    refs(refPrefix: $refsRefPrefix, last: $refsFirst) {
      nodes {
        id
        target {
          __typename
          ... on Commit {
            file(path: $filePath) {
              name
              type
              path
              object {
                ... on Tree {
                  id
                  entries {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

const getTokenFromChromeStorage = (callback) => {
  chrome.storage.sync.get({ token: '' }, callback)
}

const extractRepositoryIdentifier = url =>
  url.match(/https:\/\/github\.com\/\w*\/\w*/)[0].replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '')

const styles = theme => ({
  chip: {
    'margin-left': theme.spacing(0.5)
    'margin-right': theme.spacing(0.5)
  },
})

const DEFAULT_TEMPLATE_NAME = 'default'

class PullRequestTemplateSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = { templateNames: [], selectedTemplateName: '' }
    this.selectTemplate = this.selectTemplate.bind(this)
    this.isSelected = this.isSelected.bind(this)
  }
  componentDidMount() {
    const query = qs.parse(location.search.replace('?', ''))
    const selectedTemplateName = query.template || DEFAULT_TEMPLATE_NAME
    this.setState({ selectedTemplateName })

    const repositoryIdentifier = extractRepositoryIdentifier(location.href)
    const [repositoryOwner, repositoryName] = repositoryIdentifier.split('/')

    getTokenFromChromeStorage((storageItems) => {
      const token = storageItems.token
      const githubClient = new ApolloClient({
        uri: 'https://api.github.com/graphql',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      githubClient.query({
        query: GET_PR_TEMPLATES,
        variables: {
          repositoryName,
          repositoryOwner,
          refsRefPrefix: 'refs/heads/',
          refsFirst: 1,
          filePath: '.github/PULL_REQUEST_TEMPLATE/'
        }
      }).then(({ data }) => {
        const lastCommit = data.repository.refs.nodes[0]
        const templateNamesFromRepository = lastCommit.target.file.object.entries.map(fileEntry => fileEntry.name)
        const templateNames = [DEFAULT_TEMPLATE_NAME, ...templateNamesFromRepository]
        this.setState({ templateNames })
      })
    })
  }
  selectTemplate({ target }) {
    const templateName = target.innerText
    if (templateName === DEFAULT_TEMPLATE_NAME) {
      location.href = `${location.origin}${location.pathname}`
    } else {
      const query = qs.parse(location.search.replace('?', ''))
      query.template = templateName
      const queryString = qs.stringify(query)
      location.href = `${location.origin}${location.pathname}?${queryString}`
    }
  }
  isSelected(value) {
    console.log(value)
    console.log(this.state.selectedTemplateName)
    return this.state.selectedTemplateName === value
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        {
          this.state.templateNames.map(templateName => (
            <Chip
              key={templateName}
              label={templateName}
              color={this.isSelected(templateName) ? 'primary' : 'default'}
              onClick={this.selectTemplate}
              className={classes.chip}
            />
          ))
        }
      </div>
    )
  }
}

PullRequestTemplateSelector.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PullRequestTemplateSelector)
