
const path = require("path")

const Dotenv = require("dotenv-webpack")
const LoadableWebpackPlugin = require('@loadable/webpack-plugin')
const OpenBrowserPlugin = require("open-browser-webpack-plugin")

const LoadableBabelPlugin = require('@loadable/babel-plugin')
const NullishCoalescingBabelPlugin = require("@babel/plugin-proposal-nullish-coalescing-operator")
const babelPresetRazzle = require('razzle/babel')


module.exports = {
    plugins: ['scss'],


    modify: (baseConfig, { target, dev }, webpack) => {

        const config = Object.assign({}, baseConfig);
        const isServer = target !== 'web';
        config.devtool = false


        ///////////// PLUGINS //////////////////////////
        config.plugins.push(new Dotenv())

        if(!isServer) {
            const filename = path.resolve(__dirname, 'build')
            config.plugins.push(
                new LoadableWebpackPlugin({
                    outputAsset: false,
                    writeToDisk: { filename },
                }),
                new OpenBrowserPlugin({ url: "http://localhost:3000" })
            )

            config.output.filename = dev
                ? 'static/js/[name].js'
                : 'static/js/[name].[chunkhash:8].js'

            config.node = { fs: 'empty' }

            config.optimization = Object.assign({}, config.optimization, {
                runtimeChunk: true,
                splitChunks: {
                  chunks: 'all',
                  name: dev,
                },
            })

            if(!dev) {
                config.optimization.minimizer[1].options.cssProcessorOptions = {} // disable css source map
            } 
        }
        ///////////////////////////////////////////////

        ///////////// ALIAS /////////////////////////////////
        config.resolve.alias = {
            "/static": path.resolve(__dirname, "src/static"),
            "/pages": path.resolve(__dirname, "src/pages"),
            "/components": path.resolve(__dirname, "src/components"),
            "/context": path.resolve(__dirname, "src/context"),
            "/hooks": path.resolve(__dirname, "src/hooks"),
            "/api": path.resolve(__dirname, "src/api")
        }
        ///////////////////////////////////////////////


        /////////////// SASS MODULE /////////////////////
        const sassModuleRegex = /\.module\.(scss|sass)$/;
        config.module.rules[6].exclude = sassModuleRegex; // exclude module regex from razzle/scss
        const rzUseLength = config.module.rules[6].use.length
        config.module.rules[6].use[rzUseLength-1].options.sourceMap = false // disable sourceMap for razzle/scss (sass-loader)

        /* get razzle/scss config with "modules" options sets to true */ 
        const sassModulesRuleUse = config.module.rules[6].use.map((item) => {
            if(typeof item === "string") return item
            const options = { ...item.options }
            if(options && options.hasOwnProperty("modules")) options.modules = true
            return { loader: item.loader, options }
        })

        /* for web cssLoader is second loader, for node it's first */
        const cssLoaderIndex = +!isServer
        sassModulesRuleUse[cssLoaderIndex].options.localIdentName = 
            dev
                ? "[name]-[hash:base64:8]"
                : "[hash:base64:5]"


        config.module.rules = [
            ...config.module.rules,
            {
                test: sassModuleRegex,
                use: sassModulesRuleUse
            }
        ]
        
        //////////////////////////////////////////////////
        
    
        return config;
      },

      modifyBabelOptions: () => ({
        babelrc: false,
        presets: [babelPresetRazzle],
        plugins: [LoadableBabelPlugin, NullishCoalescingBabelPlugin],
      }),
    
};