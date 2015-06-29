'use strict';

module.exports = [
	[
		{
			chart: 'map',
			scene: 'map',
			options: {
				duration: 100
			}
		},
		{
			chart: 'bubbles',
			scene: 'map',
			options: {
				duration: 100
			}
		}
	],
	{
		chart: 'bubbles',
		scene: 'first',
		options: {
			duration: 200
		}
	},
	{
		chart: 'bubbles',
		scene: 'last',
		options: {
			duration: 300
		}
	}
];
