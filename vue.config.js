module.exports = {
    devServer: {
        proxy: {
            '/api': { 
              target: 'http://localhost:3000'
            }
          }
    },
    pluginOptions: {
      electronBuilder: {
        mainProcessWatch:['src/server.js'],
    }
  }
}