const path = require("path")
const razzleHeroku = require("razzle-heroku")
const Dotenv = require("dotenv-webpack")
const LoadableWebpackPlugin = require('@loadable/webpack-plugin')
const OpenBrowserPlugin = require("open-browser-webpack-plugin")

const LoadableBabelPlugin = require('@loadable/babel-plugin')
const NullishCoalescingBabelPlugin = require("@babel/plugin-proposal-nullish-coalescing-operator")
const babelPresetRazzle = require('razzle/babel')
const babelPresetTypescript = require("@babel/preset-typescript")


module.exports = {
    plugins: ['scss'],


    modify: (baseConfig, { target, dev }, webpack) => {

        const config = razzleHeroku(Object.assign({}, baseConfig), { target, dev }, webpack)
        const isServer = target !== 'web';
        config.devtool = false

        ///////////// PLUGINS //////////////////////////
        config.plugins.push(new Dotenv())

        if(isServer && dev) {
            config.plugins.push(new OpenBrowserPlugin({ url: "http://localhost:3000" }))
        }

        if(!isServer) {
            const filename = "/app/build"
            config.plugins.push(
                new LoadableWebpackPlugin({
                    outputAsset: false,
                    writeToDisk: { filename },
                    path: "/app/build"
                })
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


        ////////// TYPESCRIPT MODULE /////////////////
        config.resolve.extensions.push(".ts")
        config.module.rules[1].test = /\.(js|jsx|mjs|ts)$/;
        config.module.rules[1].include.push(path.resolve(__dirname, "api"))
        //////////////////////////////////////////////////////


        return config;
      },

      modifyBabelOptions: () => ({
        babelrc: false,
        presets: [babelPresetRazzle, babelPresetTypescript],
        plugins: [LoadableBabelPlugin, NullishCoalescingBabelPlugin],
      }),

};