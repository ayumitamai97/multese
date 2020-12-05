import { FuseBox } from 'fuse-box'
import * as GraphQLPlugin from 'fuse-box-graphql-plugin'

const fuse = FuseBox.init({
  homeDir: 'src',
  target: 'browser',
  output: 'dist/$name.js',
  plugins: [
    ['.graphql|.gql', GraphQLPlugin()]
  ],
})

const showDialog = fuse.bundle('showDialog').instructions(' > showDialog.tsx')
const showDialog = fuse.bundle('extendConvertNoteToIssue').instructions(' > extendConvertNoteToIssue.tsx')
const background = fuse.bundle('pageChanged').instructions(' > pageChanged.ts')

if (process.argv.includes('--hmr')) {
  [showDialog, background].map(script => script.hmr().watch())
}

fuse.run()
