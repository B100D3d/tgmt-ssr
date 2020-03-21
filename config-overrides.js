

module.exports = function override(config, env) {

    let loaderList = config.module.rules[2].oneOf;
    
    loaderList[5].use[0] = require.resolve('isomorphic-style-loader');
    loaderList[5].use[1].options.importLoaders = 2;
    loaderList[5].use[1].options.modules = true;
    loaderList[5].use[1].options.localIdentName = '[name]-[local]-[hash:base64:5]';
    //loaderList[6].use[0] = require.resolve('isomorphic-style-loader');
    console.log(loaderList[5].use, '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    
    return config;
}