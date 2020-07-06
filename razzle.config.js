const path = require("path")
const Dotenv = require("dotenv-webpack")
const LoadableWebpackPlugin = require('@loadable/webpack-plugin')
const OpenBrowserPlugin = require("open-browser-webpack-plugin")

const LoadableBabelPlugin = require('@loadable/babel-plugin')
const NullishCoalescingBabelPlugin = require("@babel/plugin-proposal-nullish-coalescing-operator")
const babelPresetRazzle = require('razzle/babel')
const babelPresetTypescript = require("@babel/preset-typescript")

const isHeroku = process.env.PWD === "/app"

const modifyForHeroku = (config, {target, dev}, webpack) => {
    if (target !== "node") return config

    const isDefinePlugin = plugin => plugin.constructor.name === "DefinePlugin"
    const indexDefinePlugin = config.plugins.findIndex(isDefinePlugin)

    if (indexDefinePlugin < 0) {
        console.warn("Couldn't setup razzle-heroku, no DefinePlugin...")
        return config
    }

    const {definitions} = config.plugins[indexDefinePlugin]
    const newDefs = Object.assign({}, definitions);

    if (isHeroku) {
        delete newDefs["process.env.PORT"]
        newDefs["process.env.RAZZLE_PUBLIC_DIR"] = '"/app/build/public"'
    }

    config.plugins[indexDefinePlugin] = new webpack.DefinePlugin(newDefs)

    return config
}

module.exports = {
    plugins: ['scss'],


    modify: (baseConfig, { target, dev }, webpack) => {
        const config = modifyForHeroku(Object.assign({}, baseConfig), { target, dev }, webpack)
        const isServer = target !== 'web';
        config.devtool = false

        ///////////// PLUGINS //////////////////////////
        config.plugins.push(new Dotenv())

        if(isServer && dev) {
            config.plugins.push(new OpenBrowserPlugin({ url: "http://localhost:3000" }))
        }

        if(!isServer) {
            const filename = path.resolve(__dirname, 'build')
            config.plugins.push(
                new LoadableWebpackPlugin({
                    outputAsset: false,
                    writeToDisk: { filename }
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