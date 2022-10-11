import * as path from 'path';
import * as fs from 'fs';
import webpack from 'webpack';

const TerserPlugin = require("terser-webpack-plugin");

const inputRootDirectory = path.resolve(__dirname, 'source');
const inputSourceDirectory = path.resolve(__dirname, inputRootDirectory, 'page-translate-dictionary');
const outputDirectory = path.resolve(__dirname, 'dist');

function replaceManifestFile(browser: string): void {
	const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

	const inputManifestPath = path.join(inputRootDirectory, 'manifest', `${browser}.json`);

	const packageVersion = packageJson['version'];

	const targetJson = JSON.parse(fs.readFileSync(inputManifestPath, 'utf8'));
	targetJson['version'] = packageVersion;

	const outputPath = path.join(outputDirectory, 'manifest.json');
	fs.writeFileSync(outputPath, JSON.stringify(targetJson, undefined, 2), { flag: 'w' });
}

const webpackConfig = (env: { [key: string]: string }, args: any): webpack.Configuration => {
	/** 本番用か */
	const isProduction = args.mode === 'production';

	if (!env['browser'].length) {
		throw Error(env['browser']);
	}

	replaceManifestFile(env['browser']);

	const conf: webpack.Configuration = {
		mode: args.mode,

		// 名前に親ディレクトリを含めること(JS/CSSごちゃまぜ回避方法不明)
		entry: {
			// 共通スクリプト
			"page-content": path.join(inputSourceDirectory, 'page/page-content.ts'),
		},

		devtool: isProduction ? false : 'inline-source-map',

		output: {
			filename: '[name].js',
			path: outputDirectory
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
				}
			],
		},
		resolve: {
			extensions: [
				'.ts', '.js',
			],
		},
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
								'console.trace',
								'console.debug',
								'console.table',
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

