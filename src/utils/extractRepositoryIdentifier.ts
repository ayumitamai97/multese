export const extractRepositoryIdentifier = (url: string): string => {
  return url.match(/https:\/\/github\.com\/\w*\/\w*/)[0].replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '')
}
