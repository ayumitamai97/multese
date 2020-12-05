import * as React from 'react'
import { withStyles, Theme } from '@material-ui/core/styles'
import { Chip } from '@material-ui/core'
import ApolloClient from 'apollo-boost'
import qs = require('querystring')
import { GithubRepository, IssueTemplate } from '../@types/github'
import { getTokenFromChromeStorage } from '../utils/getTokenFromChromeStorage'
import { extractRepositoryIdentifier } from '../utils/extractRepositoryIdentifier'

const getDefaultBranchNameQuery = require('../gqls/queries/getDefaultBranchName.gql')
const getFileEntriesFromDefaultMainBranchByFilePathQuery = require('../gqls/queries/getFileEntriesFromDefaultMainBranchByFilePath.gql')

const styles = (theme: Theme) => ({
  root: {
    'margin-top': theme.spacing(2),
  },
  title: {
    'margin-bottom': theme.spacing(0.5),
  },
  titleWarning: {
    fontSize: '10px',
    color: theme.palette.text.secondary
  },
  chip: {
    'margin': theme.spacing(0.5),
  },
})

interface IssueTemplateSelectorProps {
  classes: { [key: string]: string }
}

interface IssueTemplateSelectorState {
  templates: Array<IssueTemplate>
}

class IssueTemplateSelector extends React.Component<IssueTemplateSelectorProps, IssueTemplateSelectorState> {
  constructor(props) {
    super(props)
    this.state = { templates: [] }
    this.applyTemplate = this.applyTemplate.bind(this)
  }
  componentDidMount() {
    const query = qs.parse(location.search.replace('?', ''))

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
      const templates = lastCommit.target.file.object.entries.reduce((acc, fileEntry) => (
        Object.assign(acc, Object.fromEntries([[fileEntry.name, fileEntry.object.text]]))
      ), {})
      this.setState({ templates })
    })
  }
  templateNames() {
    return Object.keys(this.state.templates)
  }
  applyTemplate({ target }) {
    const templateName = target.innerText
    const cardBodyTextArea: HTMLInputElement = document.querySelector('textarea#convert-card-body')
    const templateBody = this.state.templates[templateName].replace(/-{3}(.|\n)*-{3}\n*/, '')
    if (cardBodyTextArea.value && !cardBodyTextArea.value.match(/\n$/)) {
      cardBodyTextArea.value += "\n"
    }
    cardBodyTextArea.value += templateBody
  }
  render() {
    const { classes } = this.props;
    if (this.state.templates.length === 0) { return null }
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <label>Issue template</label>
          <br />
          <span className={classes.titleWarning}>
            * YAML frontmatter (labels and assignees) will not applied
          </span>
        </div>
        <div>
          {
            this.templateNames().map(templateName => (
              <Chip
                key={templateName}
                label={templateName}
                color='default'
                onClick={this.applyTemplate}
                className={classes.chip}
              />
            ))
          }
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(IssueTemplateSelector)
