import * as React from 'react'
import githubClient from '../apollo/githubClient'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient, { gql } from 'apollo-boost'

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

export default class Dialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = { templateNames: [] }
  }
  componentDidMount() {
    githubClient.query({
      query: GET_PR_TEMPLATES,
      variables: {
        "repositoryName": "multese",
        "repositoryOwner": "ayumitamai97",
        "refsRefPrefix": "refs/heads/",
        "refsFirst": 1,
        "filePath": ".github/PULL_REQUEST_TEMPLATE/"
      }
    }).then(({ data }) => {
      const lastCommit = data.repository.refs.nodes[0]
      const templateNames = lastCommit.target.file.object.entries.map(fileEntry => fileEntry.name)
      this.setState({ templateNames })
    })
  }
  render() {
    return (
      <div>
        {this.state.templateNames.map(name => (<span key={name}>{name}</span>))}
        This will be a dialog :)
      </div>
)
  }
}
