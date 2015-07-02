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
		axes: {},
		attributes: {},
		style: {}
	},

	databind() {

		var config = chart.config;
		var data = config.histogramValues;

		// DATAJOIN
		var bars = config.main.selectAll('rect')
			.data(data, (d, i) => i);

		// UPDATE
		bars
			.transition()
			.duration(chart.getDuration())
			.delay(chart.getDelay())
			.ease(chart.getEasing())
			.attr(config.attributes);

		// ENTER
		bars.enter().append('rect')
			.attr(config.attributes);

		chart.displayAxes();
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

	setupAxes() {

		var config = chart.config;
		var scales = config.scales;

		config.axes.x = d3.svg.axis()
			.scale(scales.x)
			.orient('bottom')
			.tickValues(config.histogramValues.map(d => d.x));

		config.axes.y = d3.svg.axis()
			.scale(scales.y)
			.orient('left')
			.tickSize(-config.width)
			.tickValues([100, 300, 500, scales.y.domain()[1]]);
	},

	displayAxes() {

		var config = chart.config;
		var axes = config.axes;

		// X X X X X X X X X X X X X X X X X X X X X X
		var xAxisSelection = config.scenes.select('g.x.axis')
			.transition()
			.duration(chart.getDuration())
			.call(axes.x);

		// Fade it out
		xAxisSelection.attr({opacity: config.displayAxes ? 1 : 0});

		// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y
		var yAxisSelection = config.scenes.select('g.y.axis')
			.transition()
			.duration(chart.getDuration())
			.call(axes.y);

		// Fade it out
		yAxisSelection.attr({opacity: config.displayAxes ? 1 : 0});
	},

	scenes: {

		setup() {

			var config = chart.config;
			var scales = config.scales;

			config.attributes = {
				x: d => scales.x(d.x),
				width: 0,
				y: d => scales.y(d.y),
				height: function (d) {
					var result = config.height - scales.y(d.y);
					if (result > 0 && result < 1) {
						result = 1;
					}
					return result;
				}
			};

			config.displayAxes = false;
		},

		main() {

			chart.scenes.setup();

			var config = chart.config;
			var scales = config.scales;

			config.attributes.width = d => scales.x(d.dx) - 1;

			config.displayAxes = true;
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
