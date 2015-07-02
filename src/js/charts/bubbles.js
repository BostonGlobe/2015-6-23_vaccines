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
		var duration = config.duration;
		var delay = config.delay;

		// DATA JOINS
		var circles = config.main.selectAll('circle')
			.data(config.datasets.schools, d => [d.school, d.city].join(''));

		// UPDATE
		circles
			.transition()
			.duration(duration)
			.delay(delay)
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
				sceneMaker.next();
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








// 'use strict';

// var d3 = require('d3');

// var config = {
// };

// function setupUtilityVariables() {

// }

// function setupScales() {

// }

// function setupAxes() {

// }

// function databind() {



// }

// var scenes = {

// 	setup(options) {

// 		console.log(config.data);
// 	},

// 	map(options) {

// 		scenes.setup(options);

// 	}

// };

// function draw() {
// }

// // function setup() {

// // 	// Set various utility variables.
// // 	config.svg = d3.select('svg.scenes');
// // 	config.width = +config.svg.attr('_innerWidth');
// // 	config.height = +config.svg.attr('_innerHeight');
// // 	config.scene = config.svg.select('g.scene.daily-trips');
// // 	config.chart = config.scene.select('g.chart');

// // 	setupScales();
// // 	setupAxes();

// // 	// Get data keys to use in creating the color scale.
// // 	var dataKeys = _.chain(config.data)
// // 		.pluck('name')
// // 		.uniq()
// // 		.value();

// // 	config.scales.color.domain(dataKeys);
// // }

// module.exports = {

// 	draw(scene, opts) {

// 		setupUtilityVariables();
// 		setupScales();
// 		setupAxes();
// 		scenes[scene](opts);
// 		draw();

// 	}

// // 	'draw': function(opts) {
// // 		setTimeout(function() {
// // 			setup();
// // 			configuration[opts.scene](opts);
// // 			draw();
// // 		}, opts.delay);
// // 	}

// };






// // var MAGIC = {
// // 	dark: '#d1d1c7',
// // 	red: '#ea212d',
// // 	singleBarWidth: 50
// // };

// // function databind() {

// // 	var rects;

// // 	if (!config.useCanvas) {


// // 	} else {

// // 		// rects = opts.dataContainer.selectAll('custom.rect.daily-trips')
// // 		// 	.data(data, d => `${d.name}${d.date}`);

// // 		// // UPDATE
// // 		// rects.transition()
// // 		// 	.duration(opts.duration)
// // 		// 	.attr(opts.attributes)
// // 		// 	.attr({fillStyle: d => scales.color(d.name)});

// // 		// // ENTER
// // 		// rects.enter().append('custom')
// // 		// 	.attr('class', 'rect daily-trips')
// // 		// 	.attr(opts.attributes)
// // 		// 	.attr({fillStyle: d => scales.color(d.name)});

// // 	}

// // }

// // function setupScales() {
// // }

// // function setupAxes() {

// // 	config.axes.x = d3.svg.axis()
// // 		.scale(config.scales.x)
// // 		.orient('bottom');

// // 	config.axes.y = d3.svg.axis()
// // 		.scale(config.scales.y)
// // 		.orient('left');
// // }

// // function displayAxes() {

// // 	// X X X X X X X X X X X X X X X X X X X X X X 
// // 	var xAxisSelection = config.scene.select('g.x.axis')
// // 		.transition()
// // 		.duration(config.duration)
// // 		.call(config.axes.x);

// // 	// Fade it out
// // 	xAxisSelection.attr({opacity: config.displayAxes.x ? 1 : 0});

// // 	// Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y Y 
// // 	var yAxisSelection = config.scene.select('g.y.axis')
// // 		.transition()
// // 		.duration(config.duration)
// // 		.call(config.axes.y);

// // 	// Fade it out
// // 	yAxisSelection.attr({opacity: config.displayAxes.y ? 1 : 0});
// // }

// // function draw() {
// // 	databind();
// // 	displayAxes();
// // }


