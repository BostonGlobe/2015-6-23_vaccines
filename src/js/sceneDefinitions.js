'use strict';

module.exports = [
	[
		{
			chart: 'bubbles',
			scene: 'map',
			options: {
				duration: 2000,
				delay: 0
				// delay: function(d, i) {
				// 	return i * 5;
				// }
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
				duration: 2000,
				delay: function(d, i) {
					return i * 5;
				}
			}
		},
		{
			chart: 'histogram',
			scene: 'main',
			options: {
				duration: 2000,
				delay: function(d, i) {
					return i * 250;
				}
			}
		}
	]
];
