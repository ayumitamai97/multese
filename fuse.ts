import { FuseBox, SassPlugin, CSSPlugin } from 'fuse-box'

const fuse = FuseBox.init({
  homeDir: 'src',
  entry: 'src/showDialog.tsx',
  target: 'browser',
  output: 'dist/$name.js',
  devServer: this.runServer
})

const showDialog = fuse.bundle('showDialog').instructions(' > showDialog.tsx')
const background = fuse.bundle('pageChanged').instructions(' > pageChanged.ts')

if (process.argv.includes('--hmr')) {
  [showDialog, background].map(script => script.hmr().watch())
}

fuse.run()
