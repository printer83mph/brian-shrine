const path = require('path');

module.exports = {
	entry: './public/javascripts/jeremychat.js',
	mode: 'development',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './public/javascripts/dist')
	},
	node: {
		fs: 'empty',
		tls: 'empty',
		net: 'empty'
	},
};