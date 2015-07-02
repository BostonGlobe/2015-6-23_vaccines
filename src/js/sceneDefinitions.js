'use strict';

module.exports = [
	[
		{
			chart: 'bubbles',
			scene: 'map',
			options: {
				duration: 2000,
				delay: 0
			}
		},
		{
			chart: 'histogram',
			scene: 'setup',
			options: {
				duration: 2000,
				delay: 0
			}
		}
	],
	[
		{
			chart: 'bubbles',
			scene: 'histogram',
			options: {
				duration: 1000,
				delay: function(d, i) {
					return i * 3;
				}
			}
		},
		{
			chart: 'histogram',
			scene: 'setup',
			options: {
				duration: 2000,
				delay: 0
			}
		}
	],
	[
		{
			chart: 'bubbles',
			scene: 'histogramFadeout',
			options: {
				duration: 250,
				delay: 0
			}
		},
		{
			chart: 'histogram',
			scene: 'main',
			options: {
				duration: 500,
				delay: 0
			}
		}
	]
];
