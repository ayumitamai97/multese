import ApolloClient from 'apollo-boost'

export const githubClient = (token: string) => {
  return new ApolloClient({
    uri: 'https://api.github.com/graphql',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}
