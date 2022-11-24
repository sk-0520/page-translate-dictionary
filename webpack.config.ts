import * as path from 'path';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

import ManifestFilePlugin from './source/build/ManifestFilePlugin';
import LocaleFilesPlugin from './source/build/LocaleFilesPlugin';
import SvgToPngPlugin from './source/build/SvgToPngPlugin';

const inputRootDirectory = path.resolve(__dirname, 'source');
const inputIconsDirectory = path.resolve(__dirname, 'icons');
const inputEntryDirectory = path.resolve(inputRootDirectory, 'entry');
const outputDirectory = path.resolve(__dirname, 'dist');

const webpackConfig = (env: { [key: string]: string }, args: any): webpack.Configuration => {
	if (!env['browser']) {
		throw Error(env['browser']);
	}

	const environment = {
		browser: env['browser'],
		mode: args.mode,
		/** 本番用か */
		isProduction: args.mode === 'production',
	} as const;

	const entries = [
		'page-content',
		'application-options',
		'setting-editor',
		'popup-action',
		'background',
	] as const;

	const views = [
		'application-options.html',
		'setting-editor.html',
		'popup-action.html',
	] as const;

	const conf: webpack.Configuration = {
		mode: environment.mode,

		entry: Object.fromEntries(
			entries.map(i => [i, path.join(inputEntryDirectory, `page-content@${environment.browser}.ts`)])
		),

		devtool: environment.isProduction ? false : 'inline-source-map',

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
								sourceMap: !environment.isProduction,
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: !environment.isProduction,
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
			...views.map(i => new HtmlWebpackPlugin({
				template: path.join(inputRootDirectory, 'views', i),
				filename: i,
				inject: false,
			})),
			new CopyWebpackPlugin({
				patterns: [
					{
						from: path.resolve(__dirname, 'icons'),
						to: outputDirectory,
					}
				],
			}),
			new ImageMinimizerPlugin({
				test: /\.(svg)$/i,
				minimizer: {
					filename: '[name].svg',
					implementation: ImageMinimizerPlugin.svgoMinify,
					options: {
						options: {
							encodeOptions: {
								multipass: true,
								plugins: [
									// see: https://github.com/svg/svgo#default-preset
									"preset-default",
								],
							},
						},
					},
				},
			}),
			new ManifestFilePlugin({
				packageJson: path.join(__dirname, 'package.json'),
				browser: environment.browser,
				inputDirectory: path.join(inputRootDirectory, 'manifest'),
				outputDirectory: outputDirectory,
			}),
			new LocaleFilesPlugin({
				browser: environment.browser,
				inputDirectory: path.join(inputRootDirectory, 'locales'),
				outputDirectory: outputDirectory,
			}),
			new SvgToPngPlugin({
				browser: environment.browser,
				inputDirectory: inputIconsDirectory,
				outputDirectory: outputDirectory,
			}),
		],
	};

	if (environment.isProduction) {
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