// // var config = {
// // 	svg: null,
// // 	width: null,
// // 	height: null,
// // 	scene: null,
// // 	chart: null,
// // 	useCanvas: false,
// // 	data: require('./../datasets.js').tripsPerDay,
// // 	scales: { x: null, y: null },
// // 	axes: { x: null, y: null },
// // 	displayAxes: {
// // 		x: true,
// // 		y: true
// // 	},
// // 	attributes: {
// // 		x: 0,
// // 		width: 0,
// // 		y: 0,
// // 		height: 0
// // 	},
// // 	style: {
// // 		fill: 'purple'
// // 	},

// // };

// // var configuration = {
// // 	'setup': function(opts) {

// // 		config.duration = opts.duration;
// // 		config.useCanvas = opts.useCanvas;
// // 		config.dataContainer = opts.dataContainer;

// // 		config.scales.x.domain(d3.extent(_.take(config.data, 4), d => d.date));
// // 		config.scales.y.domain([0, 0]);
// // 		config.scales.color.range([MAGIC.dark, MAGIC.dark]);

// // 		config.attributes = {
// // 			x: d => config.scales.x(d.date),
// // 			width: MAGIC.singleBarWidth,
// // 			y: d => config.scales.y(d.y1),
// // 			height: d => config.scales.y(d.y0) - config.scales.y(d.y1)
// // 		};

// // 		config.style = {
// // 			fill: d => config.scales.color(d.name)
// // 		};

// // 		config.displayAxes = { x: false, y: false };

// // 		TweenMax.to($('.x-axis-label', '.daily-trips-labels'), opts.duration/1000, {opacity: 0});
// // 	},
// // 	'first-day': function(opts) {

// // 		configuration['setup'](opts);

// // 		config.displayAxes = { x: false, y: true };
// // 		config.scales.y.domain([0, d3.max(_.take(config.data, 2), d => d.y1)]);
// // 		config.axes.x
// // 			.tickSize(0)
// // 			.tickPadding(6);

// // 		config.axes.y
// // 			.tickValues([config.scales.y.domain()[1]])
// // 			.tickSize(-config.width);

// // 		config.axes.x.ticks(d3.time.months, 3).tickFormat(null);

// // 		TweenMax.to($('.x-axis-label', '.daily-trips-labels'), opts.duration/1000, {opacity: 1});
// // 		$('.x-axis-label span', '.daily-trips-labels').text('Bus trips');
// // 	},
// // 	'all-days': function(opts) {

// // 		configuration['first-day'](opts);

// // 		config.scales.x.domain(d3.extent(config.data, d => d.date));
// // 		config.scales.y.domain([0, d3.max(config.data, d => d.y1)]);

// // 		config.attributes.after.width = config.scales.x.range()[1] / (config.data.length/2);

// // 		config.axes.y.tickValues([0, 500, 1000, config.scales.y.domain()[1]]);
// // 		config.displayAxes.x = true;
// // 	},
// // 	'early-and-late': function(opts) {

// // 		configuration['all-days'](opts);

// // 		config.scales.color.range([MAGIC.dark, MAGIC.red]);
// // 	},
// // 	'late': function(opts) {

// // 		configuration['early-and-late'](opts);

// // 		// Get the highest number of late trips
// // 		var maxLateTrips = _.chain(config.data)
// // 			.filter({name: 'lateTrips'})
// // 			.map(d => d.y1 - d.y0)
// // 			.sortBy(d => d)
// // 			.last()
// // 			.value();
// // 		config.scales.y.domain([0, maxLateTrips]);

// // 		config.attributes.after.y = d => d.name === 'lateTrips' ?
// // 			config.height - (config.scales.y(d.y0) - config.scales.y(d.y1)) :
// // 			config.scales.y.range()[0];

// // 		config.attributes.after.height = d => d.name === 'lateTrips' ?
// // 			config.scales.y(d.y0) - config.scales.y(d.y1) :
// // 			0;

// // 		config.axes.y.tickValues([0, 200, 400, config.scales.y.domain()[1]]);

// // 		$('.x-axis-label span', '.daily-trips-labels').text('Late bus trips');
// // 	},
// // 	'exit': function(opts) {

// // 		configuration['setup'](opts);

// // 		config.displayAxes.x = false;
// // 		config.displayAxes.y = false;

// // 		TweenMax.to($('.x-axis-label', '.daily-trips-labels'), opts.duration/1000, {opacity: 0});
// // 	}
// // };
