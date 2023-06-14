module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{jpg,otf,png,mp3,js,html,css,json,ico,eot,svg,ttf,woff,woff2,manifest,properties,psd,md,ts}'
	],
	swDest: 'sw.js',
	swSrc: 'sw.js',
	maximumFileSizeToCacheInBytes:10000000,
};