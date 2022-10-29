module.exports = {
	"extends": "eslint:recommended",
	"plugins": [
		"@typescript-eslint"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		"sourceType": "module",
		"project": "./tsconfig.json"
	},
	root: true
};
