require("@babel/register")({

    ignore: [/node_modules/],

    presets: [
        ["@babel/preset-env",
            {
                "targets": {
                    "node": "current"
                }
            }
        ],
        "@babel/preset-react"
    ],
    plugins: [
        ["file-loader",
            {
                "name": "[name].[hash:8].[ext]",
                "extensions": ["png", "jpg", "svg", "webp", "jpeg", "gif"],
                "publicPath": "/static/media",
                "outputPath": null,
                "context": __dirname,
                "limit": 0
            }
        ],
        ["@babel/plugin-transform-runtime",
            {
                "regenerator": true
            }
        ]
    ]
});

require.extensions[".svg"] = function() {}
require.extensions[".sass"] = function() {}
require.extensions[".webp"] = function() {}
require.extensions[".jpg"] = function() {}
require.extensions[".css"] = function() {}

require("./dist/server");