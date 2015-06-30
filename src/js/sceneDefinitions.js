'use strict';

module.exports = [
	[
		{ chart: 'bubbles',   scene: 'map',       options: { duration: 2000 } },
		{ chart: 'histogram', scene: 'setup',     options: { duration: 2000 } }
	],
	[
		{ chart: 'bubbles',   scene: 'histogram', options: { duration: 2000 } },
		{ chart: 'histogram', scene: 'main',      options: { duration: 2000 } }
	]
];
