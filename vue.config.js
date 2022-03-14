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
    devServer: {
      disableHostCheck: true,
      proxy: {
        '/api': {
          target: process.env.VUE_APP_GEC_API,
          pathRewrite: { '^/api': '' },
          logLevel: 'debug',
        },
  
        '/storage': {
          target: `${process.env.BASE_URL}/storage`,
          pathRewrite: { '^/storage': '' },
          logLevel: 'debug',
        },
      },
    },
  };