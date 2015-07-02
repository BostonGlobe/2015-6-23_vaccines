'use strict';

module.exports = [
	[
		{
			chart: 'bubbles',
			scene: 'map',
			options: {
				duration: {
					forward: 1000,
					backward: 1000
				},
				delay: {
					forward: (d, i) => i * 1,
					backward: (d, i) => i * 1
				}
			}
		},
		{
			chart: 'histogram',
			scene: 'setup',
			options: {
				duration: {
					forward: 0,
					backward: 0
				},
				delay: {
					forward: 0,
					backward: 0
				}
			}
		}
	],
	[
		{
			chart: 'bubbles',
			scene: 'histogram',
			options: {
				duration: {
					forward: 1000,
					backward: 1000
				},
				delay: {
					forward: function(d, i) {
						return i * 1;
					},
					backward: 0
				}
			}
		},
		{
			chart: 'histogram',
			scene: 'setup',
			options: {
				duration: {
					forward: 1000,
					backward: 1000
				},
				delay: {
					forward: 1000,
					backward: 0
				}
			}
		}
	],
	[
		{
			chart: 'bubbles',
			scene: 'histogramFadeout',
			options: {
				duration: {
					forward: 1000,
					backward: 0
				},
				delay: {
					forward: 0,
					backward: 0
				}
			}
		},
		{
			chart: 'histogram',
			scene: 'main',
			options: {
				duration: {
					forward: 1000,
					backward: 0
				},
				delay: {
					forward: 0,
					backward: 0
				}
			}
		}
	]
];
