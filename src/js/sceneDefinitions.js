'use strict';

module.exports = [
	[
		{
			chart: 'bubbles',
			scene: 'map',
			options: {
				duration: {
					forward: 1000,
					backward: 2000
				},
				delay: {
					forward: (d, i) => i * 3,
					backward: (d, i) => i * 3
				},
				easing: {
					forward: 'cubic-in-out',
					backward: 'cubic-out'
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
				},
				easing: {
					backward: 'cubic-out'
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
						return i * 3;
					},
					backward: 0
				},
				easing: {
					forward: 'cubic-in',
					backward: 'cubic-in'
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
				},
				easing: {
					forward: 'cubic-in',
					backward: 'cubic-in'
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
					forward: 500,
					backward: 0
				},
				delay: {
					forward: 0,
					backward: 0
				},
				easing: {
					forward: 'cubic-out'
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
				},
				easing: {
					forward: 'cubic-out'
				}
			}
		}
	]
];
