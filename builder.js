const { compile } = require('nexe')
 
compile({
  input: './index.js',
  target: 'windows',
  build: true, //required to use patches
  resources: [
      './index.js',
      './src/handler.js',
      './node_modules/**/*',
  ],
  ico: './index.ico',
  verbose: true,
  rc: {
    CompanyName: "Taurine",
    ProductName: "Taurine Checker",
    FileDescription: "A NodeJS minecraft accounts checker",
    FileVersion: "0,0,1",
    ProductVersion: "0,0,1",
    OriginalFilename: "taurinechecker.exe",
    InternalName: "taurinechecker",
    LegalCopyright: "Copyright Taurine. Apache 2.0 license."
}
}).then(() => {
  console.log('success')
}).catch(async(err) => {
  console.log(err)
})