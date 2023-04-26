module.exports = {
	transpileDependencies: [
		"primevue",
		"chart.js",
		"vue-chartjs",
		"read-excel-file"
	],
	devServer:{
		host: 'localhost'
	},

	publicPath: process.env.NODE_ENV === 'production' ? '/3PL/' : '/',
}