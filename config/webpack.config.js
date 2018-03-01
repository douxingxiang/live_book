const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: "./src/index.js",

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js"
	},
	
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, "src")
				],
				loader: "babel-loader",

				options: {
					preset: ["env"]
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
