'use strict';

var d3 = require('d3');
var d3util = require('../d3util');
let chartFactory = require('./chartFactory');

// Utility function.
function log(s) {
	console.log(JSON.stringify(s, null, 4));
}

let chart = chartFactory({

	NAME: 'bubbles',

	config: {
		datasets: require('../datasets'),
		scales: {},
		attributes: {
			cx: 10,
			cy: 10,
			r: 10
		}
	},

	databind() {

		var config = chart.config;

		// DATA JOINS
		var circles = config.main.selectAll('circles')
			.data(config.datasets.schools, d => [d.school, d.city].join(''));

		// // // // UPDATE
		// // // rects.transition()
		// // // 	.duration(config.duration)
		// // // 	.attr(config.attributes)
		// // // 	.style(config.style);

		// ENTER
		circles.enter().append('circle')
			.attr(config.attributes);
		// 	// .style(config.style);
	},

	setupScales() {

		// var config = chart.config;
		// var scales = config.scales;

		// scales.x = d3.scale.linear().range([0, config.width]);
		// scales.y = d3.scale.linear().range([config.height, 0]);
	},

	setupAxes() {

	},

	scenes: {

		setup() {

			var config = chart.config;
			var datasets = config.datasets;
			var scales = config.scales;
			var x = scales.x;
			var y = scales.y;
			var radius = scales.radius;
			var schools = datasets.schools;

			config.projection = d3util.prepareProjectionPath({
				datum: datasets.state[0],
				width: config.width,
				height: config.height
			}).projection;

			x = d => config.projection([d.lng, d.lat])[0];
			y = d => config.projection([d.lng, d.lat])[1];

			radius = d3.scale.sqrt()
				.domain([0, d3.max(schools, d => d.exemption)])
				.range([0, 20]);

			config.attributes = {
				cx: d => x(d),
				cy: d => y(d),
				r: d => radius(d.exemption)
			};
		},

		map(options) {

			chart.scenes.setup(options);

			console.log(options);

		},

		first(options) {

			chart.scenes.setup(options);

			console.log(options);

		},

		last(options) {

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

// // 		config.attributes.width = config.scales.x.range()[1] / (config.data.length/2);

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

// // 		config.attributes.y = d => d.name === 'lateTrips' ?
// // 			config.height - (config.scales.y(d.y0) - config.scales.y(d.y1)) :
// // 			config.scales.y.range()[0];

// // 		config.attributes.height = d => d.name === 'lateTrips' ?
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
