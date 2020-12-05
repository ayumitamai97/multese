import * as React from 'react'
// import ApolloProvider from '@apollo/client'
import ApolloClient from 'apollo-boost'
import Dialog from './Dialog'
import IssueTemplateSelector from './IssueTemplateSelector'
import { getTokenFromChromeStorage } from '../utils/getTokenFromChromeStorage'
import { PageType } from '../@types/message'

interface AppProps {
  pageType: PageType
}

interface AppState {
  client: any
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
    this.state = { client: null }
  }
  componentDidMount() {
    getTokenFromChromeStorage(({ token }) => {
      const client = new ApolloClient({
        uri: 'https://api.github.com/graphql',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      this.setState({ client })
    })
  }
  render() {
    const { client } = this.state
    const { pageType } = this.props
    return (
      <div>
        { pageType === 'compare' && <Dialog /> }
        { pageType === 'project' && <IssueTemplateSelector /> }
      </div>
    )
  }
}

export default App
