import webpack from 'webpack';
import path from 'path';
import fs from 'fs';

const sharp = require('sharp');

export interface SvgToPngOptions {
	browser: string;
	inputDirectory: string;
	outputDirectory: string;
}

export default class SvgToPngPlugin {
	public static readonly pluginName = 'SvgToPngPlugin';

	private _canGenerate = true;

	constructor(private _options: SvgToPngOptions) {
	}

	private getSvgFiles(): Array<string> {
		if (this._options.browser === 'firefox') {
			return [];
		}

		const sgvFiles = fs.readdirSync(this._options.inputDirectory)
			.filter(i => i.endsWith('.svg'))
			.map(i => path.join(this._options.inputDirectory, i))
			;

		return sgvFiles;
	}

	private async createPngFilesAsync(): Promise<void> {
		// const scales = [
		// 	16, 18, 20, 24, 28,
		// 	32, 40,
		// 	48, 56, 60, 64,
		// 	72, 80, 84, 96, 112, 128, 160,
		// 	192, 224,
		// 	256, 320, 384, 448, 512,
		// ];
		const scales = [
			16, 32, 48, 96
		];
		const svgFiles = this.getSvgFiles();
		for (const svgFile of svgFiles) {
			const svgBaseName = path.basename(svgFile);
			const name = path.parse(svgBaseName).name;
			for (const scale of scales) {
				const outputFileName = `${name}@${scale}.png`;
				const outputFilePath = path.join(this._options.outputDirectory, outputFileName);
				await sharp(svgFile)
					.resize(scale, scale)
					.png()
					.toFile(outputFilePath)
					;
			}
		}

		//this._options.outputDirectory
	}

	public apply(compiler: webpack.Compiler) {
		compiler.hooks.watchRun.tapPromise(SvgToPngPlugin.pluginName, async (compilation) => {
			if (compilation.modifiedFiles) {
				// if (this.getWatchFilePaths().filter(i => compilation.modifiedFiles.has(i)).length) {
				// 	console.debug(SvgToPngPlugin.pluginName, 'UPDATE');
				// 	this._canGenerate = true;
				// }
				this._canGenerate = true;
			}
		});

		compiler.hooks.afterCompile.tapPromise(SvgToPngPlugin.pluginName, async (compilation) => {
			// if (compiler.watchMode) {
			// 	for (const path of this.getWatchFilePaths()) {
			// 		compilation.fileDependencies.add(path);
			// 	}
			// }

			if (this._canGenerate) {
				await this.createPngFilesAsync();
			}

			this._canGenerate = false;
		});
	}

}
