module.exports = {
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        // 加一个代理
        proxy:{
            // API路由前缀，这里在main.js 里面会设置默认添加
            '^/api': {
                target:'http://localhost:8000/',
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
}
