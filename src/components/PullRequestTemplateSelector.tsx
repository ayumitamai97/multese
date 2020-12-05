import * as React from 'react'
import { withStyles, Theme } from '@material-ui/core/styles'
import { Chip } from '@material-ui/core'
import ApolloClient from 'apollo-boost'
import qs = require('querystring')
import { GithubRepository } from '../@types/github'
import { getTokenFromChromeStorage } from '../utils/getTokenFromChromeStorage'
import { extractRepositoryIdentifier } from '../utils/extractRepositoryIdentifier'

const getDefaultBranchNameQuery = require('../gqls/queries/getDefaultBranchName.gql')
const getFileEntriesFromDefaultMainBranchByFilePathQuery = require('../gqls/queries/getFileEntriesFromDefaultMainBranchByFilePath.gql')

const styles = (theme: Theme) => ({
  chip: {
    'margin': theme.spacing(0.5),
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

    const repositoryIdentifier = extractRepositoryIdentifier(location.href)
    const [repositoryOwner, repositoryName] = repositoryIdentifier.split('/')
    const githubRepository: GithubRepository = { ownerName: repositoryOwner, name: repositoryName }

    getTokenFromChromeStorage((storageItems) => this.getTemplateNames(storageItems, githubRepository))
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
      query: getDefaultBranchNameQuery,
      variables: {
        repositoryOwner: githubRepository.ownerName,
        repositoryName: githubRepository.name,
      }
    })
    const defaultBranchName = defaultBranchNameResult.data.repository.defaultBranchRef.name

    githubClient.query({
      query: getFileEntriesFromDefaultMainBranchByFilePathQuery,
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
