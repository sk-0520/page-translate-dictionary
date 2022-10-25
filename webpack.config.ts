import * as path from 'path';
import webpack from 'webpack';
import ManifestFilePlugin from './source/plugins/ManifestFilePlugin';
import LocaleFilesPlugin from './source/plugins/LocaleFilesPlugin';

const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const inputRootDirectory = path.resolve(__dirname, 'source');
const inputEntryDirectory = path.resolve(inputRootDirectory, 'entry');
const outputDirectory = path.resolve(__dirname, 'dist');

// function replaceManifestFile(browser: string): void {
// 	const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// 	const inputManifestPath = path.join(inputRootDirectory, 'manifest', `${browser}.json`);

// 	const packageVersion = packageJson['version'];

// 	const targetJson = JSON.parse(fs.readFileSync(inputManifestPath, 'utf8'));
// 	targetJson['version'] = packageVersion;

// 	const outputPath = path.join(outputDirectory, 'manifest.json');
// 	if (!fs.existsSync(outputDirectory)) {
// 		fs.mkdirSync(outputDirectory);
// 	}
// 	fs.writeFileSync(outputPath, JSON.stringify(targetJson, undefined, 2), { flag: 'w' });
// }

// function exportLocales(browser: string): void {
// 	const outputLocalesDirectory = path.join(outputDirectory, '_locales');
// 	if (fs.existsSync(outputLocalesDirectory)) {
// 		fs.rmSync(outputLocalesDirectory, { recursive: true });
// 	}
// 	fs.mkdirSync(outputLocalesDirectory);

// 	const localeItems = locales.gets();
// 	for (const [key, localeItem] of Object.entries(localeItems)) {
// 		const outputDirectory = path.join(outputLocalesDirectory, key);
// 		fs.mkdirSync(outputDirectory);

// 		const outputPath = path.join(outputDirectory, 'messages.json');
// 		const outputContent = JSON.stringify(localeItem);
// 		fs.writeFileSync(outputPath, outputContent);
// 	}
// }

const webpackConfig = (env: { [key: string]: string }, args: any): webpack.Configuration => {
	/** 本番用か */
	const isProduction = args.mode === 'production';

	if (!env['browser'].length) {
		throw Error(env['browser']);
	}

	//replaceManifestFile(env['browser']);
	//exportLocales(env['browser']);

	const conf: webpack.Configuration = {
		mode: args.mode,

		entry: {
			"page-content": path.join(inputEntryDirectory, 'page-content.ts'),
			"application-options": path.join(inputEntryDirectory, 'application-options.ts'),
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

