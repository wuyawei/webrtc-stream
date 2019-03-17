// const path = require('path');

// 拼接路径
// function resolve (dir) {
//     return path.join(__dirname, dir)
// }

// 基础路径 注意发布之前要先修改这里
let baseUrl = '/';
module.exports = {
    publicPath: baseUrl, // 根据你的实际情况更改这里
    lintOnSave: true,
    devServer: {
        publicPath: baseUrl, // 和 baseUrl 保持一致
        proxy: {
            '/': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        },
        port: '3221'
    },
    productionSourceMap: false,
    // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
    chainWebpack: config => {
        // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
        config.resolve
        .symlinks(true)
    }
};