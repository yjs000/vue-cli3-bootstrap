const { defineConfig } = require('@vue/cli-service')
const path = require("path");

// const projectRoot = path.join(__dirname, "./../");
// const outputDir = path.join(projectRoot, "/src/main/resources/static");

const outputDir = path.join(__dirname, 'dist');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer : {
    proxy : {
      '/WEBTEMP':{
        target : 'http://localhost:9090/'
      },
    },
  },
  outputDir : outputDir,
})
