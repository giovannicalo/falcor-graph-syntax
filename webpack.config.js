var Path = require("path");

var Webpack = require("webpack");

module.exports = {
	entry: [
		"webpack-dev-server/client?http://localhost:8080",
		"webpack/hot/only-dev-server",
		"./source/index.js"
	],
	module: {
		loaders: [{
			exclude: /node_modules/,
			loaders: ["react-hot", "babel?stage=0"],
			test: /\.js$/
		}]
	},
	output: {
		filename: "main.js",
		path: "./www",
		target: "browser"
	},
	plugins: [new Webpack.HotModuleReplacementPlugin()],
	resolve: { root: Path.join(__dirname, "node_modules") }
};
