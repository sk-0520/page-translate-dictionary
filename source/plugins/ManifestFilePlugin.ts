import webpack from 'webpack';
import path from 'path';
import fs from 'fs';

export interface ManifestFileOptions {
	browser: string;
	packageJson: string;
	inputDirectory: string;
	outputDirectory: string;
}

export default class ManifestFilePlugin {
	public static readonly pluginName = 'ManifestFilePlugin';

	constructor(private _options: ManifestFileOptions) {
	}

	getManifestFilePath() {
		const manifestFileName = `${this._options.browser}.json`;
		const manifestFilePath = path.join(this._options.inputDirectory, manifestFileName)

		return manifestFilePath;
	}

	createManifestFile(): void {
		const packageJson = JSON.parse(fs.readFileSync(this._options.packageJson, 'utf8'));

		const packageVersion = packageJson['version'];

		const targetJson = JSON.parse(fs.readFileSync(this.getManifestFilePath(), 'utf8'));
		targetJson['version'] = packageVersion;

		const outputPath = path.join(this._options.outputDirectory, 'manifest.json');
		if (!fs.existsSync(this._options.outputDirectory)) {
			fs.mkdirSync(this._options.outputDirectory);
		}
		fs.writeFileSync(outputPath, JSON.stringify(targetJson, undefined, 2), { flag: 'w' });
	}

	apply(compiler: webpack.Compiler) {
		if (compiler.watchMode) {
			compiler.hooks.watchRun.tapPromise(ManifestFilePlugin.pluginName, async (compilation) => {
			});
		}

		compiler.hooks.beforeCompile.tapPromise(ManifestFilePlugin.pluginName, async (compilation) => {
			this.createManifestFile();
		});
	}

}
