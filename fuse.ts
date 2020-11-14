import { FuseBox } from 'fuse-box'

const fuse = FuseBox.init({
  homeDir: 'src',
  entry: 'src/showDialog.tsx',
  target: 'browser',
  output: 'dist/$name.js',
  devServer: this.runServer
})

const showDialog = fuse.bundle('showDialog').instructions(' > showDialog.tsx')
const shopping = fuse.bundle('Dialog').instructions(' > components/Dialog.tsx')

if (process.argv.includes('--hmr')) {
  [showDialog, shopping].map(script => script.hmr().watch())
}

fuse.run()
