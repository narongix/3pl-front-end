module.exports = {
	transpileDependencies: [
		"primevue",
		"chart.js",
		"vue-chartjs"
	],
	devServer:{
		host: 'localhost'
	},

	publicPath: process.env.NODE_ENV === 'production' ? '/3PL/' : '/',
}