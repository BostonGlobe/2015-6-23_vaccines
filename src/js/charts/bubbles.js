'use strict';

var d3 = require('d3');
var d3util = require('../d3util');
let chartFactory = require('./chartFactory');
var _ = require('lodash');
var sceneMaker = require('../sceneMaker');
var DOMutil = require('../DOMutil');

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
		binCount: 40,
		datasets: require('../datasets'),
		scales: {},
		attributes: {},
		style: {},
		end: function() {},
		showMap: false
	},

	databind() {

		var config = chart.config;
		var datasets = config.datasets;

		// DATA JOINS
		var paths = config.main.selectAll('path.map')
			.data(datasets.state);

		// ENTER
		paths.enter().append('path')
			.style('opacity', 0)
			.attr({
				'class': 'map',
				d: config.projectionPath.path
			});

		// DATA JOINS
		var circles = config.main.selectAll('circle')
			.data(datasets.schools, d => [d.school, d.city].join(''));

		// UPDATE
		circles
			.transition()
			.duration(chart.getDuration())
			.delay(chart.getDelay())
			.ease(chart.getEasing())
			.call(endall, config.end)
			.attr(config.attributes)
			.style(config.style);

		// ENTER
		circles.enter().append('circle')
			.attr(config.attributes)
			.attr('class', function (d) {
				var list = [];
				list.push(d.exemption > 0 ? 'some' : 'none');
				list.push(d.highlight ? 'highlight' : '');

				return list.join(' ');
			})
			.style(config.style)
			.on('mouseover', function (d) {
				d3.select(this).classed('highlight', true);
				console.log(d);
			})
			.on('mouseout', function() {
				d3.select(this).classed('highlight', false);
			});

		// DATA JOINS
		var labels = config.annotations.selectAll('div.annotation')
			.data(_(datasets.schools).filter({highlight: true}).sortBy(d => -d.exemption).value(), d => [d.school, d.city].join(''));

		// ENTER
		labels.enter().append('div')
			.attr({
				'class': 'annotation label'
			})
			.style({
				top: d => config.attributes.cy(d) + 'px',
				left: d => config.attributes.cx(d) + 'px'
			})
			.html((d, i) => `
				<div><span class='rate theta'>${d.exemption}%${i === 0 ? ' exempt' : ''}</span></div>
				<div><span class='school'>${DOMutil.titleCase(d.school)}, ${DOMutil.titleCase(d.city)}</span></div>
			`);
	},

	setupScales() {},

	setupAxes() {},

	scenes: {

		setup() {

			var config = chart.config;
			var datasets = config.datasets;
			var scales = config.scales;
			var schools = datasets.schools;

			config.projectionPath = d3util.prepareProjectionPath({
				datum: datasets.state[0],
				width: config.width,
				height: config.height
			});

			var projection = config.projectionPath.projection;

			var x = d => projection([d.lng, d.lat])[0];
			var y = d => projection([d.lng, d.lat])[1];

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
			config.annotations.classed('hide', true);
		},

		map() {

			chart.scenes.setup();

			var config = chart.config;
			config.style.opacity = 1;

			config.end = function() {
				// Get correct chatter and show it.
				var chatter = document.querySelector(`.scene-maker.chatter .chatter[data-step='2']`);
				DOMutil.removeClass(chatter, 'hide');

				// Show map
				config.main.selectAll('path.map')
					.transition()
					.duration(chart.getDuration())
					.delay(chart.getDelay())
					.ease(chart.getEasing())
					.style('opacity', 1);

				config.annotations.classed('hide', false);
			};
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

			config.end = config.moveForward ? sceneMaker.next : sceneMaker.previous;

			// Hide map
			config.main.selectAll('path.map')
				.transition()
				.duration(chart.getDuration())
				.delay(chart.getDelay())
				.ease(chart.getEasing())
				.style('opacity', 0);
		},

		histogramFadeout() {

			chart.scenes.histogram();

			var config = chart.config;

			config.style.opacity = 0;

			config.end = function() {
				// Get correct chatter and show it.
				var chatter = document.querySelector(`.scene-maker.chatter .chatter[data-step='0']`);
				DOMutil.removeClass(chatter, 'hide');
			};
		}
	}

});

module.exports = {
	draw: function(...x) {
		chart.draw(...x);
	}
};
