var Path = require("path");

module.exports = {
	entry: ["./source/index.js"],
	module: {
		loaders: [
			{
				exclude: /node_modules/,
				loader: "babel",
				test: /\.js$/
			},
			{
				exclude: /node_modules/,
				loader: "pegjs",
				test: /\.peg$/
			}
		]
	},
	output: {
		filename: "index.js",
		libraryTarget: "commonjs2",
		path: "./dist",
		target: "browser"
	},
	resolve: { root: Path.join(__dirname, "node_modules") }
};
