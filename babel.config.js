module.exports = function babelConfig(api) {
    api.cache(true);

    const presets = [
        "@babel/preset-env",
        "@babel/preset-react",
    ];

    const plugins = [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-class-properties",
        [
            "module-resolver",
            {
                root: "./src",
            },
        ],
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        "@babel/plugin-proposal-json-strings",
        [
            "@babel/plugin-proposal-decorators",
            {
                legacy: true,
            },
        ],
        "@babel/plugin-proposal-function-sent",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions",
    ];

    return {
        presets,
        plugins,
    };
};
