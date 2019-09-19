const { join } = require('path');

module.exports = {
  entry: [
    join(__dirname, 'src/pac/table/table.js'),
  ],
    devServer: {
      host: "192.168.212.99",
      port: "4200",
     /* proxy: {
        '/qa': {
          target: 'http://192.168.205.11:8091',  // 测试
          changeOrigin: true
        }
      }*/
    },
    devtool: 'cheap-module-eval-source-map'
}