import * as path from 'path';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import ManifestFilePlugin from './source/plugins/ManifestFilePlugin';
import LocaleFilesPlugin from './source/plugins/LocaleFilesPlugin';

const inputRootDirectory = path.resolve(__dirname, 'source');
const inputEntryDirectory = path.resolve(inputRootDirectory, 'entry');
const outputDirectory = path.resolve(__dirname, 'dist');

const webpackConfig = (env: { [key: string]: string }, args: any): webpack.Configuration => {
	/** 本番用か */
	const isProduction = args.mode === 'production';

	if (!env['browser'].length) {
		throw Error(env['browser']);
	}

	const conf: webpack.Configuration = {
		mode: args.mode,

		entry: {
			"page-content": path.join(inputEntryDirectory, 'page-content.ts'),
			"application-options": path.join(inputEntryDirectory, 'application-options.ts'),
		},

		devtool: isProduction ? false : 'inline-source-map',

		output: {
			filename: '[name].js',
			path: outputDirectory,
		},

		module: {
			rules: [
				// スクリプト
				{
					test: /\.ts$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				// スタイルシート
				{
					test: /(\.(s[ac])ss)|(\.css)$/,
					use: [
						{
							loader: "style-loader",
						},
						{
							loader: "css-loader",
							options: {
								sourceMap: !isProduction,
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: !isProduction,
							}
						}
					],
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: [
				'.ts', '.js',
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.join(inputRootDirectory, 'views', 'application-options.html'),
				filename: 'application-options.html',
				inject: false,
			}),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: path.resolve(__dirname, 'icons'),
						to: outputDirectory,
					}
				],
			}),
			new ManifestFilePlugin({
				packageJson: path.join(__dirname, 'package.json'),
				browser: env['browser'],
				inputDirectory: path.join(inputRootDirectory, 'manifest'),
				outputDirectory: path.join(outputDirectory),
			}),
			new LocaleFilesPlugin({
				browser: env['browser'],
				outputDirectory: path.join(outputDirectory),
			})
		],
	};

	if (isProduction) {
		conf.optimization = {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {
							pure_funcs: [
								'console.assert',
								'console.table',
								'console.dirxml',

								'console.count',
								'console.countReset',

								'console.time',
								'console.timeEnd',
								'console.timeLog',
								'console.timeStamp',

								'console.profile',
								'console.profileEnd',

								'console.trace',
								'console.debug',
								'console.log',
							]
						}
					}
				})
			],
		}
	}

	return conf;
}

export default webpackConfig;

