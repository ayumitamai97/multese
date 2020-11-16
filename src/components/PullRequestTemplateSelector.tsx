import * as React from 'react'
import { withStyles, Theme } from '@material-ui/core/styles'
import { Chip } from '@material-ui/core'
import ApolloClient, { gql } from 'apollo-boost'
import qs = require('querystring')

const GET_DEFAULT_BRANCH_NAME = gql`
query Query($repositoryName: String!, $repositoryOwner: String!) {
  repository(name: $repositoryName, owner: $repositoryOwner) {
    defaultBranchRef {
      name
    }
  }
}
`

const GET_PR_TEMPLATES = gql`
query Query($repositoryName: String!, $repositoryOwner: String!, $refsRefPrefix: String!, $refsLast: Int, $refsQuery: String!, $filePath: String!) {
  repository(name: $repositoryName, owner: $repositoryOwner) {
    refs(refPrefix: $refsRefPrefix, last: $refsLast, query: $refsQuery) {
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

const styles = (theme: Theme) => ({
  chip: {
    'margin-left': theme.spacing(0.5),
    'margin-right': theme.spacing(0.5)
  },
})

const DEFAULT_TEMPLATE_NAME = 'default'

interface PullRequestTemplateSelectorProps {
  classes: { [key: string]: string }
}

interface PullRequestTemplateSelectorState {
  templateNames: Array<string>
  selectedTemplateName: string
}

interface GithubRepository {
  ownerName: string
  name: string
}

class PullRequestTemplateSelector extends React.Component<PullRequestTemplateSelectorProps, PullRequestTemplateSelectorState> {
  constructor(props) {
    super(props)
    this.state = { templateNames: [], selectedTemplateName: '' }
    this.selectTemplate = this.selectTemplate.bind(this)
    this.isSelected = this.isSelected.bind(this)
  }
  componentDidMount() {
    const query = qs.parse(location.search.replace('?', ''))
    const selectedTemplateName = (Array.isArray(query.template) ? query.template[0] : query.template) || DEFAULT_TEMPLATE_NAME
    this.setState({ selectedTemplateName })

    const repositoryIdentifier = this.extractRepositoryIdentifier(location.href)
    const [repositoryOwner, repositoryName] = repositoryIdentifier.split('/')
    const githubRepository: GithubRepository = { ownerName: repositoryOwner, name: repositoryName }

    this.getTokenFromChromeStorage((storageItems) => this.getTemplateNames(storageItems, githubRepository))
  }
  getTokenFromChromeStorage(callback: function) {
    return chrome.storage.sync.get({ token: '' }, callback)
  }
  extractRepositoryIdentifier(url: string): string {
    return url.match(/https:\/\/github\.com\/\w*\/\w*/)[0].replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '')
  }
  async getTemplateNames(storageItems: any, githubRepository: GithubRepository) {
    const token = storageItems.token
    const githubClient = new ApolloClient({
      uri: 'https://api.github.com/graphql',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    const defaultBranchNameResult = await githubClient.query({
      query: GET_DEFAULT_BRANCH_NAME,
      variables: {
        repositoryOwner: githubRepository.ownerName,
        repositoryName: githubRepository.name,
      }
    })
    const defaultBranchName = defaultBranchNameResult.data.repository.defaultBranchRef.name

    githubClient.query({
      query: GET_PR_TEMPLATES,
      variables: {
        repositoryOwner: githubRepository.ownerName,
        repositoryName: githubRepository.name,
        refsRefPrefix: 'refs/heads/',
        refsLast: 1,
        refsQuery: defaultBranchName,
        filePath: '.github/PULL_REQUEST_TEMPLATE/'
      }
    }).then(({ data }) => {
      const lastCommit = data.repository.refs.nodes[0]
      const templateNamesFromRepository = lastCommit.target.file.object.entries.map(fileEntry => fileEntry.name)
      const templateNames = [DEFAULT_TEMPLATE_NAME, ...templateNamesFromRepository]
      this.setState({ templateNames })
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

export default withStyles(styles)(PullRequestTemplateSelector)
