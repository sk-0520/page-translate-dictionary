module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
	},
	"extends": "eslint:recommended",
	"plugins": [
		"@typescript-eslint",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		"sourceType": "module",
		"project": "./tsconfig.json"
	},
	rules: {

	},
};
