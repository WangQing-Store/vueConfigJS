// vue.config.js
const path = require('path');
// const CompressionWebpackPlugin = require("compression-webpack-plugin"); // 开启gzip压缩， 按需引用
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i; // 开启gzip压缩， 按需写入
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; // 打包分析
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
    // 基本路径
    publicPath: '/',
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    runtimeCompiler: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        config.resolve.symlinks(true); // 修复热更新失效
        // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
        config.plugin("html").tap(args => {
        // 修复 Lazy loading routes Error
            args[0].chunksSortMode = "none";
            return args;
        });
        config.resolve.alias // 添加别名
        .set('@', resolve('src'))
        .set('@assets', resolve('src/assets'))
        .set('@components', resolve('src/components'))
        .set('@views', resolve('src/views'))
        .set('@store', resolve('src/store'));
        // 压缩图片
        // 需要 npm i -D image-webpack-loader
        // config.module
        // .rule("images")
        // .use("image-webpack-loader")
        // .loader("image-webpack-loader")
        // .options({
        //     mozjpeg: { progressive: true, quality: 65 },
        //     optipng: { enabled: false },
        //     pngquant: { quality: [0.65, 0.9], speed: 4 },
        //     gifsicle: { interlaced: false },
        //     webp: { quality: 75 }
        // });
    },
    configureWebpack: config => {
        // 开启 gzip 压缩
        // 需要 npm i -D compression-webpack-plugin
        // resolve: {
        //     extensions: ['.ts', '.tsx', '.js']
        // };
        const plugins = [];
            if (IS_PROD) {
                // plugins.push(
                //     new CompressionWebpackPlugin({
                //     filename: "[path].gz[query]",
                //     algorithm: "gzip",
                //     test: productionGzipExtensions,
                //     threshold: 10240,
                //     minRatio: 0.8
                //     })
                // );
             }
        config.plugins = [...config.plugins, ...plugins];
        if (process.env.NODE_ENV === "production") {
            // 为生产环境修改配置...
            config.mode = "production";
            // 这里修改下 
			config.optimization.minimizer = [
				new UglifyJsPlugin({
					uglifyOptions: {
						compress: {
							warnings: false,
							drop_console: true, //console
							drop_debugger: true,
							pure_funcs: ['console.log'] //移除console
						}
					}
				})
			]
			//打包文件大小配置
			config["performance"] = {
				"maxEntrypointSize":10000000,
				"maxAssetSize":30000000
			}
        } else {
            // 为开发环境修改配置...
            config.mode = "development";
        }
    },
    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: false,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            // postcss: {
            //     plugins: [
            //         require('postcss-px2rem')({remUnit: 75}), // 换算的基数
            //     ]
            // }
        },
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // webpack-dev-server 相关配置
    devServer: {
        // open: process.platform === 'darwin',
        //将服务启动后默认打开浏览器
        open: true,
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        proxy: {// 设置代理
            '/api': {
                target: 'http://www.lzzyaf.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        },
        before: app => {}
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
}