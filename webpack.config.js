const DEV_MODE = (process.env.NODE_ENV !== "production");
const path = require("path");
const fs = require("fs");
const express = require("express");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

if (DEV_MODE) {
    const dotenv = require("dotenv");
    // eslint-disable-next-line global-require
    const envConfig = dotenv.parse(fs.readFileSync(`.env.${process.env.CROSS_ENV || "default"}`));
    Object.entries(envConfig).forEach(([k, val]) => {
        process.env[k] = val;
    });
}

const SRC_DIR = path.resolve(__dirname, "src");
const DIST = path.resolve(__dirname, "public_html");

const entries = [
    {
        name: "admin",
        filename: `${SRC_DIR}/Admin/index.js`,
        bodyClass: "app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden",
    },
    {
        name: "agent",
        filename: `${SRC_DIR}/Agent/index.js`,
        bodyClass: "app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden",
    },
    {
        name: "share",
        filename: `${SRC_DIR}/Share/index.js`,
        bodyClass: "share",
    },
    {
        name: "webviewModel3D",
        filename: `${SRC_DIR}/WebViewModel/index.js`,
        bodyClass: "webviewModel3D",
    },
    {
        name: "webview",
        filename: `${SRC_DIR}/WebView/index.js`,
        bodyClass: "webview",
    },
    {
        name: "model3d",
        filename: `${SRC_DIR}/Model3D/index.js`,
        bodyClass: "model3D",
    },
    {
        name: "root",
        filename: `${SRC_DIR}/root.js`,
        bodyClass: "root",
    },
];

const appDirectory = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || "")
    .split(path.delimiter)
    .filter((folder) => folder && !path.isAbsolute(folder))
    .map((folder) => path.resolve(appDirectory, folder))
    .join(path.delimiter);

const config = {
    entry: {
        init: `${SRC_DIR}/init.js`,
    },

    output: {
        path: DIST,
        publicPath: "/",
        filename: DEV_MODE ? "js/[name].js" : "js/[name].[contenthash:8].js",
    },

    resolve: {
        modules: ["node_modules", path.resolve(__dirname, "node_modules")]
            .concat(SRC_DIR.split(path.delimiter).filter(Boolean)),
        extensions: [".js", ".json", ".jsx"],
        alias: {
            "react-router-dom": path.resolve(__dirname, "node_modules/react-router-dom"),
            "@babel/runtime": path.resolve(__dirname, "node_modules/@babel/runtime"),
            hammerjs: path.resolve(__dirname, "node_modules/hammerjs"),
            warning: path.resolve(__dirname, "node_modules/warning"),
            reactstrap: path.resolve(__dirname, "node_modules/reactstrap"),
            "create-react-context": path.resolve(__dirname, "node_modules/create-react-context"),
            "hoist-non-react-statics": path.resolve(__dirname, "node_modules/hoist-non-react-statics"),
            "performance-now": path.resolve(__dirname, "node_modules/performance-now"),
        },
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: require.resolve("babel-loader"),
                options: { cacheDirectory: true },
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: require.resolve("css-loader"),
                        options: { importLoaders: 1 },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: () => [
                                require("postcss-flexbugs-fixes"), //eslint-disable-line
                                autoprefixer({
                                    overrideBrowserslist: [
                                        ">0.2%",
                                        "not dead",
                                        "not ie < 11",
                                        "not op_mini all",
                                    ],
                                    flexbox: "no-2009",
                                }),
                            ],
                        },
                    },
                ],
            },
            {
                test: /\.mp4$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: "assets/videos/[name].[contenthash:8].[ext]",
                },
            },
            {
                test: /\.(bmp|gif|jpe?g|png|svg|obj|mtl|gltf|bin|glb|hdr|3ds|fbx)$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: "assets/images/[name].[contenthash:8].[ext]",
                },
            },
            {
                test: /\.(woff|woff2|otf|ttf|eot)$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: "assets/fonts/[name].[contenthash:8].[ext]",
                },
            },
        ],
    },

    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "async",
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                commons: {
                    test: /(node_modules).+(?<!css)$/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `npm.${packageName.replace("@", "")}`;
                    },
                    chunks: "all",
                    priority: -10,
                },
                vendor: {
                    test: /(node_modules).+(?<!css)$/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `npm.${packageName.replace("@", "")}`;
                    },
                },
            },
        },
    },

    stats: DEV_MODE ? "normal" : "errors-only",

    devtool: DEV_MODE ? "cheap-module-source-map" : false,

    devServer: {
        compress: true,
        hot: true,
        port: 3000,
        before(app) {
            app.use("/public", express.static("/public"));
        },
        proxy: {
            context: [
                "/api/login", "/api/logout", "/user/api", "/admin/api", "/agent/api", // api
                "/storage", "/favicon.ico", // static content
            ],
            target: process.env.BACKEND_URL,
            changeOrigin: true,
        },
        historyApiFallback: {
            rewrites: [
                { from: /^\/admin/, to: "/admin.html" },
                { from: /^\/agent/, to: "/agent.html" },
                { from: /^\/model3d/, to: "/model3d.html" },
                { from: /^\/webview\/model/, to: "/webviewModel3D.html" },
                { from: /^\/webview/, to: "/webview.html" },
                { from: /^\/share/, to: "/share.html" },
                { from: /./, to: "/index.html" },
                { from: /^\/$/, to: "/index.html" },
            ],
        },
        clientLogLevel: "silent",
        stats: "normal",
    },

    plugins: [
        new CleanWebpackPlugin(),
        new webpack.LoaderOptionsPlugin({ debug: false }),
        new MiniCssExtractPlugin({
            filename: DEV_MODE ? "css/[name].css" : "css/[name].[hash:8].css",
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
        new webpack.DefinePlugin({
            __DEV__: DEV_MODE,
            __APP_VERSION__: JSON.stringify(process.env.BUILD_NUMBER),
        }),
        new webpack.ProvidePlugin({
            moment: "moment",
        }),
        ...entries.map(
            (entry) => new HtmlWebpackPlugin({
                title: "Platforma.tech",
                bodyClass: entry.bodyClass,
                favicon: "src/assets/favicons/favicon.ico",
                template: `${SRC_DIR}/template.html`,
                filename: entry.name === "root" ? "index.html" : `${entry.name}.html`,
                chunks: ["runtime", "init", entry.name],
                minify: false,
            }),
        ),

    ],
};

const { ENTRY } = process.env;
if (ENTRY) {
    const { filename } = entries.find(({ name }) => name === ENTRY);
    config.entry = {
        ...config.entry,
        [ENTRY]: filename,
    };
} else {
    config.entry = {
        ...config.entry,
        ...entries.reduce((acc, entry) => {
            acc[entry.name] = entry.filename;
            return acc;
        }, {}),
    };
}

if (DEV_MODE) {
    config.plugins.push(new DuplicatePackageCheckerPlugin());
    if (process.env.ANALYZE) {
        config.plugins.push(new BundleAnalyzerPlugin());
    }
}

module.exports = config;
