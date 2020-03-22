const path = require('path')

const resolve = dir => path.resolve(__dirname, dir)

module.exports = function override(config, env) {

    config.resolve.alias = Object.assign(config.resolve.alias,{
        "/static": resolve("src/static")
    })

    let loaderList = config.module.rules[2].oneOf;
    
    loaderList[6].use[0] = require.resolve('isomorphic-style-loader');
    loaderList[6].use[1].options.importLoaders = 2;
    loaderList[6].use[1].options.modules = true;
    loaderList[6].use[1].options.localIdentName = '[name]-[local]-[hash:base64:5]';
    //loaderList[6].use[0] = require.resolve('isomorphic-style-loader');
    console.log(loaderList[6].use, '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    
    return config;
}