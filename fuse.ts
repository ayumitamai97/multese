import { FuseBox } from 'fuse-box'

const fuse = FuseBox.init({
  homeDir: 'src',
  target: 'browser',
  output: 'dist/$name.js',
})

const showDialog = fuse.bundle('showDialog').instructions(' > showDialog.tsx')
const background = fuse.bundle('pageChanged').instructions(' > pageChanged.ts')

if (process.argv.includes('--hmr')) {
  [showDialog, background].map(script => script.hmr().watch())
}

fuse.run()