// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const CleanPlugin = require('./clean-css');
const importJson =  require('./sass-import-json');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');


const projectConfig=require(paths.appPackageJson);
const proj_name=projectConfig.name;

const hashCode = function(str){
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    if(hash.toString().indexOf("_")===0){
        return hash;
    }else{
        return "_"+hash;
    }
};

const assertDir=`static${hashCode(proj_name).toString().replace(/-/g,"_")}`;



const publicPath = '/';
const publicUrl = '/'+assertDir;
const env = getClientEnvironment(publicUrl);

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        "polyfill":["babel-polyfill",require.resolve('./polyfills')],
        'react':["react",'react-dom'],
        'axios':['axios'],
        "bundle":[
            require.resolve('react-dev-utils/webpackHotDevClient'),
            paths.appIndexJs
        ]
    },
    output: {
        pathinfo: true,
        filename: `${assertDir}/business/[name]_[hash:8].js`,
        chunkFilename: `${assertDir}/business/[name].chunk.js`,
        publicPath: publicPath,
        devtoolModuleFilenameTemplate: info =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    resolve: {
        modules: ['node_modules', paths.appNodeModules].concat(
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        extensions: [' ','.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx','.ts', '.tsx', '.es6'],
        alias: {
            'babel-runtime': path.dirname(
                require.resolve('babel-runtime/package.json')
            ),
            'react-native': 'react-native-web',
        },
        plugins: [
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
            new TsconfigPathsPlugin({ configFile: paths.appTsConfig }),
        ],
    },
    module: {
        strictExportPresence: true,
        rules: [
              {
                  test: /\.(js|jsx|mjs)$/,
                  enforce: 'pre',
                  loader: require.resolve('source-map-loader'),
                  include: paths.appSrc,
              },
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: `${assertDir}/media/[ext]/[name].[hash:8].[ext]`,
                        },
                    },
                    {
                        test: /\S*icon\S*.(svg|eot|ttf|woff)$/,
                        loader: 'file-loader',
                        options: {
                            name: `${assertDir}/icons/[name].[hash:8].[ext]`,
                        },
                    },
                    {
                        test: /.(svg|eot|ttf|woff)$/,
                        loader: 'file-loader',
                        options: {
                            name: `${assertDir}/media/[ext]/[name].[hash:8].[ext]`,
                        },
                    },
                    {
                        test: /\.(js|jsx|mjs)$/,
                        loader: require.resolve('babel-loader'),
                        options: {
                            // @remove-on-eject-begin
                            babelrc: false,
                            presets: ["env","stage-3","react-app"],
                            // @remove-on-eject-end
                            plugins:["transform-remove-strict-mode","babel-plugin-add-module-exports","babel-plugin-react-require","babel-plugin-syntax-dynamic-import","babel-plugin-transform-decorators",["imports-transform", {
                                "antd":{
                                    "transform": "antd/es/${member}",
                                    "preventFullImport": true,
                                    "kebabCase":true
                                },
                                "ant-design-pro":{
                                    "transform": "ant-design-pro/es/${member}",
                                    "preventFullImport": true
                                },
                                "kxt": {
                                    "transform": "kxt/lib/${member}",
                                    "preventFullImport": true,
                                    "kebabCase":true
                                }
                            }],["import", [{
                                "libraryName": "antd",
                                "libraryDirectory": "es",
                                "style": false
                            },{
                                "libraryName": "ant-design-pro",
                                "libraryDirectory": "es",
                                "style": false
                            },{
                                "libraryName": "kxt",
                                "libraryDirectory": "lib",
                                "style": false
                            }]]]
                        },
                    },
                    {
                        test: /\.(ts|tsx)$/,
                        use: [{
                            loader: require.resolve('babel-loader'),
                            options: {
                                // @remove-on-eject-begin
                                babelrc: false,
                                presets: ["env","stage-3","react-app"],
                                // @remove-on-eject-end
                                plugins:["transform-remove-strict-mode","babel-plugin-add-module-exports","babel-plugin-react-require","babel-plugin-syntax-dynamic-import","babel-plugin-transform-decorators",["imports-transform", {
                                    "antd":{
                                        "transform": "antd/es/${member}",
                                        "preventFullImport": true,
                                        "kebabCase":true
                                    },
                                    "ant-design-pro":{
                                        "transform": "ant-design-pro/es/${member}",
                                        "preventFullImport": true
                                    },
                                    "kxt": {
                                        "transform": "kxt/lib/${member}",
                                        "preventFullImport": true,
                                        "kebabCase":true
                                    }
                                }],["import", [{
                                    "libraryName": "antd",
                                    "libraryDirectory": "es",
                                    "style": false
                                },{
                                    "libraryName": "ant-design-pro",
                                    "libraryDirectory": "es",
                                    "style": false
                                },{
                                    "libraryName": "kxt",
                                    "libraryDirectory": "lib",
                                    "style": false
                                }]]]
                            },
                        },{
                                loader: require.resolve('ts-loader'),
                                options: {
                                    transpileOnly: true,
                                    configFile: paths.appTsConfig
                                },
                            }
                        ],
                    },
                    {
                        test: /\.css$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    sourceMap: true,
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8 anyway
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    ident: 'postcss',
                                    sourceMap: true,
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9',
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                            {
                                loader:'resolve-url-loader',
                                options:{
                                    debug:false,
                                    absolute:false,
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    importer: [importJson],
                                    data: '$rootPath: "./src";',
                                    sourceMap:true
                                },
                            },
                        ],
                    },
                    {
                        test: /\.less$/,
                        use:[
                            require.resolve('style-loader'),
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    sourceMap: true,
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9',
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                            require.resolve('less-loader'),
                        ],
                    },
                    {
                        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: `${assertDir}/media/[ext]/[name].[hash:8].[ext]`,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names:["react","axios","polyfill"],
            filename:`${assertDir}/bundle/[name].[hash:8].js`,
            minChunks: Infinity
        }),
        new CopyWebpackPlugin([{
            from:paths.appPublic,
            to:path.join(assertDir),
        }], {
            ignore: [ '*index.html']
        }),
        new CleanPlugin(),
        new InterpolateHtmlPlugin(env.raw),
        new HtmlWebpackPlugin({
            title: paths.webName,
            inject: true,
            template: paths.appHtml,
            chunks:["bundle","polyfill","react","axios"],
            chunksSortMode:function(a,b) {
                let index={"polyfill":1,"react":2,"axios":3,"bundle":4},
                    aI=index[a.origins[0].name],
                    bI=index[b.origins[0].name];
                return aI&&bI?aI-bI:-1;
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin(env.stringified),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
       /* new ForkTsCheckerWebpackPlugin({
            async: true,
            watch: paths.appSrc,
            tsconfig: paths.appTsConfig,
            tslint: paths.appTsLint,
        }),*/
    ],
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    },
    performance: {
        hints: false,
    },
};
