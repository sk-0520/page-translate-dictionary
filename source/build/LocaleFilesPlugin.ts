import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import ts from 'typescript';

export interface LocaleFilesOptions {
	browser: string;
	inputDirectory: string;
	outputDirectory: string;
}

export default class LocaleFilesPlugin {
	public static readonly pluginName = 'LocaleFilesPlugin';
	private static readonly baseDir = path.join(__dirname, '../locales');

	private _canGenerate = true;

	constructor(private _options: LocaleFilesOptions) {
	}

	exportLocales(): void {
		const outputLocalesDirectory = path.join(this._options.outputDirectory, '_locales');
		if (fs.existsSync(outputLocalesDirectory)) {
			fs.rmSync(outputLocalesDirectory, { recursive: true });
		}
		fs.mkdirSync(outputLocalesDirectory);

		const localeItems = new Map([
			['ja', 'ja.ts'],
		].map(i => [
			i[0],
			path.join(this._options.inputDirectory, i[1])
		]));

		for (const [key, localePath] of localeItems) {
			const outputDirectory = path.join(outputLocalesDirectory, key!);
			fs.mkdirSync(outputDirectory);

			const outputPath = path.join(outputDirectory, 'messages.json');
			const localeTypeScript = fs.readFileSync(localePath).toString();
			const localeJavaScript = ts.transpile(localeTypeScript);
			const localeItem = eval(localeJavaScript);
			const outputContent = JSON.stringify(localeItem);
			fs.writeFileSync(outputPath, outputContent);
			console.log(LocaleFilesPlugin.pluginName, '[create]', outputPath);
		}
	}


	apply(compiler: webpack.Compiler) {
		compiler.hooks.watchRun.tapPromise(LocaleFilesPlugin.pluginName, async (compilation) => {
			if (compilation.modifiedFiles) {
				for (const path of compilation.modifiedFiles) {
					if (path.startsWith(LocaleFilesPlugin.baseDir)) {
						console.debug(LocaleFilesPlugin.pluginName, 'UPDATE');
						this._canGenerate = true;
					}
				}
			}
		});

		compiler.hooks.afterCompile.tapPromise(LocaleFilesPlugin.pluginName, async (compilation) => {
			if (compiler.watchMode) {
				const files = fs.readdirSync(LocaleFilesPlugin.baseDir)
					.filter(i => i.endsWith('.ts'))
					.map(i => path.join(LocaleFilesPlugin.baseDir, i))
					;
				for (const file of files) {
					compilation.fileDependencies.add(file);
				}
			}

			if (this._canGenerate) {
				this.exportLocales();
			}

			this._canGenerate = false;
		});
	}

}
