module.exports = {
	transpileDependencies: [
		"primevue"
	],
	devServer:{
		host: 'localhost'
	},

	publicPath: process.env.NODE_ENV === 'production' ? '/3PL/' : '/',
}