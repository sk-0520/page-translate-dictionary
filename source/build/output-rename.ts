/**
 * web-ext が _locale/<i18n>/message.json[name] を読まないし指定もできない件。
 *
 * short_name がほしいので package.json から name, version を引っ張ってくる。
 */
import path from 'path';
import fs from 'fs';

const browser = process.argv[2];
console.debug('browser', browser);

const rootDirectory = path.resolve(__dirname, '../../');
const inputDirectory = path.join(rootDirectory, 'dist/web-ext-artifacts');
const packageJsonPath = path.join(rootDirectory, 'package.json');

console.debug('inputDirectory', inputDirectory);
console.debug('packageJsonPath', packageJsonPath);

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());
const shortName = packageJson['name'];
const version = packageJson['version'];

const inputFilePath = path.join(inputDirectory, `_-${version}.zip`);
const outputFilePath = path.join(inputDirectory, `${shortName}-${version}.zip`);

if (!fs.existsSync(inputFilePath)) {
	throw new Error('fs.existsSync: ' + inputFilePath);
}
if (fs.existsSync(outputFilePath)) {
	fs.unlinkSync(outputFilePath);
}

fs.renameSync(inputFilePath, outputFilePath);

console.info('rename', { inputFilePath, outputFilePath });
