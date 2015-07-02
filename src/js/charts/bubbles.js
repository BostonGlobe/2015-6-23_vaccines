'use strict';

var d3 = require('d3');
var d3util = require('../d3util');
let chartFactory = require('./chartFactory');
var _ = require('lodash');
var sceneMaker = require('../sceneMaker');

// Utility function.
function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

// from https://groups.google.com/forum/#!topic/d3-js/WC_7Xi6VV50
function endall(transition, callback) {
	var n = 0;
	transition
		.each(function() { ++n; })
		.each('end', function() { if(!--n) { callback.apply(this, arguments); } });
}

let chart = chartFactory({

	NAME: 'bubbles',

	config: {
		binCount: 20,
		datasets: require('../datasets'),
		scales: {},
		attributes: {},
		style: {},
		end: function() {}
	},

	databind() {

		var config = chart.config;

		// DATA JOINS
		var circles = config.main.selectAll('circle')
			.data(config.datasets.schools, d => [d.school, d.city].join(''));

		// UPDATE
		circles
			.transition()
			.duration(chart.getDuration())
			.delay(chart.getDelay())
			.call(endall, config.end)
			.attr(config.attributes)
			.style(config.style);

		// ENTER
		circles.enter().append('circle')
			.attr(config.attributes)
			.attr('class', d => d.exemption > 0 ? 'some' : 'none')
			.style(config.style);
	},

	setupScales() {},

	setupAxes() {},

	scenes: {

		setup() {

			var config = chart.config;
			var datasets = config.datasets;
			var scales = config.scales;
			var schools = datasets.schools;

			config.projection = d3util.prepareProjectionPath({
				datum: datasets.state[0],
				width: config.width,
				height: config.height
			}).projection;

			var x = d => config.projection([d.lng, d.lat])[0];
			var y = d => config.projection([d.lng, d.lat])[1];

			config.attributes = {
				cx: d => x(d),
				cy: d => y(d),
				r: 0
			};

			scales.radius = d3.scale.sqrt()
				.domain([0, d3.max(schools, d => d.exemption)])
				.range([0, 10]);

			config.style.opacity = 0;
			config.attributes.r = d => d.exemption > 0 ? scales.radius(d.exemption) : 1;

			config.end = function() {};
		},

		map() {

			chart.scenes.setup();

			var config = chart.config;
			config.style.opacity = 1;

			config.end = function() {};
		},

		histogram() {

			chart.scenes.map();

			var config = chart.config;

			var schools = config.datasets.schools;

			var x = d3.scale.linear()
				.domain(d3.extent(schools, d => d.exemption))
				.range([0, config.width]);

			// Generate a histogram using twenty uniformly-spaced bins.
			var histogram = d3.layout.histogram()
				.bins(x.ticks(config.binCount));

			var histogramValues = histogram(schools.map(d => d.exemption));

			var maxY = _(histogramValues)
				.pluck('length')
				.max();

			var y = d3.scale.linear()
				.domain([0, maxY])
				.range([config.height, 0]);

			// Create bin lengths so we can sort the bubbles.
			// e.g. [0, 884, 930, 935, 936, 936, 937, 937, 937, 938]
			var binLengths = histogramValues
				.map(d => d.length)
				.map((d, i, a) => _(a).take(i + 1).sum());

			binLengths.unshift(0);

			config.attributes.cx = function(d, i) {

				// Given this element's index, find its bin.
				var index = _.findIndex(binLengths, binLength => i < binLength) - 1;

				var bin = histogramValues[index];

				return x(bin.x);
			};

			config.attributes.cy = function(d, i) {

					// Given this element's index, find the bin's starting point.
				// e.g. if i = 937, get 936
				var startingPoint = _(binLengths)
					.sortBy(datum => -datum)
					.find(binLength => i >= binLength);

				return y(i - startingPoint + 1);
			};

			config.attributes.r = 1;

			config.end = function() {
				// sceneMaker.next();
			};
		},

		histogramFadeout() {

			chart.scenes.histogram();

			var config = chart.config;

			config.style.opacity = 0;

			config.end = function() {};
		}
	}

});

module.exports = {
	draw: function(...x) {
		chart.draw(...x);
	}
};
