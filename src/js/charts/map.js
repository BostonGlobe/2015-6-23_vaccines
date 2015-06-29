'use strict';

// var d3 = require('d3');
var d3util = require('../d3util');

let chartFactory = require('./chartFactory');

let chart = chartFactory({

	NAME: 'map',

	config: {
		datasets: require('../datasets'),
		scales: {}
	},

	databind() {

		var config = chart.config;

		// DATA JOIN
		var paths = config.main.selectAll('path')
			.data(config.datasets.state);

		// config.main.append('path')
		// 	.datum(config.data)


		// var circles = chart.config.main.selectAll('circles')

		// // UPDATE
		// rects.transition()
		// 	.duration(config.duration)
		// 	.attr(config.attributes)
		// 	.style(config.style);

		// ENTER
		paths.enter().append('path')
			.attr('d', config.path);

		// circles.enter().append('circle')
		// 	.attr(chart.config.attributes);
			// .style(config.style);
	},

	setupScales() {

		var config = chart.config;

		config.path = d3util.prepareProjectionPath({
			datum: config.datasets.state[0],
			width: config.width,
			height: config.height
		}).path;
	},

	setupAxes() {

	},

	scenes: {

		setup() {

			// chart.config.scales.x.domain(d3.extent(chart.config.data, d => d.lng));
			// chart.config.scales.y.domain(d3.extent(chart.config.data, d => d.lat));

			// chart.config.attributes = {
			// 	cx: d => chart.config.scales.x(d.lng),
			// 	cy: d => chart.config.scales.y(d.lat),
			// 	r: 1
			// };

		},

		map(options) {

			chart.scenes.setup(options);

			console.log(options);

		}

	}

});

module.exports = {
	draw: function(...x) {
		chart.draw(...x);
	}
};
