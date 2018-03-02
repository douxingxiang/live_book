const path = require('path');
const webpack = require('webpack');
const root_dir = "./";
module.exports = {
	entry: "./src/index.js",

	output: {
		path: path.resolve(root_dir, "dist"),
		filename: "index.js"
	},
	
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.resolve(root_dir, "src")
				],
				loader: "babel-loader",

				options: {
					presets: ["env"]
				}
			}
		]
	},

	devtool: "source-map",

	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true
	},

	optimization: {
		minimize: false
	},

	plugins: [
		//new config.optimization.splitChunks({
		//	name: 'common',
		//	filename: "common.js"
		//}),

		//new webpack.optimize.UglifyJsPlugin({
		//	}),

		new webpack.DefinePlugin({
			'process.env.NODE_ENV': 'development'
		}),

		new webpack.BannerPlugin({
			banner: "development build",
			raw: true,
			entryOnly: true
		})
	],

	mode: "development"
};
