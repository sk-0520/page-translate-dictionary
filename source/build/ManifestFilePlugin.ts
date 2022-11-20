import webpack from 'webpack';
import path from 'path';
import fs from 'fs';

import * as JSONC from 'jsonc-parser';

const ExtensionName = '__MSG_ext_name__';

export interface ManifestFileOptions {
	browser: string;
	packageJson: string;
	inputDirectory: string;
	outputDirectory: string;
}

export default class ManifestFilePlugin {
	public static readonly pluginName = 'ManifestFilePlugin';

	private _canGenerate = true;

	constructor(private _options: ManifestFileOptions) {
	}

	private getInputManifestFilePath(): string {
		const manifestFileName = `${this._options.browser}.jsonc`;
		const manifestFilePath = path.join(this._options.inputDirectory, manifestFileName)

		return manifestFilePath;
	}

	private createManifestFile(): void {
		const packageJson = JSON.parse(fs.readFileSync(this._options.packageJson, 'utf8'));

		const targetJson = JSONC.parse(fs.readFileSync(this.getInputManifestFilePath(), 'utf8'));
		targetJson['name'] = ExtensionName;
		targetJson['short_name'] = packageJson['name'];
		targetJson['version'] = packageJson['version'];
		targetJson['description'] = packageJson['description'];

		switch (this._options.browser) {
			case 'firefox':
				targetJson['developer'] = {
					'name': packageJson['author'],
					'url': packageJson['homepage'],
				};
				break;
		}

		const outputPath = path.join(this._options.outputDirectory, 'manifest.json');
		if (!fs.existsSync(this._options.outputDirectory)) {
			fs.mkdirSync(this._options.outputDirectory);
		}
		fs.writeFileSync(outputPath, JSON.stringify(targetJson, undefined, 2), { flag: 'w' });

		console.info(ManifestFilePlugin.pluginName, '[create]', outputPath);
	}

	private getWatchFilePaths(): string[] {
		return [
			this._options.packageJson,
			this.getInputManifestFilePath()
		];
	}

	public apply(compiler: webpack.Compiler) {
		compiler.hooks.watchRun.tapPromise(ManifestFilePlugin.pluginName, async (compilation) => {
			if (compilation.modifiedFiles) {
				if (this.getWatchFilePaths().filter(i => compilation.modifiedFiles.has(i)).length) {
					console.debug(ManifestFilePlugin.pluginName, 'UPDATE');
					this._canGenerate = true;
				}
			}
		});

		compiler.hooks.afterCompile.tapPromise(ManifestFilePlugin.pluginName, async (compilation) => {
			if (compiler.watchMode) {
				for (const path of this.getWatchFilePaths()) {
					compilation.fileDependencies.add(path);
				}
			}

			if (this._canGenerate) {
				this.createManifestFile();
			}

			this._canGenerate = false;
		});
	}

}
