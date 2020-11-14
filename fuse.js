const { FuseBox } = require('fuse-box')

const fuse = FuseBox.init({
  homeDir: "src",
  target: "browser@es6",
  output: "dist/$name.js",
})

const showDialog = fuse.bundle("showDialog").instructions(" > showDialog.ts")

if (process.argv.includes('--hmr')) {
  [showDialog].map(script => script.hmr().watch())
}

fuse.run()
