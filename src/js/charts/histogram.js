'use strict';

var d3 = require('d3');
let chartFactory = require('./chartFactory');

// Utility function.
function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

let chart = chartFactory({

	NAME: 'histogram',

	config: {
		datasets: require('../datasets'),
		histogramValues: [],
		binCount: 20,
		scales: {},
		attributes: {},
		style: {}
	},

	databind() {

		var config = chart.config;
		var data = config.histogramValues;
		var duration = config.duration;
		var delay = config.delay;

		// DATAJOIN
		var bars = config.main.selectAll('rect')
			.data(data, (d, i) => i);

		// UPDATE
		bars
			.transition()
			.duration(duration)
			.delay(delay)
			.attr(config.attributes);

		// ENTER
		bars.enter().append('rect')
			.attr(config.attributes);
	},

	setupScales() {

		var config = chart.config;
		var schools = config.datasets.schools;
		var scales = config.scales;

		scales.x = d3.scale.linear()
			.domain(d3.extent(schools, d => d.exemption))
			.range([0, config.width]);

		// Generate a histogram using twenty uniformly-spaced bins.
		config.histogramValues = d3.layout.histogram()
			.bins(scales.x.ticks(config.binCount))(schools.map(d => d.exemption));

		scales.y = d3.scale.linear()
			.domain([0, d3.max(config.histogramValues, d => d.y)])
			.range([config.height, 0]);
	},

	setupAxes() {},

	scenes: {

		setup() {

			var config = chart.config;
			var scales = config.scales;

			config.attributes = {
				x: d => scales.x(d.x),
				width: d => scales.x(d.dx),
				y: config.height,
				height: 0
			};
		},

		main() {

			chart.scenes.setup();

			var config = chart.config;
			var scales = config.scales;

			config.attributes.y = d => scales.y(d.y);
			config.attributes.height = d => config.height - scales.y(d.y);
		}

	}

});

module.exports = {
	draw: function(...x) {
		chart.draw(...x);
	},
	binCount() {
		return chart.config.binCount;
	}
};
