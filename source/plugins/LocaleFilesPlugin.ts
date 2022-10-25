import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import * as locales from '../locales/locales';

export interface LocaleFilesOptions {
	browser: string;
	outputDirectory: string;
}

export default class LocaleFilesPlugin {
	public static readonly pluginName = 'LocaleFilesPlugin';

	constructor(private _options: LocaleFilesOptions) {
	}

	exportLocales(): void {
		const outputLocalesDirectory = path.join(this._options.outputDirectory, '_locales');
		if (fs.existsSync(outputLocalesDirectory)) {
			fs.rmSync(outputLocalesDirectory, { recursive: true });
		}
		fs.mkdirSync(outputLocalesDirectory);

		const localeItems = locales.gets();
		for (const [key, localeItem] of Object.entries(localeItems)) {
			const outputDirectory = path.join(outputLocalesDirectory, key);
			fs.mkdirSync(outputDirectory);

			const outputPath = path.join(outputDirectory, 'messages.json');
			const outputContent = JSON.stringify(localeItem);
			fs.writeFileSync(outputPath, outputContent);
		}
	}

	apply(compiler: webpack.Compiler) {
		if (compiler.watchMode) {
			compiler.hooks.watchRun.tapPromise(LocaleFilesPlugin.pluginName, async (compilation) => {
			});
		}

		compiler.hooks.beforeCompile.tapPromise(LocaleFilesPlugin.pluginName, async (compilation) => {
			this.exportLocales();
		});
	}

}
