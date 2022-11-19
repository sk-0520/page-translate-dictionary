import path from 'path';
import fs from 'fs';

const checker = require('license-checker');

const rootDirectoryPath = path.resolve(__dirname, '..', '..');
const packageJsonFilePath = path.join(rootDirectoryPath, 'package.json');
const outputFilePath = path.join(rootDirectoryPath, 'source', 'scripts', 'extension', 'options', 'license.json');

const json = JSON.parse(fs.readFileSync(packageJsonFilePath).toString());
const devDependencies = new Set(Object.keys(json['devDependencies']));

checker.init({
	start: rootDirectoryPath,
}, function (error: any, packages: Object) {
	if (error) {
		throw new Error(error);
	}

	const map = new Map<string, object>();

	for (const [key, value] of Object.entries(packages)) {
		const versionSeparatorIndex = key.lastIndexOf('@');
		const name = key.substring(0, versionSeparatorIndex);
		const version = key.substring(versionSeparatorIndex + 1)

		if (devDependencies.has(name)) {
			map.set(name, {
				module: key,
				version: version,
				publisher: value["publisher"],
				licenses: value["licenses"],
				repository: value["repository"],
			});
		}
	}

	fs.writeFileSync(outputFilePath, JSON.stringify(Object.fromEntries(map), undefined, 2));
})


