const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer : {
    proxy : {
      '/WEBTEMP':{
        target : 'http://localhost:9090/'
      }
    }
  }
})
