import { FuseBox } from 'fuse-box'
import * as GraphQLPlugin from 'fuse-box-graphql-plugin'

const fuse = FuseBox.init({
  homeDir: 'src',
  target: 'browser',
  output: 'dist/$name.js',
  plugins: [
    ['.graphql|.gql', GraphQLPlugin()]
  ],
  dependencies: {
    include: ['tslib'],
  }
})

const showDialog = fuse.bundle('showDialog').instructions(' > showDialog.tsx')
const background = fuse.bundle('pageChanged').instructions(' > pageChanged.ts')

if (process.argv.includes('--hmr')) {
  [showDialog, background].map(script => script.hmr().watch())
}

fuse.run()
