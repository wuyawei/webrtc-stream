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
    outputDir: '../public', // 默认 dist 打包文件输出位置
    assetsDir: 'static', // 打包的 js、css、font 等存放的文件夹路径 相对于 outputDir，默认 ''，直接放在 outputDir里
    indexPath: '../index.html', // index.html 输出路径 默认 index.html
    devServer: {
        publicPath: baseUrl, // 和 baseUrl 保持一致
        proxy: {
            '/': {
                ws: false, // websocket 不需要代理
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
        .symlinks(true);
        config
        .entry('index')
        .add('babel-polyfill');
    }
};