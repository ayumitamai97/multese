// むりっぽい
import ApolloClient from 'apollo-boost'

let token

chrome.storage.sync.get({
  token: ''
}, (items) => {
  token = items.token
})

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${token}`,
  }
})
export default client
