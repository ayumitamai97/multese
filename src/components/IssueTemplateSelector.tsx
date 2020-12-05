import * as React from 'react'
import { withStyles, Theme } from '@material-ui/core/styles'
import { Chip } from '@material-ui/core'
import ApolloClient from 'apollo-boost'
import qs = require('querystring')
import { getDefaultBranchNameQuery } from '../gqls/queries/getDefaultBranchName.gql'
import { getFileEntriesFromDefaultMainBranchByFilePathQuery } from '../gqls/queries/getFileEntriesFromDefaultMainBranchByFilePath.gql'
import { GithubRepository, IssueTemplate } from '../@types/github'
import { getTokenFromChromeStorage } from '../utils/getTokenFromChromeStorage'
import { extractRepositoryIdentifier } from '../utils/extractRepositoryIdentifier'

const styles = (theme: Theme) => ({
  chip: {
    'margin': theme.spacing(0.5),
  },
})

const DEFAULT_TEMPLATE_NAME = 'default'

interface IssueTemplateSelectorProps {
  classes: { [key: string]: string }
}

interface IssueTemplateSelectorState {
  templates: Array<IssueTemplate>
  selectedTemplateName: string
}

class IssueTemplateSelector extends React.Component<IssueTemplateSelectorProps, IssueTemplateSelectorState> {
  constructor(props) {
    super(props)
    this.state = { templates: [], selectedTemplateName: '' }
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

    getTokenFromChromeStorage((storageItems) => this.getTemplates(storageItems, githubRepository))
  }
  async getTemplates(storageItems: any, githubRepository: GithubRepository) {
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
        filePath: '.github/ISSUE_TEMPLATE/'
      }
    }).then(({ data }) => {
      const lastCommit = data.repository.refs.nodes[0]
      const templatesFromRepository = lastCommit.target.file.object.entries.reduce((acc, fileEntry) => (
        Object.assign(acc, Object.fromEntries([[fileEntry.name, fileEntry.object.text]]))
      ), {})
      const defaultTemplate = Object.fromEntries([[DEFAULT_TEMPLATE_NAME, '']])
      const templates = { ...defaultTemplate, ...templatesFromRepository }
      this.setState({ templates })
    })
  }
  templateNames() {
    return Object.keys(this.state.templates)
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
          this.templateNames().map(templateName => (
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

export default withStyles(styles)(IssueTemplateSelector)