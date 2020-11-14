import * as React from 'react'
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

export default class PullRequestTemplateSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = { templateNames: [], selectedTemplateName: '' }
    this.selectTemplate = this.selectTemplate.bind(this)
  }
  componentDidMount() {
    const query = qs.parse(location.search.replace('?', ''))
    this.setState({ selectedTemplateName: query.template })

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
        const templateNames = lastCommit.target.file.object.entries.map(fileEntry => fileEntry.name)
        this.setState({ templateNames })
      })
    })
  }
  selectTemplate({ target }) {
    const templateName = target.value
    const query = qs.parse(location.search.replace('?', ''))
    query.template = templateName
    const queryString = qs.stringify(query)
    location.href = `${location.origin}${location.pathname}?${queryString}`
  }
  render() {
    return (
      <div>
        {
          this.state.templateNames.map(templateName => (
            <div key={templateName}>
              <label htmlFor={templateName}>
                <input
                  type='radio'
                  id={templateName}
                  value={templateName}
                  onClick={this.selectTemplate}
                  defaultChecked={this.state.selectedTemplateName === templateName}
                />
                {templateName}
              </label>
            </div>
          ))
        }
      </div>
    )
  }
}

