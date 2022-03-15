module.exports = {
    pluginOptions: {
      electronBuilder: {
        mainProcessFile: 'src/background/main.js',
        rendererProcessFile: 'src/renderer/main.js',
        nodeIntegration:true
      },
    },
    configureWebpack: {
      resolve: {
        alias: {
          '@renderer':'src/renderer',
          'assets': 'src/renderer/assets',
        }
      }
    },
  };