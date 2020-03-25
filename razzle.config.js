
const path = require("path")

const Dotenv = require("dotenv-webpack")


module.exports = {
    plugins: ['scss'],


    modify: (baseConfig, { target, dev }, webpack) => {

        const config = Object.assign({}, baseConfig);
        const isServer = target !== 'web';


        ///////////// PLUGINS //////////////////////////
        config.plugins.push(new Dotenv())
        ///////////////////////////////////////////////

        ///////////// ALIAS /////////////////////////////////
        config.resolve.alias = {
            "/static": path.resolve(__dirname, "src/static"),
        }
        ///////////////////////////////////////////////


        /////////////// SASS MODULE /////////////////////
        const sassModuleRegex = /\.module\.(scss|sass)$/;
        config.module.rules[6].exclude = sassModuleRegex; // exclude module regex from razzle/scss

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
      }
    
};