import * as React from 'react'
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
    // TODO: Setup ApolloProvider near here
    this.state = { client: null }
  }
  render() {
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
